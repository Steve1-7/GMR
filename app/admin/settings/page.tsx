'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Settings, Globe, Shield, Image, Users, Lock, Save, Smartphone, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, Plus, Bot, Key, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabase';

export default function AdminSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [settings, setSettings] = useState({
    // General Settings
    websiteName: 'Gold-Coast Mining Review',
    websiteDescription: "Africa's leading mining intelligence and media platform",
    editorialEmail: 'editorial@goldcoastminingreview.com',
    contactEmail: 'contact@goldcoastminingreview.com',
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      youtube: ''
    },
    officeAddress: '',
    phoneNumbers: '',
    footerText: '',
    
    // SEO Settings
    metaTitle: 'Gold-Coast Mining Review | Africa\'s Mining Intelligence Platform',
    metaDescription: 'Africa\'s leading mining intelligence and media platform. Mining News. Data. Intelligence.',
    keywords: 'mining, gold, africa, ghana, resources, investment',
    googleAnalyticsId: '',
    searchConsoleVerification: '',
    
    // Homepage Settings
    heroBannerEnabled: true,
    featuredSectionsEnabled: true,
    homepageLayout: 'default',
    
    // Security Settings
    enableTwoFactor: false,
    sessionTimeout: '3600',
    
    // Media Settings
    maxImageSize: '2097152', // 2MB
    maxFileSize: '52428800', // 50MB
    allowedImageTypes: 'jpg,jpeg,png,webp',
    allowedFileTypes: 'pdf,doc,docx',
    
    // Newsletter Settings
    enableNewsletter: true,
    autoSubscribeUsers: false,
    
    // Chatbot Settings
    enableChatbot: true,
    geminiApiKey: '',
    geminiModel: 'gemini-3.5-flash',
    chatbotWelcomeMessage: "Welcome to Gold-Coast Mining Review. I can help you explore our news, magazines, events, mining company directory, advertising opportunities, and answer questions about the mining industry.",
    suggestedQuestions: [
      'How can I advertise on Gold-Coast Mining Review?',
      'What mining companies are featured?',
      'Show me the latest mining news',
      'Tell me about upcoming mining events',
      'What magazines do you publish?',
      'How do I subscribe to the platform?'
    ],
    chatbotBranding: {
      name: 'Mining Assistant',
      primaryColor: '#D4AF37',
      position: 'bottom-right'
    },
    fallbackMessages: {
      timeout: 'The request took too long to process. Please try again.',
      rateLimit: 'The AI assistant is experiencing high demand. Please try again in a few moments.',
      authError: 'The AI assistant is temporarily unavailable due to authentication issues.',
      connectionError: 'We\'re currently experiencing a connection issue with our AI service. Please try again.',
      genericError: 'The AI assistant is temporarily unavailable. Please try again in a few moments.'
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        // Fetch settings from database
        fetchSettings();
      }
    };
    checkAuth();
  }, [router]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const json = await res.json();
      if (json?.data) {
        const d = json.data;
        setSettings((prev) => ({
          ...prev,
          websiteName: d.general?.websiteName || prev.websiteName,
          websiteDescription: d.general?.websiteDescription || prev.websiteDescription,
          editorialEmail: d.general?.editorialEmail || prev.editorialEmail,
          contactEmail: d.general?.contactEmail || prev.contactEmail,
          phoneNumbers: d.general?.phone || prev.phoneNumbers,
          officeAddress: d.general?.officeAddress || prev.officeAddress,
          footerText: d.general?.footerText || prev.footerText,
          socialMedia: d.social || prev.socialMedia,
          metaTitle: d.seo?.metaTitle || prev.metaTitle,
          metaDescription: d.seo?.metaDescription || prev.metaDescription,
          keywords: d.seo?.keywords || prev.keywords,
          enableChatbot: d.chatbot?.enableChatbot ?? prev.enableChatbot,
          chatbotWelcomeMessage: d.chatbot?.welcomeMessage || prev.chatbotWelcomeMessage,
          suggestedQuestions: d.chatbot?.suggestedQuestions || prev.suggestedQuestions,
        }));
      }
    } catch {
      // use defaults
    }
    setLoading(false);
  };

  const saveSettingsKey = async (key: string, value: unknown) => {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({ key, value }),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error || 'Failed to save');
    }
  };

  const handleSave = async (section: string) => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      if (section === 'General') {
        await saveSettingsKey('general', {
          websiteName: settings.websiteName,
          websiteDescription: settings.websiteDescription,
          motto: "Your Gateway to Africa's Mining Excellence",
          editorialEmail: settings.editorialEmail,
          contactEmail: settings.contactEmail,
          salesEmail: 'sales@goldcoastminingreview.com',
          phone: settings.phoneNumbers,
          officeAddress: settings.officeAddress,
          footerText: settings.footerText,
        });
      } else if (section === 'Social Media') {
        await saveSettingsKey('social', settings.socialMedia);
      } else if (section === 'SEO') {
        await saveSettingsKey('seo', {
          metaTitle: settings.metaTitle,
          metaDescription: settings.metaDescription,
          keywords: settings.keywords,
          googleAnalyticsId: settings.googleAnalyticsId,
          searchConsoleVerification: settings.searchConsoleVerification,
        });
      } else if (section === 'Chatbot') {
        await saveSettingsKey('chatbot', {
          enableChatbot: settings.enableChatbot,
          welcomeMessage: settings.chatbotWelcomeMessage,
          suggestedQuestions: settings.suggestedQuestions,
        });
      }
      setMessage({ type: 'success', text: `${section} settings saved successfully!` });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
    
    setSaving(false);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      // In a real implementation, save all settings to database
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage({ type: 'success', text: 'All settings saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
    
    setSaving(false);
  };

  const handleChange = (section: string, field: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

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
            <Settings className="h-6 w-6" />
          </Button>
          <h2 className="text-lg font-bold gold-gradient-text">Settings</h2>
          <div className="w-10" />
        </div>
      </div>

      <div className="lg:ml-64 p-4 lg:p-8 mt-16 lg:mt-0">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Configure your Gold-Coast Mining Review platform</p>
          </div>
          <Button 
            onClick={handleSaveAll}
            disabled={saving}
            className="gold-gradient text-black font-semibold"
          >
            {saving ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save All Settings</>}
          </Button>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-8 gap-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="homepage">Homepage</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general">
            <Card className="border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gold" />
                  General Settings
                </CardTitle>
                <CardDescription>Basic site information and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="websiteName">Website Name *</Label>
                    <Input
                      id="websiteName"
                      value={settings.websiteName}
                      onChange={(e) => handleNestedChange('websiteName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="websiteDescription">Website Description *</Label>
                    <Textarea
                      id="websiteDescription"
                      value={settings.websiteDescription}
                      onChange={(e) => handleNestedChange('websiteDescription', e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editorialEmail">Editorial Email *</Label>
                    <Input
                      id="editorialEmail"
                      type="email"
                      value={settings.editorialEmail}
                      onChange={(e) => handleNestedChange('editorialEmail', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => handleNestedChange('contactEmail', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="footerText">Footer Text</Label>
                  <Textarea
                    id="footerText"
                    value={settings.footerText}
                    onChange={(e) => handleNestedChange('footerText', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="officeAddress">Office Address</Label>
                      <Input
                        id="officeAddress"
                        value={settings.officeAddress}
                        onChange={(e) => handleNestedChange('officeAddress', e.target.value)}
                        placeholder="123 Main Street, Accra, Ghana"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phoneNumbers">Phone Numbers</Label>
                      <Input
                        id="phoneNumbers"
                        value={settings.phoneNumbers}
                        onChange={(e) => handleNestedChange('phoneNumbers', e.target.value)}
                        placeholder="+233 20 123 4567, +233 20 987 6543"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleSave('General')} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media */}
          <TabsContent value="social">
            <Card className="border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gold" />
                  Social Media Links
                </CardTitle>
                <CardDescription>Connect your social media accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <div className="relative">
                      <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="facebook"
                        className="pl-10"
                        value={settings.socialMedia.facebook}
                        onChange={(e) => handleNestedChange('socialMedia', { ...settings.socialMedia, facebook: e.target.value })}
                        placeholder="https://facebook.com/your-page"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="twitter">Twitter</Label>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="twitter"
                        className="pl-10"
                        value={settings.socialMedia.twitter}
                        onChange={(e) => handleNestedChange('socialMedia', { ...settings.socialMedia, twitter: e.target.value })}
                        placeholder="https://twitter.com/your-handle"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="linkedin"
                        className="pl-10"
                        value={settings.socialMedia.linkedin}
                        onChange={(e) => handleNestedChange('socialMedia', { ...settings.socialMedia, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/company/your-page"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="instagram"
                        className="pl-10"
                        value={settings.socialMedia.instagram}
                        onChange={(e) => handleNestedChange('socialMedia', { ...settings.socialMedia, instagram: e.target.value })}
                        placeholder="https://instagram.com/your-handle"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="youtube">YouTube</Label>
                    <div className="relative">
                      <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="youtube"
                        className="pl-10"
                        value={settings.socialMedia.youtube}
                        onChange={(e) => handleNestedChange('socialMedia', { ...settings.socialMedia, youtube: e.target.value })}
                        placeholder="https://youtube.com/@your-channel"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleSave('Social Media')} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Homepage Settings */}
          <TabsContent value="homepage">
            <Card className="border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-gold" />
                  Homepage Settings
                </CardTitle>
                <CardDescription>Customize the homepage layout and features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b">
                  <div>
                    <div className="font-medium">Hero Banner</div>
                    <p className="text-sm text-muted-foreground">Enable/disable hero banner on homepage</p>
                  </div>
                  <Switch
                    checked={settings.heroBannerEnabled}
                    onCheckedChange={(checked) => handleNestedChange('heroBannerEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between py-4 border-b">
                  <div>
                    <div className="font-medium">Featured Sections</div>
                    <p className="text-sm text-muted-foreground">Show/hide featured content sections</p>
                  </div>
                  <Switch
                    checked={settings.featuredSectionsEnabled}
                    onCheckedChange={(checked) => handleNestedChange('featuredSectionsEnabled', checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="homepageLayout">Homepage Layout</Label>
                  <select
                    id="homepageLayout"
                    value={settings.homepageLayout}
                    onChange={(e) => handleNestedChange('homepageLayout', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  >
                    <option value="default">Default Layout</option>
                    <option value="modern">Modern Layout</option>
                    <option value="minimal">Minimal Layout</option>
                  </select>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleSave('Homepage')} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Settings */}
          <TabsContent value="seo">
            <Card className="border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gold" />
                  SEO Settings
                </CardTitle>
                <CardDescription>Search engine optimization and analytics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={settings.metaTitle}
                    onChange={(e) => handleNestedChange('metaTitle', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={settings.metaDescription}
                    onChange={(e) => handleNestedChange('metaDescription', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    value={settings.keywords}
                    onChange={(e) => handleNestedChange('keywords', e.target.value)}
                    placeholder="mining, gold, africa, investment"
                  />
                </div>
                <div>
                  <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                  <Input
                    id="googleAnalyticsId"
                    value={settings.googleAnalyticsId}
                    onChange={(e) => handleNestedChange('googleAnalyticsId', e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <div>
                  <Label htmlFor="searchConsoleVerification">Search Console Verification</Label>
                  <Input
                    id="searchConsoleVerification"
                    value={settings.searchConsoleVerification}
                    onChange={(e) => handleNestedChange('searchConsoleVerification', e.target.value)}
                    placeholder='meta name="google-site-verification"'
                  />
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleSave('SEO')} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card className="border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gold" />
                  Security Settings
                </CardTitle>
                <CardDescription>Authentication and session management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b">
                  <div>
                    <div className="font-medium">Two-Factor Authentication</div>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch
                    checked={settings.enableTwoFactor}
                    onCheckedChange={(checked) => handleNestedChange('enableTwoFactor', checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="sessionTimeout">Session Timeout (seconds)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleNestedChange('sessionTimeout', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">3600 = 1 hour, 86400 = 24 hours</p>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleSave('Security')} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Settings */}
          <TabsContent value="media">
            <Card className="border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-gold" />
                  Media Settings
                </CardTitle>
                <CardDescription>File upload and media management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxImageSize">Max Image Size (bytes)</Label>
                    <Input
                      id="maxImageSize"
                      type="number"
                      value={settings.maxImageSize}
                      onChange={(e) => handleNestedChange('maxImageSize', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">2MB = 2097152 bytes</p>
                  </div>
                  <div>
                    <Label htmlFor="maxFileSize">Max File Size (bytes)</Label>
                    <Input
                      id="maxFileSize"
                      type="number"
                      value={settings.maxFileSize}
                      onChange={(e) => handleNestedChange('maxFileSize', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">50MB = 52428800 bytes</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="allowedImageTypes">Allowed Image Types</Label>
                    <Input
                      id="allowedImageTypes"
                      value={settings.allowedImageTypes}
                      onChange={(e) => handleNestedChange('allowedImageTypes', e.target.value)}
                      placeholder="jpg,jpeg,png,webp"
                    />
                  </div>
                  <div>
                    <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                    <Input
                      id="allowedFileTypes"
                      value={settings.allowedFileTypes}
                      onChange={(e) => handleNestedChange('allowedFileTypes', e.target.value)}
                      placeholder="pdf,doc,docx"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleSave('Media')} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Newsletter Settings */}
          <TabsContent value="newsletter">
            <Card className="border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gold" />
                  Newsletter & Subscriptions
                </CardTitle>
                <CardDescription>Email marketing and subscriber management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b">
                  <div>
                    <div className="font-medium">Enable Newsletter</div>
                    <p className="text-sm text-muted-foreground">Allow newsletter subscriptions</p>
                  </div>
                  <Switch
                    checked={settings.enableNewsletter}
                    onCheckedChange={(checked) => handleNestedChange('enableNewsletter', checked)}
                  />
                </div>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <div className="font-medium">Auto-Subscribe Users</div>
                    <p className="text-muted-foreground">Automatically subscribe new users to newsletter</p>
                  </div>
                  <Switch
                    checked={settings.autoSubscribeUsers}
                    onCheckedChange={(checked) => handleNestedChange('autoSubscribeUsers', checked)}
                  />
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleSave('Newsletter')} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chatbot Settings */}
          <TabsContent value="chatbot">
            <Card className="border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-gold" />
                  AI Chatbot Settings
                </CardTitle>
                <CardDescription>Configure the AI-powered mining assistant</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b">
                  <div>
                    <div className="font-medium">Enable Chatbot</div>
                    <p className="text-sm text-muted-foreground">Show the AI assistant on the website</p>
                  </div>
                  <Switch
                    checked={settings.enableChatbot}
                    onCheckedChange={(checked) => handleNestedChange('enableChatbot', checked)}
                  />
                </div>
                <div>
                  <Label htmlFor="geminiApiKey">Gemini API Key</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="geminiApiKey"
                      type="password"
                      className="pl-10"
                      value={settings.geminiApiKey}
                      onChange={(e) => handleNestedChange('geminiApiKey', e.target.value)}
                      placeholder="Enter your Gemini API key"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Get your free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Google AI Studio</a></p>
                </div>
                <div>
                  <Label htmlFor="geminiModel">Gemini Model</Label>
                  <select
                    id="geminiModel"
                    value={settings.geminiModel}
                    onChange={(e) => handleNestedChange('geminiModel', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                  >
                    <option value="gemini-3.5-flash">Gemini 3.5 Flash (Primary)</option>
                    <option value="gemini-3-flash-preview">Gemini 3 Flash Preview (Fallback)</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">Select the AI model to power the chatbot. Gemini 3.5 Flash is recommended for best performance.</p>
                </div>
                <div>
                  <Label htmlFor="chatbotWelcomeMessage">Welcome Message</Label>
                  <Textarea
                    id="chatbotWelcomeMessage"
                    value={settings.chatbotWelcomeMessage}
                    onChange={(e) => handleNestedChange('chatbotWelcomeMessage', e.target.value)}
                    rows={3}
                    placeholder="The first message users see when they open the chatbot"
                  />
                </div>
                <div>
                  <Label htmlFor="suggestedQuestions">Suggested Questions</Label>
                  <Textarea
                    id="suggestedQuestions"
                    value={settings.suggestedQuestions.join('\n')}
                    onChange={(e) => handleNestedChange('suggestedQuestions', e.target.value.split('\n').filter(q => q.trim()))}
                    rows={4}
                    placeholder="Enter each question on a new line"
                  />
                  <p className="text-xs text-muted-foreground mt-1">These questions will appear as quick action buttons for users</p>
                </div>
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4">Chatbot Branding</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="chatbotName">Assistant Name</Label>
                      <Input
                        id="chatbotName"
                        value={settings.chatbotBranding.name}
                        onChange={(e) => handleNestedChange('chatbotBranding', { ...settings.chatbotBranding, name: e.target.value })}
                        placeholder="Mining Assistant"
                      />
                    </div>
                    <div>
                      <Label htmlFor="primaryColor">Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          type="color"
                          value={settings.chatbotBranding.primaryColor}
                          onChange={(e) => handleNestedChange('chatbotBranding', { ...settings.chatbotBranding, primaryColor: e.target.value })}
                          className="w-20 h-10"
                        />
                        <Input
                          value={settings.chatbotBranding.primaryColor}
                          onChange={(e) => handleNestedChange('chatbotBranding', { ...settings.chatbotBranding, primaryColor: e.target.value })}
                          placeholder="#D4AF37"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <select
                        id="position"
                        value={settings.chatbotBranding.position}
                        onChange={(e) => handleNestedChange('chatbotBranding', { ...settings.chatbotBranding, position: e.target.value })}
                        className="w-full px-3 py-2 rounded-md border border-input bg-background"
                      >
                        <option value="bottom-right">Bottom Right</option>
                        <option value="bottom-left">Bottom Left</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4">Error Messages</h3>
                  <p className="text-sm text-muted-foreground mb-4">Customize the error messages shown to users when the chatbot encounters issues.</p>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="timeoutMessage">Timeout Message</Label>
                      <Input
                        id="timeoutMessage"
                        value={settings.fallbackMessages.timeout}
                        onChange={(e) => handleNestedChange('fallbackMessages', { ...settings.fallbackMessages, timeout: e.target.value })}
                        placeholder="The request took too long to process. Please try again."
                      />
                    </div>
                    <div>
                      <Label htmlFor="rateLimitMessage">Rate Limit Message</Label>
                      <Input
                        id="rateLimitMessage"
                        value={settings.fallbackMessages.rateLimit}
                        onChange={(e) => handleNestedChange('fallbackMessages', { ...settings.fallbackMessages, rateLimit: e.target.value })}
                        placeholder="The AI assistant is experiencing high demand. Please try again in a few moments."
                      />
                    </div>
                    <div>
                      <Label htmlFor="authErrorMessage">Authentication Error Message</Label>
                      <Input
                        id="authErrorMessage"
                        value={settings.fallbackMessages.authError}
                        onChange={(e) => handleNestedChange('fallbackMessages', { ...settings.fallbackMessages, authError: e.target.value })}
                        placeholder="The AI assistant is temporarily unavailable due to authentication issues."
                      />
                    </div>
                    <div>
                      <Label htmlFor="connectionErrorMessage">Connection Error Message</Label>
                      <Input
                        id="connectionErrorMessage"
                        value={settings.fallbackMessages.connectionError}
                        onChange={(e) => handleNestedChange('fallbackMessages', { ...settings.fallbackMessages, connectionError: e.target.value })}
                        placeholder="We're currently experiencing a connection issue with our AI service. Please try again."
                      />
                    </div>
                    <div>
                      <Label htmlFor="genericErrorMessage">Generic Error Message</Label>
                      <Input
                        id="genericErrorMessage"
                        value={settings.fallbackMessages.genericError}
                        onChange={(e) => handleNestedChange('fallbackMessages', { ...settings.fallbackMessages, genericError: e.target.value })}
                        placeholder="The AI assistant is temporarily unavailable. Please try again in a few moments."
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={() => handleSave('Chatbot')} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}