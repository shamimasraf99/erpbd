import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCompanySettings, CompanySettingsFormData } from '@/hooks/useCompanySettings';
import { Building2, Upload, Save, Loader2, Store, Phone, Mail, Globe, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Settings = () => {
  const { settings, isLoading, updateSettings, uploadLogo } = useCompanySettings();
  const [formData, setFormData] = useState<CompanySettingsFormData>({
    name: '',
    address: '',
    phone: '',
    email: '',
    logo_url: '',
    website: '',
    tax_number: '',
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || '',
        address: settings.address || '',
        phone: settings.phone || '',
        email: settings.email || '',
        logo_url: settings.logo_url || '',
        website: settings.website || '',
        tax_number: settings.tax_number || '',
      });
      setLogoPreview(settings.logo_url);
    }
  }, [settings]);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // প্রিভিউ দেখাই
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // আপলোড করি
    setUploading(true);
    const url = await uploadLogo(file);
    if (url) {
      setFormData(prev => ({ ...prev, logo_url: url }));
    }
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(formData);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-32 w-32 rounded-full mx-auto" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">কোম্পানি সেটিংস</h1>
            <p className="text-muted-foreground">আপনার ব্যবসার তথ্য পরিচালনা করুন</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                লোগো
              </CardTitle>
              <CardDescription>আপনার দোকান/কোম্পানির লোগো আপলোড করুন</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <div 
                  className="w-32 h-32 rounded-full bg-muted border-2 border-dashed border-muted-foreground/50 flex items-center justify-center overflow-hidden cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Company Logo" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      আপলোড হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      লোগো আপলোড করুন
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                মৌলিক তথ্য
              </CardTitle>
              <CardDescription>আপনার ব্যবসার মৌলিক তথ্য</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">দোকান/কোম্পানির নাম *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="আপনার দোকানের নাম"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tax_number" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    ট্যাক্স/TIN নম্বর
                  </Label>
                  <Input
                    id="tax_number"
                    value={formData.tax_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, tax_number: e.target.value }))}
                    placeholder="১২৩৪৫৬৭৮৯০"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">ঠিকানা</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="আপনার দোকানের সম্পূর্ণ ঠিকানা"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                যোগাযোগের তথ্য
              </CardTitle>
              <CardDescription>আপনার যোগাযোগের তথ্য</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    ফোন নম্বর
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="০১৭১২-৩৪৫৬৭৮"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    ইমেইল
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="info@example.com"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website" className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    ওয়েবসাইট
                  </Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              size="lg"
              disabled={updateSettings.isPending}
            >
              {updateSettings.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  সংরক্ষণ করুন
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
