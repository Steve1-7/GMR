'use client';

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Plus, Search, Edit, Trash2, Eye, MapPin, Calendar as CalendarIcon, ExternalLink, CalendarClock, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';

export default function AdminEvents() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [notification, setNotification] = useState({ show: false, type: 'success', message: '' });
  const [formData, setFormData] = useState<any>({
    title: '',
    slug: '',
    description: '',
    date: '',
    location: '',
    url: '',
    image: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        fetchEvents();
      }
    };

    checkAuth();
  }, [router]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents(data || []);
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
      .from('events')
      .insert([{
        ...formData,
        slug,
        date: formData.date ? new Date(formData.date).toISOString() : null
      }]);

    if (error) {
      setNotification({ show: true, type: 'error', message: 'Failed to create event' });
    } else {
      setNotification({ show: true, type: 'success', message: 'Event created successfully!' });
      setShowAddModal(false);
      setFormData({
        title: '', slug: '', description: '', date: '', location: '', url: '', image: ''
      });
      fetchEvents();
      setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
    }
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('events')
      .update({
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : null
      })
      .eq('id', selectedEvent.id);

    if (error) {
      setNotification({ show: true, type: 'error', message: 'Failed to update event' });
    } else {
      setNotification({ show: true, type: 'success', message: 'Event updated successfully!' });
      setShowEditModal(false);
      setSelectedEvent(null);
      fetchEvents();
      setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        setNotification({ show: true, type: 'error', message: 'Failed to delete event' });
      } else {
        setNotification({ show: true, type: 'success', message: 'Event deleted successfully!' });
        fetchEvents();
        setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
      }
    }
  };

  const openEditModal = (event: any) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      slug: event.slug,
      description: event.description || '',
      date: event.date ? event.date.split('T')[0] : '',
      location: event.location || '',
      url: event.url || '',
      image: event.image || ''
    });
    setShowEditModal(true);
  };

  const openViewModal = (event: any) => {
    setSelectedEvent(event);
    setShowViewModal(true);
  };

  const filteredEvents = events.filter(event =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isUpcoming = (eventDate: any) => {
    return new Date(eventDate) > new Date();
  };

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
            <CalendarIcon className="h-6 w-6" />
          </Button>
          <h2 className="text-lg font-bold gold-gradient-text">Events</h2>
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
            <h1 className="text-3xl font-bold mb-2">Events</h1>
            <p className="text-muted-foreground">Manage mining industry conferences, exhibitions, and events</p>
          </div>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-black font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>Create a new mining industry event</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs defaultValue="content">
                  <TabsList>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Event Title *</Label>
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

                  <TabsContent value="details">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="date">Event Date *</Label>
                        <Input
                          id="date"
                          type="datetime-local"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="Accra International Conference Centre, Ghana"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="url">Event Website URL</Label>
                        <Input
                          id="url"
                          value={formData.url}
                          onChange={(e) => setFormData({...formData, url: e.target.value})}
                          placeholder="https://example.com/event"
                        />
                      </div>
                      <div>
                        <Label htmlFor="image">Event Image URL</Label>
                        <Input
                          id="image"
                          value={formData.image}
                          onChange={(e) => setFormData({...formData, image: e.target.value})}
                          placeholder="https://example.com/event-banner.jpg"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex gap-2 pt-4 border-t">
                  <Button type="submit" className="gold-gradient text-black font-semibold">
                    Add Event
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
              placeholder="Search events by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading events...</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="border-border/40 bg-card/50 hover:border-gold/40 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge variant={isUpcoming(event.date) ? 'default' : 'secondary'}>
                          {isUpcoming(event.date) ? 'Upcoming' : 'Past'}
                        </Badge>
                      </div>
                      {event.description && (
                        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openViewModal(event)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEditModal(event)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {event.url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={event.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-red-400 hover:text-red-500" onClick={() => handleDelete(event.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <p className="font-medium">{event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <p className="font-medium truncate">{event.location || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Time:</span>
                        <p className="font-medium">{event.date ? new Date(event.date).toLocaleTimeString() : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredEvents.length === 0 && (
              <Card className="border-border/40 bg-card/50">
                <CardContent className="py-12 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No events found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* View Modal */}
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedEvent?.title}</DialogTitle>
              <DialogDescription>Event details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedEvent?.image && (
                <div className="rounded-lg overflow-hidden">
                  <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full" />
                </div>
              )}
              <div>
                <Label>Slug</Label>
                <div className="p-2 bg-secondary rounded-md font-mono text-sm">{selectedEvent?.slug}</div>
              </div>
              {selectedEvent?.description && (
                <div>
                  <Label>Description</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedEvent.description}</div>
                </div>
              )}
                <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                <div className="p-2 bg-secondary rounded-md">{selectedEvent?.date ? new Date(selectedEvent.date).toLocaleDateString() : 'N/A'}</div>
                </div>
                <div>
                  <Label>Time</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedEvent?.date ? new Date(selectedEvent.date).toLocaleTimeString() : 'N/A'}</div>
                </div>
              </div>
              <div>
                <Label>Location</Label>
                <div className="p-2 bg-secondary rounded-md">{selectedEvent?.location || 'N/A'}</div>
              </div>
              {selectedEvent?.url && (
                <div>
                  <Label>Event Website</Label>
                  <div className="p-2 bg-secondary rounded-md">
                    <a href={selectedEvent.url} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                      {selectedEvent.url}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>Update event information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <Tabs defaultValue="content">
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-title">Event Title *</Label>
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

                <TabsContent value="details">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-date">Event Date *</Label>
                      <Input
                        id="edit-date"
                        type="datetime-local"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-location">Location *</Label>
                      <Input
                        id="edit-location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-url">Event Website URL</Label>
                      <Input
                        id="edit-url"
                        value={formData.url}
                        onChange={(e) => setFormData({...formData, url: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-image">Event Image URL</Label>
                      <Input
                        id="edit-image"
                        value={formData.image}
                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" className="gold-gradient text-black font-semibold">
                  Update Event
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
