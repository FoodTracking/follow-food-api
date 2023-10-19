import { z } from 'zod';

export const createUserSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(12),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserSchema>;
