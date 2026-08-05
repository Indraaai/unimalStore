"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
    approveSeller,
    rejectSeller,
    suspendSeller,
    activateSeller,
} from "@/features/admin/seller-actions";
import { CheckCircle, XCircle, PauseCircle, PlayCircle, Eye } from "lucide-react";

type SellerWithUser = {
    id: string;
    storeName: string;
    storeSlug: string;
    whatsappNumber: string;
    description: string | null;
    status: "PENDING_VERIFICATION" | "ACTIVE" | "SUSPENDED" | "REJECTED";
    user: {
        id: string;
        name: string;
        email: string;
        status: string;
    };
};

interface SellersTableProps {
    sellers: SellerWithUser[];
}

const statusLabels: Record<string, string> = {
    PENDING_VERIFICATION: "Menunggu Verifikasi",
    ACTIVE: "Aktif",
    SUSPENDED: "Ditangguhkan",
    REJECTED: "Ditolak",
};

const statusColors: Record<string, "secondary" | "default" | "destructive" | "outline"> = {
    PENDING_VERIFICATION: "secondary",
    ACTIVE: "default",
    SUSPENDED: "destructive",
    REJECTED: "outline",
};

export function SellersTable({ sellers: initialSellers }: SellersTableProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [selectedSeller, setSelectedSeller] = useState<SellerWithUser | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<"approve" | "reject" | "suspend" | "activate">("approve");

    // Filter data berdasarkan status
    const filteredSellers = filterStatus === "ALL"
        ? initialSellers
        : initialSellers.filter((s) => s.status === filterStatus);

    const handleAction = async () => {
        if (!selectedSeller) return;
        const formData = new FormData();
        formData.append("sellerId", selectedSeller.id);
        if (actionType === "reject" && rejectReason) {
            formData.append("reason", rejectReason);
        }

        startTransition(async () => {
            switch (actionType) {
                case "approve": await approveSeller(formData); break;
                case "reject": await rejectSeller(formData); break;
                case "suspend": await suspendSeller(formData); break;
                case "activate": await activateSeller(formData); break;
            }
            setActionDialogOpen(false);
            setRejectReason("");
            router.refresh(); // Alternatif revalidate
        });
    };

    const openActionDialog = (seller: SellerWithUser, type: "approve" | "reject" | "suspend" | "activate") => {
        setSelectedSeller(seller);
        setActionType(type);
        setActionDialogOpen(true);
    };

    return (
        <>
            {/* Filter */}
            <div className="flex items-center gap-4">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Semua Status</SelectItem>
                        <SelectItem value="PENDING_VERIFICATION">Menunggu Verifikasi</SelectItem>
                        <SelectItem value="ACTIVE">Aktif</SelectItem>
                        <SelectItem value="SUSPENDED">Ditangguhkan</SelectItem>
                        <SelectItem value="REJECTED">Ditolak</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Tabel */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Toko</TableHead>
                            <TableHead>Pemilik</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>WhatsApp</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSellers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                    Tidak ada data seller.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSellers.map((seller) => (
                                <TableRow key={seller.id}>
                                    <TableCell className="font-medium">{seller.storeName}</TableCell>
                                    <TableCell>{seller.user.name}</TableCell>
                                    <TableCell>{seller.user.email}</TableCell>
                                    <TableCell>{seller.whatsappNumber}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusColors[seller.status]}>
                                            {statusLabels[seller.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            {/* Tombol Detail */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setSelectedSeller(seller);
                                                    setDetailDialogOpen(true);
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>

                                            {/* Aksi berdasarkan status */}
                                            {seller.status === "PENDING_VERIFICATION" && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openActionDialog(seller, "approve")}
                                                    >
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openActionDialog(seller, "reject")}
                                                    >
                                                        <XCircle className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </>
                                            )}
                                            {seller.status === "ACTIVE" && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openActionDialog(seller, "suspend")}
                                                >
                                                    <PauseCircle className="h-4 w-4 text-yellow-600" />
                                                </Button>
                                            )}
                                            {seller.status === "SUSPENDED" && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openActionDialog(seller, "activate")}
                                                >
                                                    <PlayCircle className="h-4 w-4 text-blue-600" />
                                                </Button>
                                            )}
                                            {/* REJECTED tidak ada aksi lanjutan */}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog Detail Seller */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detail Seller</DialogTitle>
                    </DialogHeader>
                    {selectedSeller && (
                        <div className="space-y-2">
                            <p><strong>Nama Toko:</strong> {selectedSeller.storeName}</p>
                            <p><strong>Slug:</strong> {selectedSeller.storeSlug}</p>
                            <p><strong>Pemilik:</strong> {selectedSeller.user.name}</p>
                            <p><strong>Email:</strong> {selectedSeller.user.email}</p>
                            <p><strong>WhatsApp:</strong> {selectedSeller.whatsappNumber}</p>
                            <p><strong>Deskripsi:</strong> {selectedSeller.description || "-"}</p>
                            <p><strong>Status:</strong> {statusLabels[selectedSeller.status]}</p>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog Konfirmasi Aksi */}
            <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Aksi</DialogTitle>
                        <DialogDescription>
                            Anda akan {actionType === "approve" ? "menyetujui" : actionType === "reject" ? "menolak" : actionType === "suspend" ? "menangguhkan" : "mengaktifkan kembali"} seller{" "}
                            <strong>{selectedSeller?.storeName}</strong>.
                        </DialogDescription>
                    </DialogHeader>
                    {actionType === "reject" && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Alasan Penolakan (opsional)</label>
                            <Textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Tulis alasan..."
                            />
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleAction} disabled={isPending}>
                            {isPending ? "Memproses..." : "Ya, Lanjutkan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}