import type { LucideIcon } from 'lucide-react';
import {
  Sparkles,
  PenLine,
  GraduationCap,
  Info,
} from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
};

export const siteConfig = {
  name: 'LinguaLens AI',
  shortName: 'LinguaLens',
  tagline: 'Your AI writing coach for academic excellence',
  description:
    'LinguaLens AI teaches students how to improve their academic writing through mentor-style feedback, explaining the why behind every suggestion — instead of simply generating text for them.',
  url: 'https://lingualens.ai',
  author: 'LinguaLens AI',
  keywords: [
    'academic writing',
    'writing coach',
    'AI writing tutor',
    'university students',
    'research writing',
    'writing feedback',
    'academic integrity',
  ],
  nav: [
    {
      label: 'Home',
      href: '/',
      icon: Sparkles,
      description: 'Welcome and overview',
    },
    {
      label: 'Analyze',
      href: '/analyze',
      icon: PenLine,
      description: 'Get mentor-style feedback on your writing',
    },
    {
      label: 'Learning Hub',
      href: '/learning-hub',
      icon: GraduationCap,
      description: 'Guides, lessons, and writing resources',
    },
    {
      label: 'About',
      href: '/about',
      icon: Info,
      description: 'Our mission and academic integrity pledge',
    },
  ] satisfies NavItem[],
  footer: {
    description:
      'LinguaLens AI helps students grow as independent academic writers through mentor-style feedback — never by writing for them.',
    columns: [
      {
        title: 'Product',
        links: [
          { label: 'Analyze', href: '/analyze' },
          { label: 'Learning Hub', href: '/learning-hub' },
          { label: 'Home', href: '/' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
        ],
      },
    ],
  },
} as const;
