'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Video, Plus, Search, Edit, Trash2, Eye, Clock, Calendar, PlayCircle, ExternalLink, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';

export default function AdminVideos() {
  const router = useRouter();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [notification, setNotification] = useState<any>({ show: false, type: 'success', message: '' });
  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    description: '',
    thumbnail: '',
    video_url: '',
    duration: 0,
    category: 'interview',
    published_at: new Date().toISOString().slice(0, 16)
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        fetchVideos();
      }
    };

    checkAuth();
  }, [router]);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
    } else {
      setVideos(data || []);
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
      .from('videos')
      .insert([{
        ...formData,
        slug,
        duration: formData.duration ? parseInt(formData.duration) : 0,
        published_at: formData.published_at ? new Date(formData.published_at).toISOString() : new Date().toISOString()
      }]);

    if (error) {
      setNotification({ show: true, type: 'error', message: 'Failed to create video' });
    } else {
      setNotification({ show: true, type: 'success', message: 'Video created successfully!' });
      setShowAddModal(false);
      setFormData({
        title: '', slug: '', description: '', thumbnail: '', video_url: '', duration: 0, category: 'interview',
        published_at: new Date().toISOString().slice(0, 16)
      });
      fetchVideos();
      setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
    }
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('videos')
      .update({
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : 0
      })
      .eq('id', selectedVideo.id);

    if (error) {
      setNotification({ show: true, type: 'error', message: 'Failed to update video' });
    } else {
      setNotification({ show: true, type: 'success', message: 'Video updated successfully!' });
      setShowEditModal(false);
      setSelectedVideo(null);
      fetchVideos();
      setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) {
        setNotification({ show: true, type: 'error', message: 'Failed to delete video' });
      } else {
        setNotification({ show: true, type: 'success', message: 'Video deleted successfully!' });
        fetchVideos();
        setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
      }
    }
  };

  const openEditModal = (video: any) => {
    setSelectedVideo(video);
    setFormData({
      title: video.title,
      slug: video.slug,
      description: video.description || '',
      thumbnail: video.thumbnail || '',
      video_url: video.video_url || '',
      duration: video.duration || 0,
      category: video.category || 'interview'
    });
    setShowEditModal(true);
  };

  const openViewModal = (video: any) => {
    setSelectedVideo(video);
    setShowViewModal(true);
  };

  const filteredVideos = videos.filter(video =>
    video.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Video className="h-6 w-6" />
          </Button>
          <h2 className="text-lg font-bold gold-gradient-text">Videos</h2>
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
            <h1 className="text-3xl font-bold mb-2">Videos</h1>
            <p className="text-muted-foreground">Manage video content, interviews, and documentaries</p>
          </div>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-black font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                Add Video
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Video</DialogTitle>
                <DialogDescription>Upload a new video to the platform</DialogDescription>
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
                        <Label htmlFor="video_url">Video URL *</Label>
                        <Input
                          id="video_url"
                          value={formData.video_url}
                          onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                          placeholder="https://youtube.com/watch?v=xxx"
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
                      <div>
                        <Label htmlFor="duration">Duration (seconds)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={formData.duration}
                          onChange={(e) => setFormData({...formData, duration: e.target.value})}
                          placeholder="360"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <select
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        >
                          <option value="interview">Interview</option>
                          <option value="documentary">Documentary</option>
                          <option value="news">News</option>
                          <option value="tutorial">Tutorial</option>
                          <option value="event-coverage">Event Coverage</option>
                        </select>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex gap-2 pt-4 border-t">
                  <Button type="submit" className="gold-gradient text-black font-semibold">
                    Add Video
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
              placeholder="Search videos by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading videos...</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="border-border/40 bg-card/50 hover:border-gold/40 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{video.title}</CardTitle>
                        <Badge variant="outline">{video.category}</Badge>
                      </div>
                      {video.description && (
                        <CardDescription className="line-clamp-2">{video.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openViewModal(video)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEditModal(video)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {video.video_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={video.video_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-red-400 hover:text-red-500" onClick={() => handleDelete(video.id)}>
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
                        <p className="font-medium">{video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Published:</span>
                        <p className="font-medium">{video.published_at ? new Date(video.published_at).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Film className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Category:</span>
                        <p className="font-medium">{video.category}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredVideos.length === 0 && (
              <Card className="border-border/40 bg-card/50">
                <CardContent className="py-12 text-center">
                  <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No videos found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* View Modal */}
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedVideo?.title}</DialogTitle>
              <DialogDescription>Video details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedVideo?.thumbnail && (
                <div className="rounded-lg overflow-hidden">
                  <img src={selectedVideo.thumbnail} alt={selectedVideo.title} className="w-full" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Slug</Label>
                  <div className="p-2 bg-secondary rounded-md font-mono text-sm">{selectedVideo?.slug}</div>
                </div>
                <div>
                  <Label>Category</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedVideo?.category}</div>
                </div>
              </div>
              {selectedVideo?.description && (
                <div>
                  <Label>Description</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedVideo.description}</div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Video URL</Label>
                  <div className="p-2 bg-secondary rounded-md truncate">{selectedVideo?.video_url || 'N/A'}</div>
                </div>
                <div>
                  <Label>Duration</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedVideo?.duration ? `${Math.floor(selectedVideo.duration / 60)}:${(selectedVideo.duration % 60).toString().padStart(2, '0')}` : 'N/A'}</div>
                </div>
              </div>
              <div>
                <Label>Published</Label>
                <div className="p-2 bg-secondary rounded-md">{selectedVideo?.published_at ? new Date(selectedVideo.published_at).toLocaleDateString() : 'N/A'}</div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Video</DialogTitle>
              <DialogDescription>Update video information</DialogDescription>
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
                      <Label htmlFor="edit-video_url">Video URL *</Label>
                      <Input
                        id="edit-video_url"
                        value={formData.video_url}
                        onChange={(e) => setFormData({...formData, video_url: e.target.value})}
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
                    <div>
                      <Label htmlFor="edit-duration">Duration (seconds)</Label>
                      <Input
                        id="edit-duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-category">Category</Label>
                      <select
                        id="edit-category"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background"
                      >
                        <option value="interview">Interview</option>
                        <option value="documentary">Documentary</option>
                        <option value="news">News</option>
                        <option value="tutorial">Tutorial</option>
                        <option value="event-coverage">Event Coverage</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" className="gold-gradient text-black font-semibold">
                  Update Video
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
