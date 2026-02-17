import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/store';

export default observer(function LoginPage() {
    const { authStore } = useStore();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await authStore.login({ username, passwordHash: password });
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    return (
        <div className="font-['Inter'] bg-[#f6f6f8] text-gray-900 h-screen w-screen flex overflow-hidden fixed inset-0">
            
            {/* Left Panel: Visual/Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-[40%] bg-[#1a227f] relative flex-col justify-between p-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a227f] via-[#2a349e] to-[#1a227f] opacity-90"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                    {/* Logo Area */}
                    <div className="flex items-center space-x-3 text-white">
                        <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20">
                            <span className="material-icons text-white">domain</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">SmartOffice</span>
                    </div>

                    {/* Central Visual */}
                    <div className="flex-1 flex items-center justify-center my-8">
                        <div className="relative w-full max-w-md perspective-1000">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl transform rotate-y-12 rotate-x-6">
                                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="h-2 w-20 bg-white/20 rounded-full"></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex space-x-4">
                                        <div className="flex-1 h-20 bg-white/10 rounded-lg border border-white/10"></div>
                                        <div className="flex-1 h-20 bg-white/10 rounded-lg border border-white/10"></div>
                                    </div>
                                    <div className="h-24 bg-white/5 rounded-lg border border-white/10"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 text-white">
                        <h2 className="text-3xl font-bold leading-tight">Optimize your workspace <br/> efficiency today.</h2>
                        <p className="text-blue-100 text-sm opacity-80 font-medium tracking-wide">Join 10,000+ companies managing their smart offices.</p>
                    </div>
                </div>
            </div>

            {/* Right Panel: Login Form - flex-1 יגרום לו למלא את כל שאר המסך */}
            <div className="flex-1 bg-[#eef2f6] flex items-center justify-center p-6 relative">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 sm:p-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-500 text-sm">Please enter your credentials to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                </div>
                                <input 
                                    className="block w-full pl-10 pr-3 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a227f] focus:border-[#1a227f] outline-none transition-all duration-200"
                                    placeholder="Enter your username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                                <button type="button" className="text-xs font-bold text-[#1a227f] hover:underline">Forgot?</button>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                </div>
                                <input 
                                    type="password"
                                    className="block w-full pl-10 pr-3 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#1a227f] focus:border-[#1a227f] outline-none transition-all duration-200"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-4 px-4 rounded-xl bg-[#1a227f] hover:bg-[#151b66] text-white font-bold shadow-xl shadow-indigo-100 transition-all duration-200 transform hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-2"
                            disabled={authStore.loading}
                        >
                            {authStore.loading ? 'SIGNING IN...' : 'SIGN IN'}
                        </button>
                    </form>

                    <div className="mt-8 relative text-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <button className="flex justify-center items-center py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            Google
                        </button>
                        <button className="flex justify-center items-center py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                            LinkedIn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});