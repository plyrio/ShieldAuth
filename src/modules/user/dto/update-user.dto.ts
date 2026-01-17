import { z } from 'zod';
import { CreateUserSchema } from './create-user.dto.js';
import { createZodDto } from 'nestjs-zod';

export const UpdateUserSchema = CreateUserSchema.partial();

export type UpdateUserDtoZod = z.infer<typeof UpdateUserSchema>;
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
