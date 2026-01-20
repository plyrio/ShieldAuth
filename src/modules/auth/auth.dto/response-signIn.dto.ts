import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ResponseSignInDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

export type ResponseSignInDtoZod = z.infer<typeof ResponseSignInDtoSchema>;

export class ResponseSignInDto extends createZodDto(ResponseSignInDtoSchema) {}
