import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User as UserIcon, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          throw new Error('Please enter your full name');
        }
        await signUp(email, password, fullName);
      } else {
        await signIn(email, password);
      }
      
      setAuthSuccess(true);
      setTimeout(() => {
        setAuthSuccess(false);
        setIsSubmitting(false);
        onSuccess?.();
        onClose();
        // Clear fields
        setEmail('');
        setPassword('');
        setFullName('');
      }, 1500);

    } catch (err: any) {
      if (err && (err.code === 'auth/operation-not-allowed' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password')) {
        console.warn("Expected authentication condition:", err.code || err);
      } else {
        console.error(err);
      }
      let errMsg = 'Authentication failed. Please check details.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errMsg = 'Invalid email or password combination.';
      } else if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This email is already registered.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errMsg = 'Email/Password authentication provider is not enabled in your Firebase project. Please go to your Firebase Console under Authentication > Sign-in method and enable the "Email/Password" sign-in provider.';
      } else if (err.message) {
        errMsg = err.message;
      }
      setErrorMsg(errMsg);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Mask */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      {/* Main Authentication Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -15 }}
        className="relative w-full max-w-md bg-slate-900/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 p-6 md:p-8"
        id="auth-modal-panel"
      >
        {/* Glow Element */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all focus:outline-none"
          title="Close Authentication Dialog"
          id="auth-modal-close-btn"
        >
          <X className="h-4 w-4" />
        </button>

        {authSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center flex flex-col items-center justify-center"
          >
            <div className="h-16 w-16 rounded-full bg-emerald-500/15 text-accent border border-emerald-500/20 flex items-center justify-center mb-5 animate-bounce">
              <CheckCircle2 className="h-8 w-8 text-accent mr-0" />
            </div>
            <h3 className="font-display font-medium text-xl text-white">
              {isSignUp ? 'Registration Successful!' : 'Welcome Back!'}
            </h3>
            <p className="text-gray-400 font-mono text-xs mt-2">
              Syncing credentials to Phagwara Database...
            </p>
          </motion.div>
        ) : (
          <div>
            {/* Heading Header */}
            <div className="mb-6 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 mb-3">
                <Sparkles className="h-3 w-3 text-accent" />
                <span className="font-mono text-[9px] tracking-wider text-accent uppercase font-bold">
                  Phagwara Renters Portal
                </span>
              </div>
              <h3 className="font-display font-extrabold text-2xl text-white leading-none">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h3>
              <p className="text-gray-400 text-xs mt-2 leading-relaxed">
                {isSignUp 
                  ? 'Sign up to unlock persistent bookmarks, map schedules, and direct hostel landlord details.' 
                  : 'Access your saved list and schedule on-premises inspection walks instantly.'}
              </p>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-start gap-2.5 mb-4 text-xs text-rose-200"
                  id="auth-error-banner"
                >
                  <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name (Sign Up only) */}
              <AnimatePresence>
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col overflow-hidden"
                  >
                    <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                      <input
                        type="text"
                        name="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ashish Mahto"
                        className="bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-accent w-full"
                        disabled={isSubmitting}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Input */}
              <div className="flex flex-col">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@lpu.co.in"
                    className="bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-accent w-full"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col">
                <label className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 font-semibold">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-500" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-accent w-full"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 mt-2 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary/90 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 select-none shadow-lg shadow-primary/25 cursor-pointer"
                id="auth-submit-btn"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 rounded-full border-2 border-white/10 border-t-white animate-spin" />
                ) : (
                  <span>{isSignUp ? 'Create Free Account' : 'Sign In securely'}</span>
                )}
              </button>
            </form>

            {/* Change auth mode selector toggle */}
            <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-gray-400">
              {isSignUp ? (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => { setIsSignUp(false); setErrorMsg(null); }}
                    className="text-accent underline font-semibold focus:outline-none ml-1 cursor-pointer"
                  >
                    Click to Sign In
                  </button>
                </p>
              ) : (
                <p>
                  First-year visitor near Law Gate?{' '}
                  <button
                    onClick={() => { setIsSignUp(true); setErrorMsg(null); }}
                    className="text-accent underline font-semibold focus:outline-none ml-1 cursor-pointer"
                  >
                    Create and Register Account
                  </button>
                </p>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
