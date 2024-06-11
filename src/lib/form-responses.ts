import { authenticate } from '@google-cloud/local-auth';
import { forms } from '@googleapis/forms';
import type { forms_v1 } from '@googleapis/forms';
import { OAuth2Client } from 'google-auth-library';

const formID = process.env.FORM_ID;
async function getFormResponses({
  auth,
  from,
}: {
  auth: OAuth2Client;
  from?: Date;
}): Promise<forms_v1.Schema$ListFormResponsesResponse> {
  if (!formID) throw new Error('FORM_ID is not set');
  const googleForms = forms({
    version: 'v1',
    auth: auth,
  });
  console.log('from', from);
  const res = await googleForms.forms.responses.list({
    formId: formID,
    filter: from ? `timestamp >= ${from.toISOString()}` : undefined,
  });
  return res.data;
}

export { getFormResponses };
