
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRight, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import GridBackground from '@/components/GridBackground';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await signUpWithEmail(email, password);
      if (!error) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden px-4">
      <Helmet>
        <title>Sign Up - MrPiglr</title>
        <meta name="description" content="Create a new account on MrPiglr." />
      </Helmet>

      {/* Background Effect */}
      <GridBackground />
      
      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl shadow-[0_0_50px_-10px_rgba(168,85,247,0.15)]"
      >
        {/* Header Icon */}
        <div className="mb-8 flex justify-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="p-4 rounded-full bg-black border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.4)] relative"
          >
            <div className="absolute inset-0 rounded-full border border-purple-500 animate-ping opacity-20"></div>
            <UserPlus className="w-8 h-8 text-purple-500" />
          </motion.div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-400 text-sm">
            Join the community and start your journey.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg shadow-purple-900/20 transition-all duration-200 mt-6"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign Up <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400 mb-4">Already have an account?</p>
            <Button asChild variant="outline" className="w-full border-purple-500/20 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50 hover:text-purple-300 transition-all">
              <Link to="/login">Sign In</Link>
            </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
