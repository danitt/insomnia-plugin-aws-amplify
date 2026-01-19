import {
  AdminInitiateAuthCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { Amplify, Auth } from 'aws-amplify';

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
): Promise<LoginUserResponse> {
  const client = new CognitoIdentityProviderClient({ region });

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

  if (!authResult || !authResult.IdToken || !authResult.AccessToken) {
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
