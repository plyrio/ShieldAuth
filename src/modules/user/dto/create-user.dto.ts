import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export type CreateUserDtoZod = z.infer<typeof CreateUserSchema>;
export class CreateUserDto extends createZodDto(CreateUserSchema) {}
