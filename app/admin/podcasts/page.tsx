'use client';

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Mic, Plus, Search, Edit, Trash2, Eye, Clock, Calendar, PlayCircle, ExternalLink, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';

export default function AdminPodcasts() {
  const router = useRouter();
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPodcast, setSelectedPodcast] = useState<any>(null);
  const [notification, setNotification] = useState({ show: false, type: 'success', message: '' });
  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    description: '',
    thumbnail: '',
    audio_url: '',
    duration: '',
    episode_number: '',
    published_at: new Date().toISOString().slice(0, 16)
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        fetchPodcasts();
      }
    };

    checkAuth();
  }, [router]);

  const fetchPodcasts = async () => {
    const { data, error } = await supabase
      .from('podcasts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching podcasts:', error);
    } else {
      setPodcasts(data || []);
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const slug = formData.slug || generateSlug(formData.title);
    const { error } = await supabase
      .from('podcasts')
      .insert([{
        ...formData,
        slug,
        duration: formData.duration ? parseInt(String(formData.duration)) : 0,
        episode_number: formData.episode_number ? parseInt(String(formData.episode_number)) : 0,
        published_at: formData.published_at ? new Date(formData.published_at).toISOString() : new Date().toISOString()
      }]);

    if (error) {
      setNotification({ show: true, type: 'error', message: 'Failed to create podcast' });
    } else {
      setNotification({ show: true, type: 'success', message: 'Podcast created successfully!' });
      setShowAddModal(false);
      setFormData({
        title: '', slug: '', description: '', thumbnail: '', audio_url: '', duration: '', episode_number: '',
        published_at: new Date().toISOString().slice(0, 16)
      });
      fetchPodcasts();
      setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
    }
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('podcasts')
      .update({
        ...formData,
        duration: formData.duration ? parseInt(String(formData.duration)) : 0,
        episode_number: formData.episode_number ? parseInt(String(formData.episode_number)) : 0
      })
      .eq('id', selectedPodcast.id);

    if (error) {
      setNotification({ show: true, type: 'error', message: 'Failed to update podcast' });
    } else {
      setNotification({ show: true, type: 'success', message: 'Podcast updated successfully!' });
      setShowEditModal(false);
      setSelectedPodcast(null);
      fetchPodcasts();
      setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm('Are you sure you want to delete this podcast episode? This action cannot be undone.')) {
      const { error } = await supabase
        .from('podcasts')
        .delete()
        .eq('id', id);

      if (error) {
        setNotification({ show: true, type: 'error', message: 'Failed to delete podcast' });
      } else {
        setNotification({ show: true, type: 'success', message: 'Podcast deleted successfully!' });
        fetchPodcasts();
        setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
      }
    }
  };

  const openEditModal = (podcast: any) => {
    setSelectedPodcast(podcast);
    setFormData({
      title: podcast.title,
      slug: podcast.slug,
      description: podcast.description || '',
      thumbnail: podcast.thumbnail || '',
      audio_url: podcast.audio_url || '',
      duration: podcast.duration || 0,
      episode_number: podcast.episode_number || 0
    });
    setShowEditModal(true);
  };

  const openViewModal = (podcast: any) => {
    setSelectedPodcast(podcast);
    setShowViewModal(true);
  };

  const filteredPodcasts = podcasts.filter(podcast =>
    podcast.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    podcast.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Mic className="h-6 w-6" />
          </Button>
          <h2 className="text-lg font-bold gold-gradient-text">Podcasts</h2>
          <div className="w-10" />
        </div>
      </div>

      <div className="lg:ml-64 p-4 lg:p-8 mt-16 lg:mt-0">
        {notification.show && (
          <div className={`mb-6 p-4 rounded-lg border ${
            notification.type === 'success' 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {notification.message}
          </div>
        )}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Podcasts</h1>
            <p className="text-muted-foreground">Manage podcast episodes and audio content</p>
          </div>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-black font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                Add Podcast
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Podcast Episode</DialogTitle>
                <DialogDescription>Upload a new podcast episode to the platform</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs defaultValue="content">
                  <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value, slug: generateSlug(e.target.value)})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="slug">URL Slug</Label>
                        <Input
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => setFormData({...formData, slug: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="episode_number">Episode Number</Label>
                          <Input
                            id="episode_number"
                            type="number"
                            value={formData.episode_number}
                            onChange={(e) => setFormData({...formData, episode_number: e.target.value})}
                            placeholder="1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="duration">Duration (seconds)</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={formData.duration}
                            onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            placeholder="1800"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={4}
                          required
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="media">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="audio_url">Audio URL *</Label>
                        <Input
                          id="audio_url"
                          value={formData.audio_url}
                          onChange={(e) => setFormData({...formData, audio_url: e.target.value})}
                          placeholder="https://example.com/episode.mp3"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="thumbnail">Thumbnail URL</Label>
                        <Input
                          id="thumbnail"
                          value={formData.thumbnail}
                          onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                          placeholder="https://example.com/thumbnail.jpg"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex gap-2 pt-4 border-t">
                  <Button type="submit" className="gold-gradient text-black font-semibold">
                    Add Podcast
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search podcasts by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading podcasts...</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPodcasts.map((podcast) => (
              <Card key={podcast.id} className="border-border/40 bg-card/50 hover:border-gold/40 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{podcast.title}</CardTitle>
                        <Badge variant="outline">Episode #{podcast.episode_number}</Badge>
                      </div>
                      {podcast.description && (
                        <CardDescription className="line-clamp-2">{podcast.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openViewModal(podcast)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEditModal(podcast)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {podcast.audio_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={podcast.audio_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-red-400 hover:text-red-500" onClick={() => handleDelete(podcast.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <p className="font-medium">{podcast.duration ? `${Math.floor(podcast.duration / 60)}:${(podcast.duration % 60).toString().padStart(2, '0')}` : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Published:</span>
                        <p className="font-medium">{podcast.published_at ? new Date(podcast.published_at).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Radio className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Episode:</span>
                        <p className="font-medium">#{podcast.episode_number}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredPodcasts.length === 0 && (
              <Card className="border-border/40 bg-card/50">
                <CardContent className="py-12 text-center">
                  <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No podcasts found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* View Modal */}
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPodcast?.title}</DialogTitle>
              <DialogDescription>Podcast episode details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedPodcast?.thumbnail && (
                <div className="rounded-lg overflow-hidden">
                  <img src={selectedPodcast.thumbnail} alt={selectedPodcast.title} className="w-full" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Slug</Label>
                  <div className="p-2 bg-secondary rounded-md font-mono text-sm">{selectedPodcast?.slug}</div>
                </div>
                <div>
                  <Label>Episode Number</Label>
                  <div className="p-2 bg-secondary rounded-md">#{selectedPodcast?.episode_number}</div>
                </div>
              </div>
              {selectedPodcast?.description && (
                <div>
                  <Label>Description</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedPodcast.description}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Audio URL</Label>
                  <div className="p-2 bg-secondary rounded-md truncate">{selectedPodcast?.audio_url || 'N/A'}</div>
                </div>
                <div>
                  <Label>Duration</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedPodcast?.duration ? `${Math.floor(selectedPodcast.duration / 60)}:${(selectedPodcast.duration % 60).toString().padStart(2, '0')}` : 'N/A'}</div>
                </div>
              </div>
              <div>
                <Label>Published</Label>
                <div className="p-2 bg-secondary rounded-md">{selectedPodcast?.published_at ? new Date(selectedPodcast.published_at).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Podcast</DialogTitle>
              <DialogDescription>Update podcast episode information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <Tabs defaultValue="content">
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content">
                  <div className="space-y-4">
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
                      <Label htmlFor="edit-slug">URL Slug</Label>
                      <Input
                        id="edit-slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-episode_number">Episode Number</Label>
                        <Input
                          id="edit-episode_number"
                          type="number"
                          value={formData.episode_number}
                          onChange={(e) => setFormData({...formData, episode_number: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-duration">Duration (seconds)</Label>
                        <Input
                          id="edit-duration"
                          type="number"
                          value={formData.duration}
                          onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-description">Description *</Label>
                      <Textarea
                        id="edit-description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={4}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="media">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-audio_url">Audio URL *</Label>
                      <Input
                        id="edit-audio_url"
                        value={formData.audio_url}
                        onChange={(e) => setFormData({...formData, audio_url: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-thumbnail">Thumbnail URL</Label>
                      <Input
                        id="edit-thumbnail"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" className="gold-gradient text-black font-semibold">
                  Update Podcast
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
