import { promises as fs } from 'fs';

import { OAuth2Client } from 'google-auth-library';
import { JWT } from 'google-auth-library';

async function getAuth(): Promise<OAuth2Client> {
  const email = process.env.GOOGLE_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !key)
    throw new Error('GOOGLE_EMAIL or GOOGLE_PRIVATE_KEY is not set');
  const scopes = [
    'https://www.googleapis.com/auth/forms.body.readonly',
    'https://www.googleapis.com/auth/forms.responses.readonly',
  ];
  const authClient = new JWT({
    email,
    key,
    scopes: scopes,
  });
  return authClient;
}

export { getAuth };
