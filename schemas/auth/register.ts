import { z } from "zod";

export const register = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter."),
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
  storeName: z.string().min(3, "Nama toko minimal 3 karakter."),
  whatsappNumber: z
    .string()
    .min(10, "Nomor WhatsApp minimal 10 digit.")
    .regex(/^62\d+$/, "Nomor WhatsApp harus diawali 62. Contoh: 6281234567890."),
  description: z.string().optional(),
});

export type RegisterInput = z.infer<typeof register>;