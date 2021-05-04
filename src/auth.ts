import { Amplify, Auth } from 'aws-amplify';

export type LoginUserResponse = { authId: string, userId?: string, idToken: string, accessToken: string };

export async function loginUser(
  Username: string,
  Password: string,
  Region: string,
  UserPoolId: string,
  ClientId: string
): Promise<LoginUserResponse> {
  Amplify.configure({
    Auth: {
      region: Region,
      userPoolId: UserPoolId,
      userPoolWebClientId: ClientId,
    },
  });

  const user = await Auth.signIn(Username, Password);
  const authId = user?.username;
  const userId = user?.signInUserSession?.idToken?.payload?.['custom:user_id'];
  const idToken = user?.signInUserSession?.idToken?.jwtToken;
  const accessToken = user?.signInUserSession?.accessToken?.jwtToken;

  if (!idToken || !accessToken) {
    throw Error(`Invalid auth response: ${JSON.stringify(user, null, 2)}`);
  }

  console.info({ user, authId, userId, idToken, accessToken });

  return {
    authId,
    userId,
    idToken,
    accessToken,
  }
}
