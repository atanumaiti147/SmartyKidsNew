
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/lib/settings/settings-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Eye, EyeOff, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

function PasswordResetDialog({ triggerButton }: { triggerButton: React.ReactNode }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [resetSent, setResetSent] = useState(false);
    const auth = useAuth();
    const { dict } = useSettings();

    const handlePasswordReset = async () => {
        if (!email) {
            setError('Please enter your email address to reset your password.');
            return;
        }
        setError(null);
        setResetSent(false);
        try {
            await sendPasswordResetEmail(auth, email);
            setResetSent(true);
        } catch (e: any) {
            setError(e.message);
        }
    };
    
    return (
        <Dialog onOpenChange={() => { setError(null); setResetSent(false); setEmail(''); }}>
            <DialogTrigger asChild>
                {triggerButton}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Reset Your Password</DialogTitle>
                    <DialogDescription>
                        Enter your email address and we'll send you a link to get back into your account.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>{dict.login.errorTitle}</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    {resetSent && (
                       <Alert variant="default" className="border-green-500 bg-green-50 text-green-800">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertTitle>Password Reset Email Sent</AlertTitle>
                        <AlertDescription>Please check your inbox (and spam folder) for instructions to reset your password.</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                            id="reset-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={resetSent}
                        />
                    </div>
                </div>
                <DialogFooter className='sm:justify-between gap-2'>
                    <DialogClose asChild>
                         <Button type="button" variant="secondary">
                           Close
                         </Button>
                    </DialogClose>
                    <Button type="button" onClick={handlePasswordReset} disabled={resetSent}>
                        <Mail className="mr-2" /> Send Reset Link
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


function LoginTabs() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const router = useRouter();
  const { dict } = useSettings();

  const handleAuthAction = async (action: 'login' | 'signup') => {
    setError(null);
    if (action === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (!firstName || !lastName) {
        setError('Please enter your first and last name.');
        return;
      }
    }

    try {
      if (action === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, {
          displayName: `${firstName} ${lastName}`,
        });
        // The user document creation is now handled by the onAuthStateChanged listener in FirebaseProvider
      }
      router.push('/'); // Redirect to home page on success
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">{dict.login.loginTitle}</TabsTrigger>
        <TabsTrigger value="signup">{dict.login.signupTitle}</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>{dict.login.loginTitle}</CardTitle>
            <CardDescription>{dict.login.loginDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{dict.login.errorTitle}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="login-email">{dict.login.emailLabel}</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="craftyraj@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">{dict.login.passwordLabel}</Label>
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 h-full px-3 py-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button onClick={() => handleAuthAction('login')} className="w-full">
              {dict.login.loginButton}
            </Button>
             <PasswordResetDialog 
                triggerButton={
                    <Button variant="link" className="w-full text-black hover:text-zinc-700">Forgot Password?</Button>
                } 
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>{dict.login.signupTitle}</CardTitle>
            <CardDescription>{dict.login.signupDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{dict.login.errorTitle}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">{dict.login.firstNameLabel}</Label>
                <Input
                  id="first-name"
                  placeholder="Crafy"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">{dict.login.lastNameLabel}</Label>                <Input
                  id="last-name"
                  placeholder="Raj"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">{dict.login.emailLabel}</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="craftyraj@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">{dict.login.passwordLabel}</Label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                 <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 h-full px-3 py-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirm-password">{dict.login.confirmPasswordLabel}</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0 h-full px-3 py-2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button onClick={() => handleAuthAction('signup')} className="w-full">
              {dict.login.signupButton}
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}


export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full max-w-md">
      {isClient ? <LoginTabs /> : null}
    </div>
  );
}
