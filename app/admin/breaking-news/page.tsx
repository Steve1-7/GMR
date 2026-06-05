'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { ArrowLeft, Eye, Plus, Trash2, Edit } from 'lucide-react';

const emptyForm = {
  headline: '',
  summary: '',
  article_url: '',
  featured_image: '',
  publish_date: '',
  status: 'draft',
  priority: 0,
};

export default function AdminBreakingNews() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/admin/login');
      else load();
    };
    checkAuth();
  }, [router]);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from('breaking_news')
      .select('*')
      .order('priority', { ascending: false })
      .order('publish_date', { ascending: false });
    if (error) setMessage({ type: 'error', text: error.message });
    else setItems(data || []);
    setLoading(false);
  }

  async function handleSave() {
    if (!form.headline.trim()) {
      setMessage({ type: 'error', text: 'Headline is required' });
      return;
    }
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = {
        ...form,
        publish_date: form.publish_date || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (editingId) {
        const { error } = await supabase.from('breaking_news').update(payload).eq('id', editingId);
        if (error) throw error;
        setMessage({ type: 'success', text: 'Breaking news updated successfully' });
      } else {
        const { error } = await supabase.from('breaking_news').insert([payload]);
        if (error) throw error;
        setMessage({ type: 'success', text: 'Breaking news created successfully' });
      }
      setForm(emptyForm);
      setEditingId(null);
      setPreview(false);
      await load();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save' });
    }
    setLoading(false);
  }

  async function handleEdit(item: any) {
    setEditingId(item.id);
    setForm({
      headline: item.headline,
      summary: item.summary || '',
      article_url: item.article_url || '',
      featured_image: item.featured_image || '',
      publish_date: item.publish_date ? item.publish_date.slice(0, 16) : '',
      status: item.status,
      priority: item.priority || 0,
    });
    setPreview(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this breaking news item?')) return;
    setLoading(true);
    const { error } = await supabase.from('breaking_news').delete().eq('id', id);
    if (error) setMessage({ type: 'error', text: error.message });
    else setMessage({ type: 'success', text: 'Item deleted' });
    await load();
    setLoading(false);
  }

  async function togglePublish(item: any) {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    const { error } = await supabase.from('breaking_news').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', item.id);
    if (error) setMessage({ type: 'error', text: error.message });
    else await load();
  }

  return (
    <div className="min-h-screen bg-background lg:ml-64 p-4 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Breaking News</h1>
          <p className="text-muted-foreground">Manage homepage breaking news ticker and hero headlines</p>
        </div>
        <Link href="/admin" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
      </div>

      {message.text && (
        <div className={`mb-4 p-3 rounded text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Items ({items.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading && items.length === 0 ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : items.length === 0 ? (
                <p className="text-muted-foreground">No breaking news items yet. Create one to populate the homepage ticker.</p>
              ) : (
                <div className="space-y-3">
                  {items.map((it) => (
                    <div key={it.id} className="flex items-start justify-between p-4 border border-border/40 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium truncate">{it.headline}</span>
                          <Badge variant={it.status === 'published' ? 'default' : 'secondary'}>{it.status}</Badge>
                          <Badge variant="outline">P{it.priority}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{it.summary}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {it.publish_date ? new Date(it.publish_date).toLocaleString() : 'Not scheduled'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4 shrink-0">
                        <Button size="sm" variant="outline" onClick={() => togglePublish(it)}>
                          {it.status === 'published' ? 'Unpublish' : 'Publish'}
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(it)}><Edit className="h-3 w-3" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(it.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {editingId ? 'Edit Item' : <><Plus className="h-4 w-4" /> Create Item</>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Headline *</Label>
                <Input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} placeholder="Breaking headline" />
              </div>
              <div>
                <Label>Summary</Label>
                <Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Short summary" rows={3} />
              </div>
              <div>
                <Label>Article URL</Label>
                <Input value={form.article_url} onChange={(e) => setForm({ ...form, article_url: e.target.value })} placeholder="/article/slug or external URL" />
              </div>
              <div>
                <Label>Featured Image URL</Label>
                <Input value={form.featured_image} onChange={(e) => setForm({ ...form, featured_image: e.target.value })} placeholder="/path/to/image.jpg" />
              </div>
              <div>
                <Label>Publish Date</Label>
                <Input type="datetime-local" value={form.publish_date} onChange={(e) => setForm({ ...form, publish_date: e.target.value })} />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label>Priority</Label>
                  <Input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={form.status === 'published'} onCheckedChange={(c) => setForm({ ...form, status: c ? 'published' : 'draft' })} />
                  <Label>Published</Label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={loading} className="flex-1 gold-gradient text-black">
                  {editingId ? 'Update' : 'Create'}
                </Button>
                <Button variant="outline" onClick={() => setPreview(!preview)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => { setForm(emptyForm); setEditingId(null); setPreview(false); }}>Reset</Button>
              </div>
            </CardContent>
          </Card>

          {preview && form.headline && (
            <Card className="border-gold/30">
              <CardHeader><CardTitle className="text-sm">Preview</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-semibold uppercase text-red-400">Breaking</span>
                </div>
                <h3 className="text-lg font-bold">{form.headline}</h3>
                {form.summary && <p className="text-sm text-muted-foreground mt-2">{form.summary}</p>}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
