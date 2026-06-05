 'use client';

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, ImageIcon, Plus, Edit, Trash2, Search, Upload, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';

export default function AdminBanners() {
  const router = useRouter();
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    cta_text: '',
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        fetchBanners();
      }
    };
    checkAuth();
  }, [router]);

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching banners:', error);
    } else {
      setBanners(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('banners')
      .insert([formData]);

    if (error) {
      console.error('Error creating banner:', error);
    } else {
      setShowAddModal(false);
      setFormData({ title: '', subtitle: '', image_url: '', link_url: '', cta_text: '', is_active: true, display_order: 0 });
      fetchBanners();
    }
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('banners')
      .update(formData)
      .eq('id', selectedBanner.id);

    if (error) {
      console.error('Error updating banner:', error);
    } else {
      setShowEditModal(false);
      setSelectedBanner(null);
      fetchBanners();
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting banner:', error);
      } else {
        fetchBanners();
      }
    }
  };

  const handleToggleActive = async (banner: any) => {
    const { error } = await supabase
      .from('banners')
      .update({ is_active: !banner.is_active })
      .eq('id', banner.id);

    if (!error) {
      fetchBanners();
    }
  };

  const openEditModal = (banner: any) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      image_url: banner.image_url,
      link_url: banner.link_url || '',
      cta_text: banner.cta_text || '',
      is_active: banner.is_active,
      display_order: banner.display_order
    });
    setShowEditModal(true);
  };

  const filteredBanners = banners.filter(banner =>
    banner.title?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <ImageIcon className="h-6 w-6" />
          </Button>
          <h2 className="text-lg font-bold gold-gradient-text">Banners</h2>
          <div className="w-10" />
        </div>
      </div>

      <div className="lg:ml-64 p-4 lg:p-8 mt-16 lg:mt-0">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Banners</h1>
            <p className="text-muted-foreground">Manage homepage banners and hero sections</p>
          </div>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-black font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Banner</DialogTitle>
                <DialogDescription>Create a new banner for the homepage</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL *</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="link_url">Link URL</Label>
                  <Input
                    id="link_url"
                    value={formData.link_url}
                    onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="cta_text">CTA Text</Label>
                  <Input
                    id="cta_text"
                    value={formData.cta_text}
                    onChange={(e) => setFormData({...formData, cta_text: e.target.value})}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  />
                  <Label>Active</Label>
                </div>
                <Button type="submit" className="w-full gold-gradient text-black font-semibold">
                  Create Banner
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search banners..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading banners...</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredBanners.map((banner) => (
              <Card key={banner.id} className="border-border/40 bg-card/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle>{banner.title}</CardTitle>
                        <Badge variant={banner.is_active ? 'default' : 'secondary'}>
                          {banner.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      {banner.subtitle && <CardDescription>{banner.subtitle}</CardDescription>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(banner)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleToggleActive(banner)}>
                        {banner.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-400 hover:text-red-500" onClick={() => handleDelete(banner.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Display Order:</span>
                      <p className="font-medium">{banner.display_order}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Link:</span>
                      <p className="font-medium truncate">{banner.link_url || 'None'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredBanners.length === 0 && (
              <Card className="border-border/40 bg-card/50">
                <CardContent className="py-12 text-center">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No banners found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Banner</DialogTitle>
              <DialogDescription>Update banner information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-display_order">Display Order</Label>
                  <Input
                    id="edit-display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-subtitle">Subtitle</Label>
                <Input
                  id="edit-subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-image_url">Image URL *</Label>
                <Input
                  id="edit-image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-link_url">Link URL</Label>
                <Input
                  id="edit-link_url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-cta_text">CTA Text</Label>
                <Input
                  id="edit-cta_text"
                  value={formData.cta_text}
                  onChange={(e) => setFormData({...formData, cta_text: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                />
                <Label>Active</Label>
              </div>
              <Button type="submit" className="w-full gold-gradient text-black font-semibold">
                Update Banner
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
