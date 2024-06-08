import { forms } from '@googleapis/forms';
import type { forms_v1 } from '@googleapis/forms';

const formID = process.env.FORM_ID;

async function getFormResponses(
  fromDate?: Date
): Promise<forms_v1.Schema$ListFormResponsesResponse> {
  if (!formID) throw new Error('FORM_ID is not set');
  const googleForms = forms({
    version: 'v1',
    auth: global.auth,
  });

  const res = await googleForms.forms.responses.list({
    formId: formID,
    filter: fromDate ? `timestamp >= ${fromDate.toISOString()}` : undefined,
  });
  return res.data;
}

export { getFormResponses };
