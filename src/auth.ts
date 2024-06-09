import path from 'path';
import { authenticate } from '@google-cloud/local-auth';
import { OAuth2Client } from 'google-auth-library';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function getAuth(): Promise<OAuth2Client> {
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, '../credentials.json'),
    scopes: [
      'https://www.googleapis.com/auth/forms.body.readonly',
      'https://www.googleapis.com/auth/forms.responses.readonly',
    ],
  });
  return auth;
}

export { getAuth };
