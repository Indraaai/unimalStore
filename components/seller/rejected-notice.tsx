import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";

interface RejectedNoticeProps {
    storeName: string;
    reason?: string | null;
}

export function RejectedNotice({ storeName, reason }: RejectedNoticeProps) {
    return (
        <div className="flex items-center justify-center h-full min-h-[60vh]">
            <Card className="max-w-md text-center w-full">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <XCircle className="h-12 w-12 text-red-500" />
                    </div>
                    <CardTitle>Pendaftaran Ditolak</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="text-muted-foreground">
                        Pendaftaran toko <strong>{storeName}</strong> ditolak oleh admin.
                    </p>
                    {reason && (
                        <div className="mt-2 p-3 bg-muted rounded-md text-left">
                            <p className="text-sm font-medium">Alasan:</p>
                            <p className="text-sm text-muted-foreground">{reason}</p>
                        </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                        Silakan hubungi admin untuk informasi lebih lanjut atau ajukan pendaftaran ulang.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}