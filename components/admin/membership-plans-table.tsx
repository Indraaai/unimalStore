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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
    createMembershipPlan,
    updateMembershipPlan,
    toggleMembershipPlanStatus,
    deleteMembershipPlan,
} from "@/features/admin/membership-actions";
import { Pencil, Plus, Power, PowerOff, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Plan = {
    id: string;
    name: string;
    price: number;
    durationDays: number;
    productLimit: number;
    canUseFeaturedAds: boolean;
    isActive: boolean;
};

interface MembershipPlansTableProps {
    plans: Plan[];
}

export function MembershipPlansTable({ plans }: MembershipPlansTableProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [openDialog, setOpenDialog] = useState(false);
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Plan | null>(null);
    const [canUseFeaturedAds, setCanUseFeaturedAds] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (editingPlan) {
            formData.append("id", editingPlan.id);
        }
        // Tambahkan canUseFeaturedAds karena checkbox tidak mengirim nilai default
        if (!formData.has("canUseFeaturedAds")) {
            formData.append("canUseFeaturedAds", "false");
        }

        startTransition(async () => {
            if (editingPlan) {
                await updateMembershipPlan(formData);
            } else {
                await createMembershipPlan(formData);
            }
            setOpenDialog(false);
            setEditingPlan(null);
            router.refresh();
        });
    };

    const handleToggleStatus = async (plan: Plan) => {
        const formData = new FormData();
        formData.append("id", plan.id);
        startTransition(async () => {
            await toggleMembershipPlanStatus(formData);
            router.refresh();
        });
    };

    const handleDelete = async (plan: Plan) => {
        const formData = new FormData();
        formData.append("id", plan.id);
        startTransition(async () => {
            await deleteMembershipPlan(formData);
            setDeleteConfirm(null);
            router.refresh();
        });
    };

    const openCreateDialog = () => {
        setEditingPlan(null);
        setCanUseFeaturedAds(false);
        setOpenDialog(true);
    };

    const openEditDialog = (plan: Plan) => {
        setEditingPlan(plan);
        setCanUseFeaturedAds(plan.canUseFeaturedAds);
        setOpenDialog(true);
    };

    return (
        <>
            <div className="flex justify-end">
                <Button onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Paket
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Paket</TableHead>
                            <TableHead>Harga</TableHead>
                            <TableHead>Durasi (hari)</TableHead>
                            <TableHead>Batas Produk</TableHead>
                            <TableHead>Featured Ads</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plans.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground">
                                    Belum ada paket membership.
                                </TableCell>
                            </TableRow>
                        ) : (
                            plans.map((plan) => (
                                <TableRow key={plan.id}>
                                    <TableCell className="font-medium">{plan.name}</TableCell>
                                    <TableCell>Rp {formatPrice(plan.price)}</TableCell>
                                    <TableCell>{plan.durationDays}</TableCell>
                                    <TableCell>{plan.productLimit}</TableCell>
                                    <TableCell>
                                        <Badge variant={plan.canUseFeaturedAds ? "default" : "secondary"}>
                                            {plan.canUseFeaturedAds ? "Ya" : "Tidak"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={plan.isActive ? "default" : "secondary"}>
                                            {plan.isActive ? "Aktif" : "Nonaktif"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleToggleStatus(plan)}
                                                title={plan.isActive ? "Nonaktifkan" : "Aktifkan"}
                                            >
                                                {plan.isActive ? (
                                                    <PowerOff className="h-4 w-4 text-yellow-600" />
                                                ) : (
                                                    <Power className="h-4 w-4 text-green-600" />
                                                )}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditDialog(plan)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeleteConfirm(plan)}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Dialog Tambah/Edit */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingPlan ? "Edit Paket Membership" : "Tambah Paket Baru"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingPlan
                                ? "Ubah detail paket membership."
                                : "Buat paket membership untuk seller."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nama Paket</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                defaultValue={editingPlan?.name || ""}
                                placeholder="Contoh: Basic, Premium"
                            />
                        </div>
                        <div>
                            <Label htmlFor="price">Harga (Rp)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                required
                                min={0}
                                defaultValue={editingPlan?.price || 0}
                            />
                        </div>
                        <div>
                            <Label htmlFor="durationDays">Durasi (hari)</Label>
                            <Input
                                id="durationDays"
                                name="durationDays"
                                type="number"
                                required
                                min={1}
                                defaultValue={editingPlan?.durationDays || 30}
                            />
                        </div>
                        <div>
                            <Label htmlFor="productLimit">Batas Produk</Label>
                            <Input
                                id="productLimit"
                                name="productLimit"
                                type="number"
                                required
                                min={1}
                                defaultValue={editingPlan?.productLimit || 5}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="canUseFeaturedAds"
                                checked={canUseFeaturedAds}
                                onCheckedChange={(checked) => setCanUseFeaturedAds(!!checked)}
                            />
                            <input type="hidden" name="canUseFeaturedAds" value={canUseFeaturedAds ? "true" : "false"} />
                            <Label htmlFor="canUseFeaturedAds" className="cursor-pointer">
                                Bisa menggunakan Featured Ads
                            </Label>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpenDialog(false)}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Menyimpan..." : editingPlan ? "Simpan Perubahan" : "Tambah Paket"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Konfirmasi Hapus */}
            <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Paket Membership</DialogTitle>
                        <DialogDescription>
                            Anda yakin ingin menghapus paket <strong>{deleteConfirm?.name}</strong>?
                            Tindakan ini tidak bisa dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                            Batal
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                            disabled={isPending}
                        >
                            {isPending ? "Menghapus..." : "Ya, Hapus"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}