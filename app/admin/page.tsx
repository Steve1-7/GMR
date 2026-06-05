'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BarChart3,
  Users,
  LogOut,
  Menu,
  X,
  FileText,
  Newspaper,
  Building2,
  Megaphone,
} from 'lucide-react';
import { adminNavItems } from '@/lib/admin-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/shared/motion';
import { supabase } from '@/lib/supabase';

const STAT_ICONS = [BarChart3, Users, FileText, Megaphone];

export default function AdminDashboard() {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        setUser(session.user);
        setLoading(false);
        fetchDashboardData();
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/admin/login');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, articlesRes] = await Promise.all([
        fetch('/api/stats'),
        supabase.from('articles').select('title, created_at').order('created_at', { ascending: false }).limit(3),
      ]);
      const statsJson = await statsRes.json();
      if (statsJson?.data?.counts) setCounts(statsJson.data.counts);
      if (articlesRes.data) setRecentArticles(articlesRes.data);
    } catch {
      // dashboard shows empty states
    }
  };

  const dashboardStats = [
    { label: 'Published Articles', value: counts.articles?.toString() || '0', icon: BarChart3 },
    { label: 'Newsletter Subscribers', value: counts.newsletter_subscribers?.toString() || '0', icon: Users },
    { label: 'Magazines', value: counts.magazines?.toString() || '0', icon: FileText },
    { label: 'Active Ads', value: counts.advertisements?.toString() || '0', icon: Megaphone },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border/40 p-4">
        <div className="flex items-center justify-between">
          <Button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="ghost"
            size="icon"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <h2 className="text-lg font-bold gold-gradient-text">Admin Dashboard</h2>
          <div className="w-10" />
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 border-r border-border/40 bg-card/50 backdrop-blur transition-transform duration-300 z-40 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <h2 className="text-xl font-bold gold-gradient-text mb-1">Admin Dashboard</h2>
          <p className="text-xs text-muted-foreground">Gold-Coast Mining Review</p>
        </div>
        
        <nav className="px-4 space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  setActiveItem(item.label);
                  setSidebarOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${
                  activeItem === item.label
                    ? 'bg-gold/10 text-gold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>
                {counts && item.label === 'News' && counts.articles > 0 && (
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">{counts.articles}</span>
                )}
                {counts && item.label === 'Breaking News' && counts.breaking_news > 0 && (
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">{counts.breaking_news}</span>
                )}
                {counts && item.label === 'Magazines' && counts.magazines > 0 && (
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">{counts.magazines}</span>
                )}
                {counts && item.label === 'Companies' && counts.companies > 0 && (
                  <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">{counts.companies}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/40">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-4 lg:p-8 mt-16 lg:mt-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <FadeIn key={stat.label} delay={i * 0.1}>
                <Card className="border-border/40 bg-card/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                    <Icon className="h-4 w-4 text-gold" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FadeIn delay={0.4}>
            <Card className="border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/admin/breaking-news">
                  <Button className="w-full justify-start" variant="outline">
                    <Newspaper className="mr-2 h-4 w-4" />
                    Manage Breaking News
                  </Button>
                </Link>
                <Link href="/admin/magazines">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Upload New Magazine
                  </Button>
                </Link>
                <Link href="/admin/news">
                  <Button className="w-full justify-start" variant="outline">
                    <Newspaper className="mr-2 h-4 w-4" />
                    Publish News Article
                  </Button>
                </Link>
                <Link href="/admin/companies">
                  <Button className="w-full justify-start" variant="outline">
                    <Building2 className="mr-2 h-4 w-4" />
                    Add Company Listing
                  </Button>
                </Link>
                <Link href="/admin/ads">
                  <Button className="w-full justify-start" variant="outline">
                    <Megaphone className="mr-2 h-4 w-4" />
                    Create Advertisement
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.5}>
            <Card className="border-border/40 bg-card/50">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest content updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentArticles.length > 0 ? recentArticles.map((article) => (
                  <div key={article.title} className="flex items-center gap-3 text-sm">
                    <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Newspaper className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium truncate">{article.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {article.created_at ? new Date(article.created_at).toLocaleString() : ''}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">No recent activity. Create content to see updates here.</p>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Content Overview */}
        <FadeIn delay={0.6}>
          <Card className="border-border/40 bg-card/50">
            <CardHeader>
              <CardTitle>Content Overview</CardTitle>
              <CardDescription>Summary of all published content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Published Articles', key: 'articles' },
                  { name: 'Magazines', key: 'magazines' },
                  { name: 'Company Listings', key: 'companies' },
                  { name: 'Events', key: 'events' },
                  { name: 'Breaking News', key: 'breaking_news' },
                  { name: 'Advertisements', key: 'advertisements' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                    <span className="text-sm font-medium">{counts[item.key] || 0} total</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
