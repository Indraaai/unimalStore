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
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    createCategory,
    updateCategory,
    toggleCategoryStatus,
    deleteCategory,
} from "@/features/admin/category-actions";
import { Pencil, Plus, Power, PowerOff, Trash2 } from "lucide-react";

type Category = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    isActive: boolean;
};

interface CategoriesTableProps {
    categories: Category[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            if (editingCategory) {
                formData.append("id", editingCategory.id);
                await updateCategory(formData);
            } else {
                await createCategory(formData);
            }
            setOpenDialog(false);
            setEditingCategory(null);
            router.refresh();
        });
    };

    const handleToggleStatus = async (category: Category) => {
        const formData = new FormData();
        formData.append("id", category.id);
        startTransition(async () => {
            await toggleCategoryStatus(formData);
            router.refresh();
        });
    };

    const handleDelete = async (category: Category) => {
        const formData = new FormData();
        formData.append("id", category.id);
        startTransition(async () => {
            try {
                await deleteCategory(formData);
                setDeleteConfirm(null);
                router.refresh();
            } catch (error: any) {
                alert(error.message || "Gagal menghapus kategori");
            }
        });
    };

    const openCreateDialog = () => {
        setEditingCategory(null);
        setOpenDialog(true);
    };

    const openEditDialog = (category: Category) => {
        setEditingCategory(category);
        setOpenDialog(true);
    };

    return (
        <>
            {/* Tombol Tambah */}
            <div className="flex justify-end">
                <Button onClick={openCreateDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Kategori
                </Button>
            </div>

            {/* Tabel */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Kategori</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    Belum ada kategori.
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell>{cat.slug}</TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {cat.description || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={cat.isActive ? "default" : "secondary"}>
                                            {cat.isActive ? "Aktif" : "Nonaktif"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            {/* Toggle Status */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleToggleStatus(cat)}
                                                title={cat.isActive ? "Nonaktifkan" : "Aktifkan"}
                                            >
                                                {cat.isActive ? (
                                                    <PowerOff className="h-4 w-4 text-yellow-600" />
                                                ) : (
                                                    <Power className="h-4 w-4 text-green-600" />
                                                )}
                                            </Button>
                                            {/* Edit */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditDialog(cat)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            {/* Delete */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setDeleteConfirm(cat)}
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
                            {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategory
                                ? "Ubah detail kategori yang sudah ada."
                                : "Buat kategori baru untuk produk seller."}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Nama Kategori</label>
                            <Input
                                name="name"
                                required
                                defaultValue={editingCategory?.name || ""}
                                placeholder="Contoh: Buku & Alat Tulis"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Deskripsi (opsional)</label>
                            <Textarea
                                name="description"
                                defaultValue={editingCategory?.description || ""}
                                placeholder="Deskripsi singkat kategori"
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpenDialog(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending
                                    ? "Menyimpan..."
                                    : editingCategory
                                        ? "Simpan Perubahan"
                                        : "Tambah Kategori"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog Konfirmasi Hapus */}
            <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Kategori</DialogTitle>
                        <DialogDescription>
                            Anda yakin ingin menghapus kategori <strong>{deleteConfirm?.name}</strong>?
                            Kategori yang sudah digunakan produk tidak bisa dihapus.
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