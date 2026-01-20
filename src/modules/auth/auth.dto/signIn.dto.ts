import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SignInDtoSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim(),
});

export type SignInDtoZod = z.infer<typeof SignInDtoSchema>;

export class SignInDto extends createZodDto(SignInDtoSchema) {}
