import { Amplify, Auth } from 'aws-amplify';

export async function loginUser(
  Username: string,
  Password: string,
  Region: string,
  UserPoolId: string,
  ClientId: string
): Promise<{ idToken: string, accessToken: string }> {
  Amplify.configure({
    Auth: {
      region: Region,
      userPoolId: UserPoolId,
      userPoolWebClientId: ClientId,
    },
  });

  const user = await Auth.signIn(Username, Password);
  const idToken = user?.signInUserSession?.idToken?.jwtToken;
  const accessToken = user?.signInUserSession?.accessToken?.jwtToken;

  if (!idToken || !accessToken) {
    throw Error(`Invalid auth response: ${JSON.stringify(user, null, 2)}`);
  }

  return {
    idToken,
    accessToken,
  }
}
