import { forms } from '@googleapis/forms';
import type { forms_v1 } from '@googleapis/forms';

const formID = process.env.FORM_ID;
async function getFormDefinition(): Promise<forms_v1.Schema$Form> {
  if (!formID) throw new Error('FORM_ID is not set');

  const googleForms = forms({
    version: 'v1',
    auth: global.auth,
  });
  const res = await googleForms.forms.get({ formId: formID });
  return res.data;
}

export { getFormDefinition };
