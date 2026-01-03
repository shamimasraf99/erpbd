import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, Lock, User, Loader2 } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("সঠিক ইমেইল দিন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "নাম কমপক্ষে ২ অক্ষর হতে হবে"),
  email: z.string().email("সঠিক ইমেইল দিন"),
  password: z.string().min(6, "পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"),
});

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = loginSchema.safeParse({ email: loginEmail, password: loginPassword });
    if (!result.success) {
      toast({
        title: "ভ্যালিডেশন এরর",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    setIsLoading(false);

    if (error) {
      let message = "লগইন করতে সমস্যা হয়েছে";
      if (error.message.includes("Invalid login credentials")) {
        message = "ইমেইল বা পাসওয়ার্ড সঠিক নয়";
      } else if (error.message.includes("Email not confirmed")) {
        message = "ইমেইল ভেরিফাই করা হয়নি";
      }
      toast({
        title: "লগইন ব্যর্থ",
        description: message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "সফল!",
        description: "সফলভাবে লগইন হয়েছে",
      });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = signupSchema.safeParse({ 
      fullName: signupName, 
      email: signupEmail, 
      password: signupPassword 
    });
    if (!result.success) {
      toast({
        title: "ভ্যালিডেশন এরর",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: {
          full_name: signupName,
        },
        emailRedirectTo: redirectUrl,
      },
    });

    setIsLoading(false);

    if (error) {
      let message = "অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে";
      if (error.message.includes("already registered")) {
        message = "এই ইমেইল দিয়ে আগে থেকেই অ্যাকাউন্ট আছে";
      }
      toast({
        title: "নিবন্ধন ব্যর্থ",
        description: message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "সফল!",
        description: "অ্যাকাউন্ট তৈরি হয়েছে। আপনি এখন লগইন করতে পারবেন।",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Building2 className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">বিজনেস ERP</h1>
            <p className="text-sm text-muted-foreground">ব্যবসা ব্যবস্থাপনা সিস্টেম</p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">স্বাগতম!</CardTitle>
            <CardDescription>আপনার অ্যাকাউন্টে লগইন করুন অথবা নতুন অ্যাকাউন্ট তৈরি করুন</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">লগইন</TabsTrigger>
                <TabsTrigger value="signup">নিবন্ধন</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">ইমেইল</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="আপনার ইমেইল"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-9 input-bangla"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">পাসওয়ার্ড</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="আপনার পাসওয়ার্ড"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-9 input-bangla"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full btn-gradient" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        অপেক্ষা করুন...
                      </>
                    ) : (
                      "লগইন করুন"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">পুরো নাম</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="আপনার নাম"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="pl-9 input-bangla"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">ইমেইল</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="আপনার ইমেইল"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="pl-9 input-bangla"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">পাসওয়ার্ড</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="নতুন পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="pl-9 input-bangla"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full btn-gradient" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        অপেক্ষা করুন...
                      </>
                    ) : (
                      "অ্যাকাউন্ট তৈরি করুন"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          © ২০২৫ বিজনেস ERP। সর্বস্বত্ব সংরক্ষিত।
        </p>
      </div>
    </div>
  );
}
