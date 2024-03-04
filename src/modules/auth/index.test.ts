import dotenv from 'dotenv';

import { loginUser } from '.';

dotenv.config();

const USERNAME = String(process.env.USERNAME);
const PASSWORD = String(process.env.PASSWORD);
const REGION = String(process.env.REGION);
const USERPOOLID = String(process.env.USERPOOLID);
const CLIENTID = String(process.env.CLIENTID);

describe('Authenticates', () => {
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
