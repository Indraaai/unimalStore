import { registerSellerAction } from "@/features/auth/register-seller-action";

export default function RegisterSellerPage() {
    return (
        <main className="flex min-h-screen items-center justify-center px-4 py-10">
            <form
                action={registerSellerAction}
                className="w-full max-w-md space-y-4 rounded-xl border bg-white p-6 shadow-sm"
            >
                <div>
                    <h1 className="text-2xl font-bold">Daftar sebagai Penjual</h1>
                    <p className="text-sm text-gray-500">
                        Buat akun toko untuk mulai menawarkan produk atau jasa di
                        Unimalstore.
                    </p>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Nama Lengkap</label>
                    <input
                        name="name"
                        type="text"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="Nama lengkap"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Email</label>
                    <input
                        name="email"
                        type="email"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="email@example.com"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Password</label>
                    <input
                        name="password"
                        type="password"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="Minimal 6 karakter"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Nama Toko</label>
                    <input
                        name="storeName"
                        type="text"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="Contoh: Print Kita"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Nomor WhatsApp</label>
                    <input
                        name="whatsappNumber"
                        type="text"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="Contoh: 6281234567890"
                        required
                    />
                    <p className="text-xs text-gray-500">
                        Gunakan format 62, contoh: 6281234567890.
                    </p>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Deskripsi Toko</label>
                    <textarea
                        name="description"
                        className="min-h-24 w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="Jelaskan singkat produk atau jasa yang kamu tawarkan."
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                >
                    Daftar Seller
                </button>
            </form>
        </main>
    );
}
