import { createCategorySchema } from './create-category.dto';
import { z } from 'zod';

export const updateCategorySchema = createCategorySchema
  .extend({
    id: z.string().uuid(),
  })
  .required();

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
