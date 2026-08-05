// schemas/membership-plan.ts
import { z } from "zod";

export const MembershipPlanSchema = z.object({
    name: z.string().min(1, "Nama paket wajib diisi"),
    price: z.coerce.number().int().min(0, "Harga minimal 0"),
    durationDays: z.coerce.number().int().min(1, "Durasi minimal 1 hari"),
    productLimit: z.coerce.number().int().min(1, "Batas produk minimal 1"),
    canUseFeaturedAds: z.boolean(),
});

export type MembershipPlanInput = z.infer<typeof MembershipPlanSchema>;