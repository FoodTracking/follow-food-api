import { createRestaurantSchema } from './create-restaurant.dto';
import { z } from 'zod';

export const updateRestaurantSchema = createRestaurantSchema
  .extend({
    id: z.string().uuid(),
  })
  .required();

export type UpdateRestaurantDto = z.infer<typeof updateRestaurantSchema>;
