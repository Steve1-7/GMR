'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/shared/motion';
import { supabase } from '@/lib/supabase';
import { FileText, Plus, Edit, Trash2, Eye, Download } from 'lucide-react';

export default function AdminMagazines() {
  const router = useRouter();
  const [magazines, setMagazines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [form, setForm] = useState({
    title: 'Gold-Coast Mining Review',
    issue: '',
    date: '',
    cover_image: '',
    pdf_url: '',
    description: '',
    featured: false,
    categories: '',
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push('/admin/login');
      else fetchMagazines();
    };
    checkAuth();
  }, [router]);

  const fetchMagazines = async () => {
    const { data, error } = await supabase.from('magazines').select('*').order('created_at', { ascending: false });
    if (error) setMessage({ type: 'error', text: error.message });
    else setMagazines(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.issue.trim() || !form.pdf_url.trim()) {
      setMessage({ type: 'error', text: 'Issue and PDF URL are required' });
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      categories: form.categories ? form.categories.split(',').map((c) => c.trim()) : [],
      updated_at: new Date().toISOString(),
    };
    try {
      if (editingId) {
        const { error } = await supabase.from('magazines').update(payload).eq('id', editingId);
        if (error) throw error;
        setMessage({ type: 'success', text: 'Magazine updated' });
      } else {
        const { error } = await supabase.from('magazines').insert([payload]);
        if (error) throw error;
        setMessage({ type: 'success', text: 'Magazine created' });
      }
      setForm({ title: 'Gold-Coast Mining Review', issue: '', date: '', cover_image: '', pdf_url: '', description: '', featured: false, categories: '' });
      setEditingId(null);
      fetchMagazines();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    }
    setSaving(false);
  };

  const handleEdit = (mag: any) => {
    setEditingId(mag.id);
    setForm({
      title: mag.title,
      issue: mag.issue,
      date: mag.date,
      cover_image: mag.cover_image || '',
      pdf_url: mag.pdf_url || '',
      description: mag.description || '',
      featured: mag.featured || false,
      categories: (mag.categories || []).join(', '),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this magazine?')) return;
    const { error } = await supabase.from('magazines').delete().eq('id', id);
    if (error) setMessage({ type: 'error', text: error.message });
    else { setMessage({ type: 'success', text: 'Magazine deleted' }); fetchMagazines(); }
  };

  return (
    <div className="min-h-screen bg-background lg:ml-64 p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Magazines</h1>
        <p className="text-muted-foreground">Manage magazine publications</p>
      </div>

      {message.text && (
        <div className={`mb-4 p-3 rounded text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{message.text}</div>
      )}

      <FadeIn>
        <Card className="border-border/40 bg-card/50 mb-8">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Magazine' : 'Add Magazine'}</CardTitle>
            <CardDescription>Upload magazine metadata and PDF links</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                <div><Label>Issue</Label><Input value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })} placeholder="June 2026 Edition" required /></div>
                <div><Label>Date</Label><Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="June 2026" required /></div>
                <div><Label>Cover Image URL</Label><Input value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} placeholder="/news/cover.webp" required /></div>
                <div className="col-span-2"><Label>PDF URL</Label><Input value={form.pdf_url} onChange={(e) => setForm({ ...form, pdf_url: e.target.value })} placeholder="https://..." required /></div>
                <div className="col-span-2"><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div className="col-span-2"><Label>Categories (comma-separated)</Label><Input value={form.categories} onChange={(e) => setForm({ ...form, categories: e.target.value })} placeholder="Gold, Market Analysis" /></div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} id="featured" />
                <Label htmlFor="featured">Featured Magazine</Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="gold-gradient text-black" disabled={saving}>
                  <Plus className="mr-2 h-4 w-4" />
                  {editingId ? 'Update Magazine' : 'Add Magazine'}
                </Button>
                {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm({ title: 'Gold-Coast Mining Review', issue: '', date: '', cover_image: '', pdf_url: '', description: '', featured: false, categories: '' }); }}>Cancel</Button>}
              </div>
            </form>
          </CardContent>
        </Card>
      </FadeIn>

      {loading ? (
        <p className="text-muted-foreground">Loading magazines...</p>
      ) : magazines.length === 0 ? (
        <p className="text-muted-foreground">No magazines yet. Add your first issue above.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {magazines.map((magazine, i) => (
            <FadeIn key={magazine.id} delay={i * 0.1}>
              <Card className="border-border/40 bg-card/50 overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <img src={magazine.cover_image} alt={magazine.title} className="w-full h-full object-cover" />
                  {magazine.featured && <div className="absolute top-2 right-2 bg-gold text-black text-xs px-2 py-1 rounded font-semibold">Featured</div>}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{magazine.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{magazine.issue}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => window.open(magazine.pdf_url, '_blank')}><Eye className="h-3 w-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(magazine)}><Edit className="h-3 w-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => window.open(magazine.pdf_url, '_blank')}><Download className="h-3 w-3" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(magazine.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
