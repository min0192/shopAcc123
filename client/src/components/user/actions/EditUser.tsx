"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/types/user';
import { updateUser } from '@/getApi/userApi';
import { useToast } from '@/hooks/use-toast';

interface EditUserProps {
  user: User;
  onEdit: (id: string, user: Partial<User>) => void;
}

export default function EditUser({ user, onEdit }: EditUserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    password: '',
    phone: user.phone || '',
    balance: user.balance || 0,
    role: user.role as 'user' | 'admin' | 'seller',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Create update data with required fields
      const userData: User = {
        _id: user._id,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        balance: formData.balance,
        role: formData.role,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
      };
      const updateData = await updateUser(userData);

      if (updateData) {
        await onEdit(user._id, userData);
        setIsOpen(false);
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-password">Password</Label>
            <Input
              id="edit-password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Để trống nếu không đổi"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input
              id="edit-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-balance">Balance</Label>
            <Input
              id="edit-balance"
              type="number"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-role">Role</Label>
            <select
              id="edit-role"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' | 'seller' })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 