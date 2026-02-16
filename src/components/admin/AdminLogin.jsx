import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { useToast } from '@/components/ui/use-toast';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Loader2, KeyRound } from 'lucide-react';
    
    const AdminLogin = ({ onSuccess }) => {
      const navigate = useNavigate();
      const { signIn } = useAuth();
      const { toast } = useToast();
    
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [isLoading, setIsLoading] = useState(false);
    
      const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { error } = await signIn(email, password);
        setIsLoading(false);
    
        if (!error) {
          toast({
            title: 'Login Successful',
            description: 'Bypassing site status. Welcome, Admin.',
          });
          if (onSuccess) {
            onSuccess();
          } else {
            navigate('/admin');
          }
        }
      };
    
      return (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="mr-2 h-4 w-4" />
            )}
            Authenticate & Bypass
          </Button>
        </form>
      );
    };
    
    export default AdminLogin;