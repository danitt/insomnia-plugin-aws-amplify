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
