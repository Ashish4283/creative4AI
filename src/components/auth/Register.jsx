import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { register, login } = useAuth(); // Import from context

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toast({ title: "Error", description: "Please fill all fields.", variant: "destructive" });
            return;
        }

        if (password !== confirmPassword) {
            toast({ title: "Error", description: "Passwords don't match", variant: "destructive" });
            return;
        }

        if (password.length < 6) {
            toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        const result = await register(name, email, password);

        if (result.success) {
            // Log them straight in
            await login(email, password);
            setIsLoading(false);
            toast({ title: "Account created!", description: "Welcome to Reasoning Engine." });
            navigate('/dashboard');
        } else {
            setIsLoading(false);
            toast({ title: "Registration failed", description: result.message, variant: "destructive" });
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-white mb-2 font-outfit">Create an account</h2>
                <p className="text-sm text-slate-400">Start building powerful workflows today</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5 focus-within:text-primary transition-colors">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            required
                            className="block w-full pl-10 px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5 focus-within:text-primary transition-colors">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="email"
                            required
                            className="block w-full pl-10 px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5 focus-within:text-primary transition-colors">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="password"
                            required
                            className="block w-full pl-10 px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1.5 focus-within:text-primary transition-colors">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider ml-1">Confirm Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="password"
                            required
                            className="block w-full pl-10 px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white py-6 rounded-xl font-medium text-base shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all group mt-2"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <span className="flex items-center gap-2">Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                    )}
                </Button>
            </form>

            <div className="mt-8 text-center text-sm">
                <span className="text-slate-500">Already have an account? </span>
                <Link to="/login" className="text-primary font-semibold hover:text-primary/80 hover:underline transition-all">
                    Sign In
                </Link>
            </div>
        </div>
    );
}
