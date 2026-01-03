import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Camera, User, Phone, Mail, Save } from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  designation: string | null;
  department: string | null;
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || "",
          phone: data.phone || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "ত্রুটি",
        description: "প্রোফাইল লোড করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...formData } : null);
      toast({
        title: "সফল",
        description: "প্রোফাইল আপডেট করা হয়েছে।",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "ত্রুটি",
        description: "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "ত্রুটি",
        description: "শুধুমাত্র ছবি ফাইল আপলোড করা যাবে।",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "ত্রুটি",
        description: "ছবির সাইজ ২MB এর বেশি হতে পারবে না।",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      toast({
        title: "সফল",
        description: "প্রোফাইল ছবি আপডেট করা হয়েছে।",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "ত্রুটি",
        description: "ছবি আপলোড করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">প্রোফাইল সেটিংস</h1>
        <p className="text-muted-foreground">আপনার প্রোফাইল তথ্য আপডেট করুন।</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Avatar Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>প্রোফাইল ছবি</CardTitle>
            <CardDescription>আপনার প্রোফাইল ছবি আপডেট করুন।</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {getInitials(profile?.full_name)}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full shadow-md"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <div className="text-center">
              <p className="font-medium">{profile?.full_name || "নাম নেই"}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Info Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>ব্যক্তিগত তথ্য</CardTitle>
            <CardDescription>আপনার নাম এবং যোগাযোগের তথ্য আপডেট করুন।</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  পূর্ণ নাম
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  className="input-bangla"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  ইমেইল
                </Label>
                <Input
                  id="email"
                  value={profile?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">ইমেইল পরিবর্তন করা যাবে না।</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  ফোন নম্বর
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="01XXXXXXXXX"
                  className="input-bangla"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">পদবী</Label>
                <Input
                  value={profile?.designation || "নির্ধারিত নয়"}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    সংরক্ষণ হচ্ছে...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    পরিবর্তন সংরক্ষণ করুন
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
