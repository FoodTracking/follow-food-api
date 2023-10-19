import { z } from 'zod';

export const createRestaurantSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    address: z.string().min(1),
    categoryId: z.string().uuid(),
  })
  .required();

export type CreateRestaurantDto = z.infer<typeof createRestaurantSchema>;
