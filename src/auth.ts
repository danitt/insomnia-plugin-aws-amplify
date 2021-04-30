import { ICognitoUserSessionData } from "types";
import { Amplify, Auth } from 'aws-amplify';

export async function loginUser(Username: string, Password: string, Region: string, UserPoolId: string, ClientId: string): Promise<ICognitoUserSessionData> {
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
  const refreshToken = user?.signInUserSession?.refreshToken?.jwtToken;

  if (!idToken || !accessToken) {
    throw Error(`Invalid auth response: ${JSON.stringify(user, null, 2)}`);
  }

  return {
    IdToken: idToken,
    AccessToken: accessToken,
    RefreshToken: refreshToken,
  };
}
