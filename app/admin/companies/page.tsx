'use client';

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, Plus, Search, Edit, Trash2, Download, Eye, EyeOff, MapPin, Users, Calendar, DollarSign, ExternalLink, FileText, Star, StarOff } from 'lucide-react';
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

export default function AdminCompanies() {
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [notification, setNotification] = useState({ show: false, type: 'success', message: '' });
  const [formData, setFormData] = useState<any>({
    name: '',
    type: 'Junior',
    category: 'Mining Services',
    description: '',
    email: '',
    phone: '',
    website: '',
    hq: '',
    employees: '',
    founded: '',
    projects: '',
    regions: [],
    featured: false,
    focus: '',
    stock_symbol: '',
    exchange: '',
    market_cap: '',
    market_cap_num: '',
    change: '',
    initials: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        fetchCompanies();
      }
    };
    checkAuth();
  }, [router]);

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching companies:', error);
    } else {
      setCompanies(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from('companies')
      .insert([{
        ...formData,
        employees: formData.employees ? parseInt(formData.employees) : null,
        founded: formData.founded ? parseInt(formData.founded) : null,
        projects: formData.projects ? parseInt(String(formData.projects)) : 0,
        regions: formData.regions.length > 0 ? formData.regions : null,
        market_cap_num: formData.market_cap_num ? parseFloat(String(formData.market_cap_num)) : 0,
        change: formData.change ? parseFloat(String(formData.change)) : 0
      }]);

    if (error) {
      setNotification({ show: true, type: 'error', message: 'Failed to create company' });
    } else {
      setNotification({ show: true, type: 'success', message: 'Company created successfully!' });
      setShowAddModal(false);
      setFormData({
        name: '', type: 'Junior', category: 'Mining Services', description: '', email: '', phone: '', website: '',
        hq: '', employees: '', founded: '', projects: '', regions: [], featured: false,
        focus: '', stock_symbol: '', exchange: '', market_cap: '', market_cap_num: '', change: '', initials: ''
      });
      fetchCompanies();
      setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
    }
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from('companies')
      .update({
        ...formData,
        employees: formData.employees ? parseInt(formData.employees) : null,
        founded: formData.founded ? parseInt(formData.founded) : null,
        projects: formData.projects ? parseInt(String(formData.projects)) : 0,
        regions: formData.regions.length > 0 ? formData.regions : null,
        market_cap_num: formData.market_cap_num ? parseFloat(String(formData.market_cap_num)) : 0,
        change: formData.change ? parseFloat(String(formData.change)) : 0
      })
      .eq('id', selectedCompany.id);

    if (error) {
      setNotification({ show: true, type: 'error', message: 'Failed to update company' });
    } else {
      setNotification({ show: true, type: 'success', message: 'Company updated successfully!' });
      setShowEditModal(false);
      setSelectedCompany(null);
      fetchCompanies();
      setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
    }
  };

  const handleDelete = async (id: any) => {
    if (confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);

      if (error) {
        setNotification({ show: true, type: 'error', message: 'Failed to delete company' });
      } else {
        setNotification({ show: true, type: 'success', message: 'Company deleted successfully!' });
        fetchCompanies();
        setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
      }
    }
  };

  const handleToggleFeatured = async (company: any) => {
    const { error } = await supabase
      .from('companies')
      .update({ featured: !company.featured })
      .eq('id', company.id);

    if (!error) {
      setNotification({ show: true, type: 'success', message: 'Company featured status updated!' });
      fetchCompanies();
      setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
    } else {
      setNotification({ show: true, type: 'error', message: 'Failed to update featured status' });
      setTimeout(() => setNotification({ show: false, type: 'success', message: '' }), 3000);
    }
  };

  const openEditModal = (company: any) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      type: company.type,
      category: company.category || 'Mining Services',
      description: company.description || '',
      email: company.email || '',
      phone: company.phone || '',
      website: company.website || '',
      hq: company.hq || '',
      employees: company.employees?.toString() || '',
      founded: company.founded?.toString() || '',
      projects: company.projects?.toString() || '',
      regions: company.regions || [],
      featured: company.featured,
      focus: company.focus || '',
      stock_symbol: company.stock_symbol || '',
      exchange: company.exchange || '',
      market_cap: company.market_cap || '',
      market_cap_num: company.market_cap_num?.toString() || '',
      change: company.change?.toString() || '',
      initials: company.initials || ''
    });
    setShowEditModal(true);
  };

  const openViewModal = (company: any) => {
    setSelectedCompany(company);
    setShowViewModal(true);
  };

  const filteredCompanies = companies.filter(company =>
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.type?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Building2 className="h-6 w-6" />
          </Button>
          <h2 className="text-lg font-bold gold-gradient-text">Companies</h2>
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
            <h1 className="text-3xl font-bold mb-2">Companies</h1>
            <p className="text-muted-foreground">Manage mining company listings and profiles</p>
          </div>
          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button className="gold-gradient text-black font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                Add Company
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Company</DialogTitle>
                <DialogDescription>Create a new company listing</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs defaultValue="basic">
                  <TabsList>
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="financials">Financials</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Company Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="type">Company Type</Label>
                          <select
                            id="type"
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="w-full px-3 py-2 rounded-md border border-input bg-background"
                          >
                            <option value="Junior">Junior</option>
                            <option value="Mid-Tier">Mid-Tier</option>
                            <option value="Major">Major</option>
                            <option value="Diversified Major">Diversified Major</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <select
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full px-3 py-2 rounded-md border border-input bg-background"
                          >
                            <option value="Mining Services">Mining Services</option>
                            <option value="Engineering Firms">Engineering Firms</option>
                            <option value="Exploration Companies">Exploration Companies</option>
                            <option value="Equipment Suppliers">Equipment Suppliers</option>
                            <option value="Financial Services">Financial Services</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          rows={3}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="details">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="website">Website URL</Label>
                        <Input
                          id="website"
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                          placeholder="https://www.companyname.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hq">Headquarters</Label>
                        <Input
                          id="hq"
                          value={formData.hq}
                          onChange={(e) => setFormData({...formData, hq: e.target.value})}
                          placeholder="Accra, Ghana"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="employees">Employees</Label>
                          <Input
                            id="employees"
                            type="number"
                            value={formData.employees}
                            onChange={(e) => setFormData({...formData, employees: e.target.value})}
                            placeholder="1000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="founded">Founded</Label>
                          <Input
                            id="founded"
                            type="number"
                            value={formData.founded}
                            onChange={(e) => setFormData({...formData, founded: e.target.value})}
                            placeholder="2010"
                          />
                        </div>
                        <div>
                          <Label htmlFor="projects">Projects</Label>
                          <Input
                            id="projects"
                            type="number"
                            value={formData.projects}
                            onChange={(e) => setFormData({...formData, projects: e.target.value})}
                            placeholder="5"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="regions">Regions (comma-separated)</Label>
                        <Input
                          id="regions"
                          value={formData.regions.join(', ')}
                          onChange={(e) => setFormData({...formData, regions: e.target.value.split(', ').filter(r => r)})}
                          placeholder="Ghana, Mali, Burkina Faso"
                        />
                      </div>
                      <div>
                        <Label htmlFor="focus">Focus Area</Label>
                        <Input
                          id="focus"
                          value={formData.focus}
                          onChange={(e) => setFormData({...formData, focus: e.target.value})}
                          placeholder="Gold mining, exploration"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="financials">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="stock_symbol">Stock Symbol</Label>
                          <Input
                            id="stock_symbol"
                            value={formData.stock_symbol}
                            onChange={(e) => setFormData({...formData, stock_symbol: e.target.value})}
                            placeholder="AGA"
                            className="uppercase"
                          />
                        </div>
                        <div>
                          <Label htmlFor="exchange">Exchange</Label>
                          <Input
                            id="exchange"
                            value={formData.exchange}
                            onChange={(e) => setFormData({...formData, exchange: e.target.value})}
                            placeholder="NYSE"
                            className="uppercase"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="market_cap">Market Cap</Label>
                          <Input
                            id="market_cap"
                            value={formData.market_cap}
                            onChange={(e) => setFormData({...formData, market_cap: e.target.value})}
                            placeholder="$10.5B"
                          />
                        </div>
                        <div>
                          <Label htmlFor="market_cap_num">Market Cap (numeric)</Label>
                          <Input
                            id="market_cap_num"
                            type="number"
                            value={formData.market_cap_num}
                            onChange={(e) => setFormData({...formData, market_cap_num: e.target.value})}
                            placeholder="10500000000"
                          />
                        </div>
                        <div>
                          <Label htmlFor="change">Change (%)</Label>
                          <Input
                            id="change"
                            type="number"
                            step="0.01"
                            value={formData.change}
                            onChange={(e) => setFormData({...formData, change: e.target.value})}
                            placeholder="2.5"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="initials">Initials</Label>
                        <Input
                          id="initials"
                          value={formData.initials}
                          onChange={(e) => setFormData({...formData, initials: e.target.value})}
                          placeholder="GMR"
                          className="uppercase"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex gap-2 pt-4 border-t">
                  <Button type="submit" className="gold-gradient text-black font-semibold">
                    Create Company
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
              placeholder="Search companies by name, category, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Loading companies...</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="border-border/40 bg-card/50 hover:border-gold/40 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{company.name}</CardTitle>
                        <Badge variant={company.featured ? 'default' : 'secondary'}>
                          {company.featured ? 'Featured' : 'Standard'}
                        </Badge>
                        <Badge variant="outline">{company.type}</Badge>
                        <Badge variant="outline">{company.category}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openViewModal(company)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openEditModal(company)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className={company.featured ? 'text-red-400 hover:text-red-500' : ''}
                        onClick={() => handleToggleFeatured(company)}
                      >
                        {company.featured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-400 hover:text-red-500" onClick={() => handleDelete(company.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">HQ:</span>
                        <p className="font-medium">{company.hq || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Employees:</span>
                        <p className="font-medium">{company.employees || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Founded:</span>
                        <p className="font-medium">{company.founded || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Projects:</span>
                        <p className="font-medium">{company.projects || 0}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredCompanies.length === 0 && (
              <Card className="border-border/40 bg-card/50">
                <CardContent className="py-12 text-center">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No companies found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* View Modal */}
        <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedCompany?.name}</DialogTitle>
              <DialogDescription>Company details and information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company Type</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedCompany?.type || 'N/A'}</div>
                </div>
                <div>
                  <Label>Category</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedCompany?.category || 'N/A'}</div>
                </div>
              </div>
              {selectedCompany?.description && (
                <div>
                  <Label>Description</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedCompany.description}</div>
                </div>
              )}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label>Email</Label>
                  <div className="p-2 bg-secondary rounded-md truncate">{selectedCompany?.email || 'N/A'}</div>
                </div>
                <div>
                  <Label>Phone</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedCompany?.phone || 'N/A'}</div>
                </div>
                <div>
                  <Label>Headquarters</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedCompany?.hq || 'N/A'}</div>
                </div>
                <div>
                  <Label>Employees</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedCompany?.employees || 'N/A'}</div>
                </div>
                <div>
                  <Label>Founded</Label>
                <div className="p-2 bg-secondary rounded-md">{selectedCompany?.founded || 'N/A'}</div>
                </div>
                <div>
                  <label>Projects</label>
                  <div className="p-2 bg-secondary rounded-md">{selectedCompany?.projects || 0}</div>
                </div>
              </div>
              {selectedCompany?.regions && selectedCompany.regions.length > 0 && (
                <div>
                  <Label>Regions</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedCompany.regions.join(', ')}</div>
                </div>
              )}
              {selectedCompany?.focus && (
                <div>
                  <Label>Focus Area</Label>
                  <div className="p-2 bg-secondary rounded-md">{selectedCompany.focus}</div>
                </div>
              )}
              {selectedCompany?.stock_symbol && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Stock Symbol</Label>
                    <div className="p-2 bg-secondary rounded-md uppercase">{selectedCompany.stock_symbol}</div>
                  </div>
                  <div>
                    <Label>Exchange</Label>
                    <div className="p-2 bg-secondary rounded-md uppercase">{selectedCompany.exchange || 'N/A'}</div>
                  </div>
                </div>
              )}
              {selectedCompany?.market_cap && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Market Cap</Label>
                    <div className="p-2 bg-secondary rounded-md">{selectedCompany.market_cap}</div>
                  </div>
                  <div>
                    <Label>Change</Label>
                    <div className="p-2 bg-secondary rounded-md">{selectedCompany.change ? `${selectedCompany.change}%` : 'N/A'}</div>
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
              <DialogTitle>Edit Company</DialogTitle>
              <DialogDescription>Update company information</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4">
              <Tabs defaultValue="basic">
                <TabsList>
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="financials">Financials</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-name">Company Name *</Label>
                      <Input
                        id="edit-name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-type">Company Type</Label>
                        <select
                          id="edit-type"
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                          className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        >
                          <option value="Junior">Junior</option>
                          <option value="Mid-Tier">Mid-Tier</option>
                          <option value="Major">Major</option>
                          <option value="Diversified Major">Diversified Major</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="edit-category">Category</Label>
                        <select
                          id="edit-category"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        >
                          <option value="Mining Services">Mining Services</option>
                          <option value="Engineering Firms">Engineering Firms</option>
                          <option value="Exploration Companies">Exploration Companies</option>
                          <option value="Equipment Suppliers">Equipment Suppliers</option>
                          <option value="Financial Services">Financial Services</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-phone">Phone</Label>
                        <Input
                          id="edit-phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-website">Website URL</Label>
                      <Input
                        id="edit-website"
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        placeholder="https://www.companyname.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-hq">Headquarters</Label>
                      <Input
                        id="edit-hq"
                        value={formData.hq}
                        onChange={(e) => setFormData({...formData, hq: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="edit-employees">Employees</Label>
                        <Input
                          id="edit-employees"
                          type="number"
                          value={formData.employees}
                          onChange={(e) => setFormData({...formData, employees: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-founded">Founded</Label>
                        <Input
                          id="edit-founded"
                          type="number"
                          value={formData.founded}
                          onChange={(e) => setFormData({...formData, founded: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-projects">Projects</Label>
                        <Input
                          id="edit-projects"
                          type="number"
                          value={formData.projects}
                          onChange={(e) => setFormData({...formData, projects: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-regions">Regions (comma-separated)</Label>
                      <Input
                        id="edit-regions"
                        value={formData.regions.join(', ')}
                        onChange={(e) => setFormData({...formData, regions: e.target.value.split(', ').filter(r => r)})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-focus">Focus Area</Label>
                      <Input
                        id="edit-focus"
                        value={formData.focus}
                        onChange={(e) => setFormData({...formData, focus: e.target.value})}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="financials">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-stock_symbol">Stock Symbol</Label>
                        <Input
                          id="edit-stock_symbol"
                          value={formData.stock_symbol}
                          onChange={(e) => setFormData({...formData, stock_symbol: e.target.value})}
                          className="uppercase"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-exchange">Exchange</Label>
                        <Input
                          id="edit-exchange"
                          value={formData.exchange}
                          onChange={(e) => setFormData({...formData, exchange: e.target.value})}
                          className="uppercase"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="edit-market_cap">Market Cap</Label>
                        <Input
                          id="edit-market_cap"
                          value={formData.market_cap}
                          onChange={(e) => setFormData({...formData, market_cap: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-market_cap_num">Market Cap (numeric)</Label>
                        <Input
                          id="edit-market_cap_num"
                          type="number"
                          value={formData.market_cap_num}
                          onChange={(e) => setFormData({...formData, market_cap_num: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-change">Change (%)</Label>
                        <Input
                          id="edit-change"
                          type="number"
                          step="0.01"
                          value={formData.change}
                          onChange={(e) => setFormData({...formData, change: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-initials">Initials</Label>
                      <Input
                        id="edit-initials"
                        value={formData.initials}
                        onChange={(e) => setFormData({...formData, initials: e.target.value})}
                        className="uppercase"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex gap-2 pt-4 border-t">
                <Button type="submit" className="gold-gradient text-black font-semibold">
                  Update Company
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
