"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createUser } from '@/getApi/userApi';
import { User } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

interface AddUserProps {
  onAdd: () => void;
}

export default function AddUser({ onAdd }: AddUserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    balance: 0,
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createUser(formData as User);
      setIsOpen(false);
      setFormData({ name: '', email: '', password: '', balance: 0, role: 'user' });
      onAdd();
      toast({
        title: "Success",
        description: "User added successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add user",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Thêm User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm User mới</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="add-name">Name</Label>
            <Input
              id="add-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="add-email">Email</Label>
            <Input
              id="add-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="add-password">Password</Label>
            <Input
              id="add-password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="add-balance">Balance</Label>
            <Input
              id="add-balance"
              type="number"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="add-role">Role</Label>
            <select
              id="add-role"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Đang thêm...' : 'Thêm'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 