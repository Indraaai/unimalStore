"use client";

import { FormEvent, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("admin@unimalstore.com");
    const [password, setPassword] = useState("password123");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setIsLoading(false);
            setError("Email atau password salah.");
            return;
        }

        const session = await getSession();

        if (session?.user?.role === "ADMIN") {
            router.push("/admin/dashboard");
            router.refresh();
            return;
        }

        if (session?.user?.role === "SELLER") {
            router.push("/seller/dashboard");
            router.refresh();
            return;
        }

        setIsLoading(false);
        setError("Role akun tidak dikenali.");
    }

    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <form
                onSubmit={handleLogin}
                className="w-full max-w-sm space-y-4 rounded-xl border bg-white p-6 shadow-sm"
            >
                <div>
                    <h1 className="text-2xl font-bold">Login</h1>
                    <p className="text-sm text-gray-500">
                        Masuk ke akun Unimalstore kamu.
                    </p>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-sm font-medium">Email</label>
                    <input
                        type="email"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="email@example.com"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Password</label>
                    <input
                        type="password"
                        className="w-full rounded-md border px-3 py-2 text-sm"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                    {isLoading ? "Memproses..." : "Login"}
                </button>
            </form>
        </main>
    );
}
