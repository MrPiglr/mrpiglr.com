
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Lock, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import GridBackground from '@/components/GridBackground';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  
  const { signInWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const getOrbColor1 = () => {
    if (theme === 'cyberpunk') return 'bg-[#FF006E]/20';
    if (theme === 'matrix') return 'bg-[#00FF00]/20';
    return 'bg-purple-900/20';
  };

  const getOrbColor2 = () => {
    if (theme === 'cyberpunk') return 'bg-[#00FFD7]/20';
    if (theme === 'matrix') return 'bg-[#39FF14]/20';
    return 'bg-purple-600/20';
  };

  const getIconColor = () => {
    if (theme === 'cyberpunk') return 'text-[#FF006E]';
    if (theme === 'matrix') return 'text-[#00FF00]';
    return 'text-purple-500';
  };

  const getIconBorderClass = () => {
    if (theme === 'cyberpunk') return 'bg-black border border-[#FF006E]/50 shadow-[0_0_30px_rgba(255,0,110,0.4)]';
    if (theme === 'matrix') return 'bg-black border border-[#00FF00]/50 shadow-[0_0_30px_rgba(0,255,0,0.4)]';
    return 'bg-black border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.4)]';
  };

  const getIconGlowClass = () => {
    if (theme === 'cyberpunk') return 'border border-[#FF006E] animate-ping opacity-20';
    if (theme === 'matrix') return 'border border-[#00FF00] animate-ping opacity-20';
    return 'border border-purple-500 animate-ping opacity-20';
  };

  const getForgotPasswordColor = () => {
    if (theme === 'cyberpunk') return 'text-[#FF006E] hover:text-[#FF0080]';
    if (theme === 'matrix') return 'text-[#00FF00] hover:text-[#39FF14]';
    return 'text-purple-400 hover:text-purple-300';
  };

  const getInputFocusClass = () => {
    if (theme === 'cyberpunk') return 'focus:border-[#FF006E] focus:ring-[#FF006E]/20';
    if (theme === 'matrix') return 'focus:border-[#00FF00] focus:ring-[#00FF00]/20';
    return 'focus:border-purple-500 focus:ring-purple-500/20';
  };

  const getSubmitButtonClass = () => {
    if (theme === 'cyberpunk') return 'bg-[#FF006E] hover:bg-[#FF0080] shadow-lg shadow-[#FF006E]/20';
    if (theme === 'matrix') return 'bg-[#00FF00] hover:bg-[#39FF14] text-[#001a00] shadow-lg shadow-[#00FF00]/20';
    return 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/20';
  };

  const getSignupButtonClass = () => {
    if (theme === 'cyberpunk') return 'border-[#FF006E]/20 text-[#FF006E] hover:bg-[#FF006E]/10 hover:border-[#FF006E]/50 hover:text-[#FF0080]';
    if (theme === 'matrix') return 'border-[#00FF00]/20 text-[#00FF00] hover:bg-[#00FF00]/10 hover:border-[#00FF00]/50 hover:text-[#39FF14]';
    return 'border-purple-500/20 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50 hover:text-purple-300';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await signInWithEmail(email, password);
      if (!error) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden px-4">
      <Helmet>
        <title>Login - MrPiglr</title>
        <meta name="description" content="Login to MrPiglr using your email and password." />
      </Helmet>

      {/* Background Effect */}
      <GridBackground />
      
      {/* Decorative gradient orbs */}
      <div className={`absolute top-1/4 left-1/4 w-64 h-64 ${getOrbColor1()} rounded-full blur-[100px] pointer-events-none`} />
      <div className={`absolute bottom-1/4 right-1/4 w-64 h-64 ${getOrbColor2()} rounded-full blur-[100px] pointer-events-none`} />

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
            className={`p-4 rounded-full ${getIconBorderClass()} relative`}
          >
            <div className={`absolute inset-0 rounded-full ${getIconGlowClass()}`}></div>
            <ShieldCheck className={`w-8 h-8 ${getIconColor()}`} />
          </motion.div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm">
            Sign in to access your dashboard and account.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${getInputFocusClass()}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className={`text-xs ${getForgotPasswordColor()} transition-colors`}>
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className={`pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 ${getInputFocusClass()}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className={`w-full h-11 ${getSubmitButtonClass()} text-white font-semibold rounded-lg transition-all duration-200 mt-6`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <span className="flex items-center justify-center gap-2">
                Sign In <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400 mb-4">Don't have an account?</p>
            <Button asChild variant="outline" className={`w-full ${getSignupButtonClass()} transition-all`}>
    </div>
  );
};

export default LoginPage;
