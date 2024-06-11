import * as z from "zod";


export const AnswerElementSchema = z.object({
    "value": z.string().optional(),
});
export type AnswerElement = z.infer<typeof AnswerElementSchema>;

export const TextAnswersSchema = z.object({
    "answers": z.array(AnswerElementSchema).optional(),
});
export type TextAnswers = z.infer<typeof TextAnswersSchema>;

export const AnswerValueSchema = z.object({
    "questionId": z.string().optional(),
    "textAnswers": TextAnswersSchema.optional(),
});
export type AnswerValue = z.infer<typeof AnswerValueSchema>;

export const ResponseSchema = z.object({
    "responseId": z.string().optional(),
    "createTime": z.coerce.date().optional(),
    "lastSubmittedTime": z.coerce.date().optional(),
    "answers": z.record(z.string(), AnswerValueSchema).optional(),
});
export type Response = z.infer<typeof ResponseSchema>;

export const FormResponsesSchema = z.object({
    "responses": z.array(ResponseSchema).optional(),
});
export type FormResponses = z.infer<typeof FormResponsesSchema>;
