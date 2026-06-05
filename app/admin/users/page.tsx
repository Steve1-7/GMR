'use client';

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Plus, Edit, Trash2, Search, Shield, User, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    email: '',
    full_name: '',
    role: 'user',
    status: 'active'
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        fetchUsers();
      }
    };
    checkAuth();
  }, [router]);

  const fetchUsers = async () => {
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data.users || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: 'tempPassword123!', // User will need to reset
      options: {
        data: {
          full_name: formData.full_name,
          role: formData.role,
          status: formData.status
        }
      }
    });

    if (error) {
      console.error('Error creating user:', error);
    } else {
      setShowAddModal(false);
      setFormData({ email: '', full_name: '', role: 'user', status: 'active' });
      fetchUsers();
    }
  };

  const handleUpdate = async () => {
    const { error } = await supabase.auth.admin.updateUserById(selectedUser.id, {
      email: formData.email,
      user_metadata: {
        full_name: formData.full_name,
        role: formData.role,
        status: formData.status
      }
    });

    if (error) {
      console.error('Error updating user:', error);
    } else {
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    }
  };

  const handleDelete = async (userId: any) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) {
        console.error('Error deleting user:', error);
      } else {
        fetchUsers();
      }
    }
  };

  const handleBanUser = async (userId: any) => {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      ban_duration: '365d'
    });
    if (!error) {
      fetchUsers();
    }
  };

  const handleUnbanUser = async (userId: any) => {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      ban_duration: undefined
    });
    if (!error) {
      fetchUsers();
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      full_name: user.user_metadata?.full_name || '',
      role: user.user_metadata?.role || 'user',
      status: user.user_metadata?.status || 'active'
    });
    setShowEditModal(true);
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_metadata?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border/40 p-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="icon"
          >
            <Users className="h-6 w-6" />
          </Button>
          <h2 className="text-lg font-bold gold-gradient-text">Users</h2>
          <div className="w-10" />
        </div>
      </div>

      <div className="lg:ml-64 p-4 lg:p-8 mt-16 lg:mt-0">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Users</h1>
            <p className="text-muted-foreground">Manage platform users and permissions</p>
          </div>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-black font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  >
                    <option value="user">User</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <Button type="submit" className="w-full gold-gradient text-black font-semibold">
                  Create User
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading users...</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="border-border/40 bg-card/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle>{user.email}</CardTitle>
                        <Badge variant={user.user_metadata?.role === 'admin' ? 'default' : 'secondary'}>
                          {user.user_metadata?.role || 'user'}
                        </Badge>
                        <Badge variant="outline" className={user.banned_at ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}>
                          {user.banned_at ? 'Banned' : 'Active'}
                        </Badge>
                      </div>
                      {user.user_metadata?.full_name && (
                        <CardDescription>{user.user_metadata.full_name}</CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {user.banned_at ? (
                        <Button size="sm" variant="outline" onClick={() => handleUnbanUser(user.id)}>
                          <Shield className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="text-red-400" onClick={() => handleBanUser(user.id)}>
                          <Shield className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-red-400 hover:text-red-500" onClick={() => handleDelete(user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Created: {new Date(user.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{user.user_metadata?.status || 'active'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredUsers.length === 0 && (
              <Card className="border-border/40 bg-card/50">
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No users found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information and permissions</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-full_name">Full Name *</Label>
                <Input
                  id="edit-full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-role">Role</Label>
                <select
                  id="edit-role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                >
                  <option value="user">User</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <select
                  id="edit-status"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <Button type="submit" className="w-full gold-gradient text-black font-semibold">
                Update User
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
