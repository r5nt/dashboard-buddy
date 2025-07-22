import { z } from 'zod';

const _ApiResponseSchema = z.object({
    success: z.boolean()
});

export type ApiResponse = z.infer<typeof _ApiResponseSchema>;