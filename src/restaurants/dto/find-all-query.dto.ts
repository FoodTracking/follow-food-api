import { z } from 'zod';

export const restaurantsFindAllQueryDto = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  lat: z.number().optional(),
  long: z.number().optional(),
  radius: z.number().optional(),
});

export type RestaurantsFindAllQueryDto = z.infer<
  typeof restaurantsFindAllQueryDto
>;
