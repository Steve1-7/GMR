'use client';

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Newspaper, Plus, Search, Edit, Trash2, Eye, EyeOff, Clock, User, FileText, Calendar, Tag, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';

export default function AdminNews() {
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [notification, setNotification] = useState({ show: false, type: 'success', message: '' });
  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'news',
    featured_image: '',
    author_id: '',
    is_premium: false,
    tags: [],
    reading_time: 5,
    published_at: new Date().toISOString().slice(0, 16)
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        fetchArticles();
        fetchAuthors();
      }
    };
    checkAuth();
  }, [router]);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*, authors(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
    } else {
      setArticles(data || []);
    }
    setLoading(false);
  };

  const fetchAuthors = async () => {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching authors:', error);
    } else {
      setAuthors(data || []);
    }
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
    
    // Prepare payload with only valid database columns
    const payload = {
      title: formData.title,
      slug: slug,
      excerpt: formData.excerpt || '',
      content: formData.content || '',
      category: formData.category || 'news',
      featured_image: formData.featured_image || '',
      author_id: formData.author_id || null,
      is_premium: formData.is_premium || false,
      tags: formData.tags && formData.tags.length > 0 ? formData.tags : null,
      reading_time: formData.reading_time ? parseInt(String(formData.reading_time)) : 5,
      published_at: formData.published_at ? new Date(formData.published_at).toISOString() : new Date().toISOString()
    };

    console.log('Creating article with payload:', payload);

    const { error, data } = await supabase
      .from('articles')
      .insert([payload])
      .select();

    if (error) {
      console.error('Article creation error:', error);
      setNotification({ show: true, type: 'error', message: `Failed to create article: ${error.message}` });
    } else {
      console.log('Article created successfully:', data);
      setNotification({ show: true, type: 'success', message: 'Article created successfully!' });
      setShowAddModal(false);
      setFormData({
        title: '', slug: '', excerpt: '', content: '', category: 'news',
        featured_image: '', author_id: '', is_premium: false, tags: [], reading_time: 5,
        published_at: new Date().toISOString().slice(0, 16)
      });
      fetchArticles();
      setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
    }
  };

  const handleUpdate = async () => {
    const payload = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt || '',
      content: formData.content || '',
      category: formData.category || 'news',
      featured_image: formData.featured_image || '',
      author_id: formData.author_id || null,
      is_premium: formData.is_premium || false,
      tags: formData.tags && formData.tags.length > 0 ? formData.tags : null,
      reading_time: formData.reading_time ? parseInt(String(formData.reading_time)) : 5,
      updated_at: new Date().toISOString()
    };

    console.log('Updating article with payload:', payload);

    const { error, data } = await supabase
      .from('articles')
      .update(payload)
      .eq('id', selectedArticle.id)
      .select();

    if (error) {
      console.error('Article update error:', error);
      setNotification({ show: true, type: 'error', message: `Failed to update article: ${error.message}` });
    } else {
      console.log('Article updated successfully:', data);
      setNotification({ show: true, type: 'success', message: 'Article updated successfully!' });
      setShowEditModal(false);
      setSelectedArticle(null);
      fetchArticles();
      setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      console.log('Deleting article with id:', id);
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Article deletion error:', error);
        setNotification({ show: true, type: 'error', message: `Failed to delete article: ${error.message}` });
      } else {
        console.log('Article deleted successfully');
        setNotification({ show: true, type: 'success', message: 'Article deleted successfully!' });
        fetchArticles();
        setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
      }
    }
  };

  const handleTogglePremium = async (article: any) => {
    const { error } = await supabase
      .from('articles')
      .update({ is_premium: !article.is_premium })
      .eq('id', article.id);

    if (!error) {
      setNotification({ show: true, type: 'success', message: 'Article premium status updated!' });
      fetchArticles();
      setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
    } else {
      setNotification({ show: true, type: 'error', message: 'Failed to update premium status' });
      setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
    }
  };

  const openEditModal = (article: any) => {
    setSelectedArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category || 'news',
      featured_image: article.featured_image || '',
      author_id: article.author_id || '',
      is_premium: article.is_premium,
      tags: article.tags || [],
      reading_time: article.reading_time || 5
    });
    setShowEditModal(true);
  };

  const openViewModal = (article: any) => {
    setSelectedArticle(article);
    setShowViewModal(true);
  };

  const filteredArticles = articles.filter(article =>
    article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Newspaper className="h-6 w-6" />
          </Button>
          <h2 className="text-lg font-bold gold-gradient-text">News Articles</h2>
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
            <h1 className="text-3xl font-bold mb-2">News Articles</h1>
            <p className="text-muted-foreground">Manage news articles, investigations, and analysis</p>
          </div>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-black font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                Create Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Article</DialogTitle>
                <DialogDescription>Write and publish a new news article</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs defaultValue="content">
                  <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
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
                        <Label htmlFor="excerpt">Excerpt *</Label>
                        <Textarea
                          id="excerpt"
                          value={formData.excerpt}
                          onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="content">Content *</Label>
                        <Textarea
                          id="content"
                          value={formData.content}
                          onChange={(e) => setFormData({...formData, content: e.target.value})}
                          rows={15}
                          required
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="media">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="featured_image">Featured Image URL</Label>
                        <Input
                          id="featured_image"
                          value={formData.featured_image}
                          onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <select
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full px-3 py-2 rounded-md border border-input bg-background"
                          >
                            <option value="news">News</option>
                            <option value="investigation">Investigation</option>
                            <option value="interview">Interview</option>
                            <option value="analysis">Analysis</option>
                            <option value="opinion">Opinion</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="author_id">Author</Label>
                          <select
                            id="author_id"
                            value={formData.author_id}
                            onChange={(e) => setFormData({...formData, author_id: e.target.value})}
                            className="w-full px-3 py-2 rounded-md border border-input bg-background"
                          >
                            <option value="">Select author</option>
                            {authors.map(author => (
                              <option key={author.id} value={author.id}>{author.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="tags">Tags (comma-separated)</Label>
                        <Input
                          id="tags"
                          value={formData.tags.join(', ')}
                          onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                          placeholder="mining, gold, ghana, investment"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reading_time">Reading Time (minutes)</Label>
                        <Input
                          id="reading_time"
                          type="number"
                          value={formData.reading_time}
                          onChange={(e) => setFormData({...formData, reading_time: e.target.value})}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={formData.is_premium}
                          onCheckedChange={(checked) => setFormData({...formData, is_premium: checked})}
                        />
                        <Label>Premium Article</Label>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex gap-2 pt-4 border-t">
                  <Button type="submit" className="gold-gradient text-black font-semibold">
                    Create Article
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
              placeholder="Search articles by title, excerpt, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading articles...</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="border-border/40 bg-card/50 hover:border-gold/40 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <Badge variant={article.is_premium ? 'default' : 'secondary'}>
                          {article.is_premium ? 'Premium' : 'Free'}
                        </Badge>
                        <Badge variant="outline">{article.category}</Badge>
                      </div>
                      {article.excerpt && (
                        <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openViewModal(article)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEditModal(article)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleTogglePremium(article)}
                      >
                        {article.is_premium ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-400 hover:text-red-500" onClick={() => handleDelete(article.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Author:</span>
                        <p className="font-medium truncate">{article.authors?.name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Published:</span>
                        <p className="font-medium">{article.published_at ? new Date(article.published_at).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Read time:</span>
                        <p className="font-medium">{article.reading_time || 5} min</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Tags:</span>
                        <p className="font-medium truncate">{article.tags?.slice(0, 3).join(', ') || 'None'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredArticles.length === 0 && (
              <Card className="border-border/40 bg-card/50">
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No articles found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* View Modal */}
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedArticle?.title}</DialogTitle>
              <DialogDescription>Article preview</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Slug</Label>
                  <div className="p-2 bg-secondary rounded-md font-mono text-sm">{selectedArticle?.slug}</div>
                </div>
                <div>
                  <Label>Category</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedArticle?.category}</div>
                </div>
              </div>
              {selectedArticle?.excerpt && (
                <div>
                  <Label>Excerpt</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedArticle.excerpt}</div>
                </div>
              )}
              {selectedArticle?.content && (
                <div>
                  <Label>Content</Label>
                  <div className="p-2 bg-secondary rounded-md max-h-60 overflow-y-auto whitespace-pre-wrap">{selectedArticle.content}</div>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label>Author</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedArticle?.authors?.name || 'N/A'}</div>
                </div>
                <div>
                  <Label>Published</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedArticle?.published_at ? new Date(selectedArticle.published_at).toLocaleDateString() : 'N/A'}</div>
                </div>
                <div>
                  <Label>Read Time</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedArticle?.reading_time || 5} min</div>
                </div>
                <div>
                  <Label>Premium</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedArticle?.is_premium ? 'Yes' : 'No'}</div>
                </div>
              </div>
              {selectedArticle?.featured_image && (
                <div>
                  <Label>Featured Image</Label>
                  <div className="p-2 bg-secondary rounded-md truncate">{selectedArticle.featured_image}</div>
                </div>
              )}
              {selectedArticle?.tags && selectedArticle.tags.length > 0 && (
                <div>
                  <Label>Tags</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedArticle.tags.join(', ')}</div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Article</DialogTitle>
              <DialogDescription>Update article information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <Tabs defaultValue="content">
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
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
                      <Label htmlFor="edit-excerpt">Excerpt *</Label>
                      <Textarea
                        id="edit-excerpt"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-content">Content *</Label>
                      <Textarea
                        id="edit-content"
                        value={formData.content}
                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                        rows={15}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="media">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-featured_image">Featured Image URL</Label>
                      <Input
                        id="edit-featured_image"
                        value={formData.featured_image}
                        onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="settings">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-category">Category</Label>
                        <select
                          id="edit-category"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        >
                          <option value="news">News</option>
                          <option value="investigation">Investigation</option>
                          <option value="interview">Interview</option>
                          <option value="analysis">Analysis</option>
                          <option value="opinion">Opinion</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="edit-author_id">Author</Label>
                        <select
                          id="edit-author_id"
                          value={formData.author_id}
                          onChange={(e) => setFormData({...formData, author_id: e.target.value})}
                          className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        >
                          <option value="">Select author</option>
                          {authors.map(author => (
                            <option key={author.id} value={author.id}>{author.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
                      <Input
                        id="edit-tags"
                        value={formData.tags.join(', ')}
                        onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-reading_time">Reading Time (minutes)</Label>
                      <Input
                        id="edit-reading_time"
                        type="number"
                        value={formData.reading_time}
                        onChange={(e) => setFormData({...formData, reading_time: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={formData.is_premium}
                        onCheckedChange={(checked) => setFormData({...formData, is_premium: checked})}
                      />
                      <Label>Premium Article</Label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" className="gold-gradient text-black font-semibold">
                  Update Article
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
