import {
  LayoutDashboard,
  FileText,
  Building2,
  Newspaper,
  Video,
  Mic,
  Calendar,
  Image as ImageIcon,
  Megaphone,
  Settings,
  Users,
  Zap,
} from 'lucide-react';

export const adminNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Zap, label: 'Breaking News', href: '/admin/breaking-news' },
  { icon: Newspaper, label: 'News', href: '/admin/news' },
  { icon: FileText, label: 'Magazines', href: '/admin/magazines' },
  { icon: Building2, label: 'Companies', href: '/admin/companies' },
  { icon: Video, label: 'Videos', href: '/admin/videos' },
  { icon: Mic, label: 'Podcasts', href: '/admin/podcasts' },
  { icon: Calendar, label: 'Events', href: '/admin/events' },
  { icon: ImageIcon, label: 'Banners', href: '/admin/banners' },
  { icon: Megaphone, label: 'Advertisements', href: '/admin/ads' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];
