// schemas/category.ts
import { z } from "zod";

export const CategorySchema = z.object({
    name: z.string().min(1, "Nama kategori wajib diisi"),
    description: z.string().optional(),
});

export type CategoryInput = z.infer<typeof CategorySchema>;