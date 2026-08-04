"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
    registerSellerAction,
    type RegisterSellerState,
} from "@/features/auth/register-seller-action";

const initialState: RegisterSellerState = {
    success: false,
    message: "",
    error: {},
};

type FieldProps = {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    error?: string[];
    helperText?: string;
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {pending ? "Memproses..." : "Daftar Seller"}
        </button>
    );
}

function FieldError({ error }: { error?: string[] }) {
    if (!error?.length) return null;

    return <p className="mt-1 text-xs font-medium text-red-600">{error[0]}</p>;
}

function InputField({
    label,
    name,
    type = "text",
    placeholder,
    error,
    helperText,
}: FieldProps) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={name} className="text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                aria-invalid={!!error?.length}
                aria-describedby={error?.length ? `${name}-error` : undefined}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
            />

            {helperText && <p className="text-xs text-gray-500">{helperText}</p>}

            <div id={`${name}-error`}>
                <FieldError error={error} />
            </div>
        </div>
    );
}

function TextareaField({
    label,
    name,
    placeholder,
    error,
}: {
    label: string;
    name: string;
    placeholder?: string;
    error?: string[];
}) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={name} className="text-sm font-medium text-gray-700">
                {label}
            </label>

            <textarea
                id={name}
                name={name}
                placeholder={placeholder}
                aria-invalid={!!error?.length}
                aria-describedby={error?.length ? `${name}-error` : undefined}
                className="min-h-28 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10"
            />

            <div id={`${name}-error`}>
                <FieldError error={error} />
            </div>
        </div>
    );
}

export function RegisterSellerForm() {
    const [state, formAction] = useActionState(
        registerSellerAction,
        initialState
    );

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
            <form
                action={formAction}
                className="w-full max-w-lg space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Daftar sebagai Penjual
                    </h1>
                    <p className="text-sm leading-6 text-gray-500">
                        Buat akun toko untuk mulai menawarkan produk atau jasa di
                        Unimalstore.
                    </p>
                </div>

                {state.message && (
                    <div
                        className={`rounded-lg border px-3 py-2 text-sm ${state.success
                                ? "border-green-200 bg-green-50 text-green-700"
                                : "border-red-200 bg-red-50 text-red-700"
                            }`}
                    >
                        {state.message}
                    </div>
                )}

                <div className="grid gap-4">
                    <InputField
                        label="Nama Lengkap"
                        name="name"
                        placeholder="Masukkan nama lengkap"
                        error={state.error?.name}
                    />

                    <InputField
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        error={state.error?.email}
                    />

                    <InputField
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Minimal 6 karakter"
                        error={state.error?.password}
                    />

                    <InputField
                        label="Nama Toko"
                        name="storeName"
                        placeholder="Contoh: Print Kampus"
                        error={state.error?.storeName}
                    />

                    <InputField
                        label="Nomor WhatsApp"
                        name="whatsappNumber"
                        placeholder="Contoh: 6281234567890"
                        helperText="Gunakan format 62, contoh: 6281234567890."
                        error={state.error?.whatsappNumber}
                    />

                    <TextareaField
                        label="Deskripsi Toko"
                        name="description"
                        placeholder="Jelaskan singkat produk atau jasa yang kamu tawarkan."
                        error={state.error?.description}
                    />
                </div>

                <SubmitButton />

                <p className="text-center text-sm text-gray-500">
                    Sudah punya akun?{" "}
                    <a
                        href="/login"
                        className="font-semibold text-gray-900 hover:underline"
                    >
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
}