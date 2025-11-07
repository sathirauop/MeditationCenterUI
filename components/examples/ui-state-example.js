'use client';

import { useUIStore } from '@/lib/stores';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Menu, X, Globe } from 'lucide-react';

/**
 * Example component showing how to use Zustand for global UI state
 * Manages client-side state like mobile menu, language, modals
 */
export default function UIStateExample() {
  // Access global UI state and actions
  const {
    isMobileMenuOpen,
    toggleMobileMenu,
    language,
    setLanguage,
    activeModal,
    openModal,
    closeModal,
  } = useUIStore();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h2 className="text-3xl font-bold">UI State Management Example</h2>

      {/* Mobile Menu Toggle Example */}
      <Card>
        <CardHeader>
          <CardTitle>Mobile Menu State</CardTitle>
          <CardDescription>
            Toggle the mobile menu state (stored globally in Zustand)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button onClick={toggleMobileMenu} variant="outline">
              {isMobileMenuOpen ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Close Menu
                </>
              ) : (
                <>
                  <Menu className="mr-2 h-4 w-4" />
                  Open Menu
                </>
              )}
            </Button>
            <span className="text-muted-foreground">
              Menu is {isMobileMenuOpen ? 'open' : 'closed'}
            </span>
          </div>

          {isMobileMenuOpen && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-semibold">Mobile Menu Content</p>
              <p className="text-sm text-muted-foreground">
                This would show your navigation links
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Language Toggle Example */}
      <Card>
        <CardHeader>
          <CardTitle>Language Preference</CardTitle>
          <CardDescription>
            Switch between English and Sinhala
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setLanguage(language === 'en' ? 'si' : 'en')}
              variant="outline"
            >
              <Globe className="mr-2 h-4 w-4" />
              {language === 'en' ? 'Switch to සිංහල' : 'Switch to English'}
            </Button>
            <span className="text-muted-foreground">
              Current: {language === 'en' ? 'English' : 'සිංහල'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Modal State Example */}
      <Card>
        <CardHeader>
          <CardTitle>Modal Management</CardTitle>
          <CardDescription>
            Open and close modals using global state
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => openModal('booking')} size="sm">
              Open Booking Modal
            </Button>
            <Button onClick={() => openModal('contact')} size="sm">
              Open Contact Modal
            </Button>
            <Button onClick={() => openModal('donation')} size="sm">
              Open Donation Modal
            </Button>
          </div>

          {activeModal && (
            <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold">Modal: {activeModal}</p>
                <Button onClick={closeModal} variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                This is a simulated {activeModal} modal. In a real app, this would be a
                proper dialog component.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
