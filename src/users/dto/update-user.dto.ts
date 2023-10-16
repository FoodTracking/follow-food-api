import { z } from 'zod';

export const updateUserSchema = z
  .object({
    id: z.string().uuid().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(12),
  })
  .partial();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
