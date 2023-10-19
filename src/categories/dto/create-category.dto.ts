import { z } from 'zod';

export const createCategorySchema = z
  .object({
    name: z.string().min(1),
  })
  .required();

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
