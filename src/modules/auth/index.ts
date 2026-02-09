import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

import {
  AdminInitiateAuthCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { Amplify, Auth } from 'aws-amplify';

/**
 * Locates the AWS CLI executable by checking common installation paths.
 * Falls back to 'aws' if not found (assumes it's in PATH).
 *
 * @returns Full path to AWS CLI or 'aws' as fallback
 */
function findAwsCli(): string {
  const commonPaths = [
    '/usr/local/bin/aws', // Homebrew (Intel)
    '/opt/homebrew/bin/aws', // Homebrew (Apple Silicon)
    '/usr/bin/aws', // System default
    '/usr/local/aws-cli/aws', // Manual installation
  ];

  for (const path of commonPaths) {
    if (existsSync(path)) {
      return path;
    }
  }

  // Fallback to PATH lookup
  return 'aws';
}

function detectAwsProfile(): string | null {
  try {
    const homeDir = process.env.HOME || process.env.USERPROFILE;
    if (!homeDir) return null;

    // Get current AWS account ID from active session
    const awsCli = findAwsCli();
    const accountId = execSync(
      `${awsCli} sts get-caller-identity --query Account --output text`,
      { encoding: 'utf-8', timeout: 10000 },
    ).trim();

    if (!accountId) return null;

    // Parse ~/.aws/config to find matching profile
    const configPath = join(homeDir, '.aws', 'config');
    const configContent = readFileSync(configPath, 'utf-8');

    let currentProfile: string | null = null;
    for (const line of configContent.split('\n')) {
      const profileMatch = line.match(/\[profile ([^\]]+)\]/);
      if (profileMatch) {
        currentProfile = profileMatch[1];
      } else if (
        currentProfile &&
        line.includes('sso_account_id') &&
        line.includes(accountId)
      ) {
        return currentProfile;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export type LoginUserResponse = {
  authId: string;
  userId: string;
  idToken: string;
  accessToken: string;
};

export async function loginUser(
  username: string,
  password: string,
  region: string,
  userPoolId: string,
  clientId: string,
): Promise<LoginUserResponse> {
  Amplify.configure({
    Auth: {
      region,
      userPoolId,
      userPoolWebClientId: clientId,
    },
  });

  const user = await Auth.signIn({ username, password });

  const authId = user?.username;
  const userId = user?.signInUserSession?.idToken?.payload?.['custom:user_id'];
  const idToken = user?.signInUserSession?.idToken?.jwtToken;
  const accessToken = user?.signInUserSession?.accessToken?.jwtToken;

  if (!idToken || !accessToken) {
    throw Error(`Invalid auth response: ${JSON.stringify(user, null, 2)}`);
  }

  return {
    authId,
    userId,
    idToken,
    accessToken,
  };
}

export async function loginUserViaCognito(
  username: string,
  password: string,
  region: string,
  userPoolId: string,
  clientId: string,
  awsProfile?: string,
): Promise<LoginUserResponse> {
  const profileName = detectAwsProfile() || awsProfile?.trim() || 'staging';

  const awsCli = findAwsCli();
  const output = execSync(
    `${awsCli} configure export-credentials --profile ${profileName} --format process`,
    { encoding: 'utf-8', timeout: 10000 },
  );

  const creds = JSON.parse(output);
  const credentials = {
    accessKeyId: creds.AccessKeyId,
    secretAccessKey: creds.SecretAccessKey,
    sessionToken: creds.SessionToken,
  };

  const client = new CognitoIdentityProviderClient({
    region,
    credentials,
  });

  const command = new AdminInitiateAuthCommand({
    AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
    UserPoolId: userPoolId,
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  });

  const response = await client.send(command);
  const authResult = response.AuthenticationResult;

  if (!authResult?.IdToken || !authResult.AccessToken) {
    throw new Error(
      `Invalid auth response: ${JSON.stringify(response, null, 2)}`,
    );
  }

  const { userId, authId } = decodePayload(authResult.IdToken);

  if (!userId || !authId) {
    throw new Error(`Invalid token payload: ${authResult.IdToken}`);
  }

  return {
    authId,
    userId,
    idToken: authResult.IdToken,
    accessToken: authResult.AccessToken,
  };
}

const decodePayload = (token: string): { userId?: string; authId?: string } => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || !parts[1]) {
      return {};
    }
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8'),
    ) as Record<string, unknown>;
    return {
      userId:
        typeof payload['custom:user_id'] === 'string'
          ? payload['custom:user_id']
          : undefined,
      authId:
        typeof payload['cognito:username'] === 'string'
          ? payload['cognito:username']
          : undefined,
    };
  } catch {
    return {};
  }
};
