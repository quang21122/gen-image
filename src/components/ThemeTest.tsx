import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedLoading } from '@/components/ui/enhanced-loading';
import { Sun, Moon, Monitor, Palette, Eye, Contrast } from 'lucide-react';

export const ThemeTest: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="p-6 space-y-8">
      {/* Theme Controls */}
      <GlassCard variant="elevated" className="p-6">
        <h2 className="text-2xl font-bold gradient-text mb-4">Theme Testing Panel</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            onClick={() => setTheme('light')}
            className="flex items-center space-x-2"
          >
            <Sun className="h-4 w-4" />
            <span>Light Mode</span>
          </Button>
          
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            onClick={() => setTheme('dark')}
            className="flex items-center space-x-2"
          >
            <Moon className="h-4 w-4" />
            <span>Dark Mode</span>
          </Button>
          
          <Button
            variant={theme === 'system' ? 'default' : 'outline'}
            onClick={() => setTheme('system')}
            className="flex items-center space-x-2"
          >
            <Monitor className="h-4 w-4" />
            <span>System</span>
          </Button>
        </div>
        
        <div className="text-sm text-secondary-600 dark:text-secondary-400">
          Current: <span className="font-semibold">{theme}</span> 
          {theme === 'system' && (
            <span> (Resolved: <span className="font-semibold">{resolvedTheme}</span>)</span>
          )}
        </div>
      </GlassCard>

      {/* Color Palette Test */}
      <GlassCard variant="default" className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Palette className="h-5 w-5" />
          <span>Color Palette</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="w-full h-12 bg-primary-500 rounded-lg"></div>
            <p className="text-xs text-center">Primary</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-12 bg-accent-500 rounded-lg"></div>
            <p className="text-xs text-center">Accent</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-12 bg-secondary-500 rounded-lg"></div>
            <p className="text-xs text-center">Secondary</p>
          </div>
          <div className="space-y-2">
            <div className="w-full h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg"></div>
            <p className="text-xs text-center">Gradient</p>
          </div>
        </div>
      </GlassCard>

      {/* Typography Test */}
      <GlassCard variant="bordered" className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Eye className="h-5 w-5" />
          <span>Typography</span>
        </h3>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold gradient-text">Gradient Heading</h1>
          <h2 className="text-2xl font-semibold text-primary">Primary Text</h2>
          <p className="text-secondary">Secondary text with proper contrast</p>
          <p className="text-tertiary">Tertiary text for subtle information</p>
          <p className="text-sm text-muted">Muted text for less important content</p>
        </div>
      </GlassCard>

      {/* Button Variants Test */}
      <GlassCard variant="elevated" className="p-6">
        <h3 className="text-xl font-semibold mb-4">Button Variants</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="gradient">Gradient</Button>
        </div>
      </GlassCard>

      {/* Loading States Test */}
      <GlassCard variant="default" className="p-6">
        <h3 className="text-xl font-semibold mb-4">Loading States</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <EnhancedLoading variant="spinner" size="md" />
            <p className="text-xs">Spinner</p>
          </div>
          <div className="text-center space-y-2">
            <EnhancedLoading variant="dots" size="md" />
            <p className="text-xs">Dots</p>
          </div>
          <div className="text-center space-y-2">
            <EnhancedLoading variant="pulse" size="md" />
            <p className="text-xs">Pulse</p>
          </div>
          <div className="text-center space-y-2">
            <EnhancedLoading variant="cosmic" size="md" />
            <p className="text-xs">Cosmic</p>
          </div>
        </div>
      </GlassCard>

      {/* Glass Morphism Test */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard variant="default" className="p-4">
          <h4 className="font-semibold mb-2">Default Glass</h4>
          <p className="text-sm text-secondary">Standard glass morphism effect</p>
        </GlassCard>
        
        <GlassCard variant="elevated" className="p-4">
          <h4 className="font-semibold mb-2">Elevated Glass</h4>
          <p className="text-sm text-secondary">Enhanced glass with more blur</p>
        </GlassCard>
        
        <GlassCard variant="bordered" className="p-4">
          <h4 className="font-semibold mb-2">Bordered Glass</h4>
          <p className="text-sm text-secondary">Glass with prominent border</p>
        </GlassCard>
      </div>

      {/* Accessibility Info */}
      <GlassCard variant="elevated" className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Contrast className="h-5 w-5" />
          <span>Accessibility</span>
        </h3>
        
        <div className="space-y-2 text-sm">
          <p>✅ Respects system color scheme preference</p>
          <p>✅ Smooth transitions between themes</p>
          <p>✅ WCAG contrast guidelines maintained</p>
          <p>✅ Reduced motion support</p>
          <p>✅ Keyboard navigation friendly</p>
          <p>✅ Screen reader compatible</p>
        </div>
      </GlassCard>
    </div>
  );
};
