import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hourglass } from "lucide-react";

interface PendingVerificationProps {
    storeName: string;
}

export function PendingVerification({ storeName }: PendingVerificationProps) {
    return (
        <div className="flex items-center justify-center h-full min-h-[60vh]">
            <Card className="max-w-md text-center w-full">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <Hourglass className="h-12 w-12 text-yellow-500 animate-pulse" />
                    </div>
                    <CardTitle>Menunggu Verifikasi</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-muted-foreground">
                        Toko <strong>{storeName}</strong> sedang dalam proses verifikasi oleh admin.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Anda akan dapat mengakses fitur penjual setelah disetujui. Silakan cek secara berkala atau hubungi admin jika ada pertanyaan.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}