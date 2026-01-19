import dotenv from 'dotenv';

import { loginUser, loginUserViaCognito } from '.';

dotenv.config();

const USERNAME = String(process.env.USERNAME);
const PASSWORD = String(process.env.PASSWORD);
const REGION = String(process.env.REGION);
const USERPOOLID = String(process.env.USERPOOLID);
const CLIENTID = String(process.env.CLIENTID);

describe('Authenticates', () => {
  // Skip for now as USER_SRP_AUTH is disabled
  describe.skip('when login via Amplify', () => {
    it('Logs in with test credentials', async () => {
      const { authId, idToken, accessToken } = await loginUser(
        USERNAME,
        PASSWORD,
        REGION,
        USERPOOLID,
        CLIENTID,
      );
      expect(authId).toBeTruthy();
      expect(idToken).toBeTruthy();
      expect(accessToken).toBeTruthy();
    });
  });

  describe('when login via Cognito', () => {
    it('Logs in with test credentials', async () => {
      const { authId, idToken, accessToken } = await loginUserViaCognito(
        USERNAME,
        PASSWORD,
        REGION,
        USERPOOLID,
        CLIENTID,
      );
      expect(authId).toBeTruthy();
      expect(idToken).toBeTruthy();
      expect(accessToken).toBeTruthy();
    });
  });
});
