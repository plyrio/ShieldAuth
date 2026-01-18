import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const STATUS = ['ACTIVE', 'INACTIVE'] as const;

export const ResponseUserSchema = z.object({
  id: z.number(),
  name: z.string().trim(),
  email: z.string().trim().email(),
  status: z.enum(STATUS),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ResponseUserDtoZod = z.infer<typeof ResponseUserSchema>;
export class ResponseUserDto extends createZodDto(ResponseUserSchema) {}
