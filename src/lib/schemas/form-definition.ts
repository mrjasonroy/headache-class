import * as z from 'zod';

export const TypeSchema = z.enum(['CHECKBOX', 'RADIO']);
export type Type = z.infer<typeof TypeSchema>;

export const InfoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  documentTitle: z.string().optional(),
});
export type Info = z.infer<typeof InfoSchema>;

export const SettingsSchema = z.object({});
export type Settings = z.infer<typeof SettingsSchema>;

export const OptionSchema = z.object({
  value: z.string().optional(),
});
export type Option = z.infer<typeof OptionSchema>;

export const DateQuestionSchema = z.object({
  includeTime: z.boolean().optional(),
  includeYear: z.boolean().optional(),
});
export type DateQuestion = z.infer<typeof DateQuestionSchema>;

export const ScaleQuestionSchema = z.object({
  low: z.number().optional(),
  high: z.number().optional(),
});
export type ScaleQuestion = z.infer<typeof ScaleQuestionSchema>;

export const TextQuestionSchema = z.object({
  paragraph: z.boolean().optional(),
});
export type TextQuestion = z.infer<typeof TextQuestionSchema>;

export const ChoiceQuestionSchema = z.object({
  type: TypeSchema.optional(),
  options: z.array(OptionSchema).optional(),
});
export type ChoiceQuestion = z.infer<typeof ChoiceQuestionSchema>;

export const QuestionSchema = z.object({
  questionId: z.string().optional(),
  dateQuestion: DateQuestionSchema.optional(),
  choiceQuestion: ChoiceQuestionSchema.optional(),
  scaleQuestion: ScaleQuestionSchema.optional(),
  textQuestion: TextQuestionSchema.optional(),
});
export type Question = z.infer<typeof QuestionSchema>;

export const QuestionItemSchema = z.object({
  question: QuestionSchema.optional(),
});
export type QuestionItem = z.infer<typeof QuestionItemSchema>;

export const ItemSchema = z.object({
  itemId: z.string().optional(),
  title: z.string().optional(),
  questionItem: QuestionItemSchema.optional(),
  pageBreakItem: SettingsSchema.optional(),
  description: z.string().optional(),
});
export type Item = z.infer<typeof ItemSchema>;

export const FormDefinitionSchema = z.object({
  formId: z.string().optional(),
  info: InfoSchema.optional(),
  settings: SettingsSchema.optional(),
  revisionId: z.string().optional(),
  responderUri: z.string().optional(),
  items: z.array(ItemSchema).optional(),
  linkedSheetId: z.string().optional(),
});
export type FormDefinition = z.infer<typeof FormDefinitionSchema>;
