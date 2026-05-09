"use client";

import { StatusBar } from "@/components/StatusBar";
import { Footer } from "@/components/Footer";
import { ParticleBackground } from "@/components/ParticleBackground";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, ScanLine, Loader2, CheckCircle2, ChevronRight, Vault, ArrowUpRight } from "lucide-react";

import React, { useState } from 'react';
import { kiraPayService } from '@/lib/kirapay';

export default function Home() {
  const [view, setView] = useState<'create' | 'pay' | 'vault'>('create');
  const [amount, setAmount] = useState('100');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'verifying' | 'success'>('pending');

  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [qrPattern] = useState<string[]>(() => 
    Array.from({ length: 16 }).map(() => Math.random() > 0.3 ? 'opacity-100' : 'opacity-20')
  );

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const link = await kiraPayService.generatePaymentLink(amount);
    setPaymentLink(link);
    setView('pay');
  };

  const handleSimulatePayment = async () => {
    setPaymentStatus('verifying');
    await kiraPayService.verifyPayment("pending_payment");
    setPaymentStatus('success');
    setTimeout(() => setView('vault'), 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <ParticleBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <StatusBar />
        
        <header className="border-b border-purple-500/20 bg-slate-900/40 p-4 px-8 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-3 font-mono text-purple-400 font-bold tracking-widest text-xl group cursor-pointer">
            <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors border border-purple-500/20">
              <Shield className="w-5 h-5 group-hover:animate-pulse-slow" />
            </div>
            <span>SHAULT</span>
          </div>
          <nav className="flex gap-6 font-mono text-sm">
            <button 
              onClick={() => setView('create')} 
              className={`flex items-center gap-2 transition-all ${view === 'create' ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'text-slate-500 hover:text-purple-300'}`}
            >
              <ArrowUpRight className="w-4 h-4" /> CREATE
            </button>
            <button 
              onClick={() => setView('vault')} 
              className={`flex items-center gap-2 transition-all ${view === 'vault' ? 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'text-slate-500 hover:text-purple-300'}`}
            >
              <Vault className="w-4 h-4" /> VAULT
            </button>
          </nav>
        </header>

        <div className="flex-1 flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            {view === 'create' && (
              <motion.div 
                key="create"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-md glass-panel rounded-3xl p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-purple-500 to-transparent opacity-50" />
                
                <motion.div variants={itemVariants} className="text-center mb-8">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                    <Lock className="w-8 h-8 text-purple-400" />
                  </div>
                  <h1 className="text-2xl text-white font-bold mb-2">Create Link</h1>
                  <p className="text-slate-400 text-sm">Generate a KiraPay link that routes to your stealth address.</p>
                </motion.div>

                <form onSubmit={handleCreateLink} className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <label className="block text-xs font-mono text-slate-400 mb-2 tracking-wider">AMOUNT (USDC)</label>
                    <div className="relative group">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 font-mono text-xl group-focus-within:animate-pulse-slow">$</span>
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 p-4 pl-10 rounded-xl font-mono text-white text-2xl outline-none transition-all shadow-inner"
                        required
                        autoFocus
                      />
                      <div className="absolute inset-0 rounded-xl border border-purple-500/0 group-focus-within:border-purple-500/50 group-focus-within:shadow-[0_0_20px_rgba(168,85,247,0.2)] pointer-events-none transition-all duration-300" />
                    </div>
                  </motion.div>
                  <motion.button 
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2"
                  >
                    Generate Secure Link <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </form>
              </motion.div>
            )}

            {view === 'pay' && (
              <motion.div 
                key="pay"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-md glass-panel rounded-3xl p-8 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                
                <motion.h1 variants={itemVariants} className="text-2xl text-white font-bold mb-2">Payment Request</motion.h1>
                <motion.p variants={itemVariants} className="text-slate-400 text-sm mb-8">Scan or tap to pay via KiraPay.</motion.p>
                
                <motion.div variants={itemVariants} className="bg-white p-4 rounded-2xl inline-block mb-8 relative group cursor-pointer shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                  {/* Simulated Scanning Laser */}
                  <div className="absolute inset-x-4 top-4 h-[2px] bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] z-10 animate-scan pointer-events-none rounded-full" />
                  
                  {/* Simulated QR Code */}
                  <div className="w-48 h-48 bg-slate-100 grid grid-cols-4 grid-rows-4 gap-1 p-1 rounded-xl relative overflow-hidden">
                    {qrPattern.map((opacity, i) => (
                      <div key={i} className={`bg-slate-900 rounded-sm transition-opacity duration-1000 ${opacity}`}></div>
                    ))}
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/20 to-transparent pointer-events-none" />
                  </div>
                  <div className="absolute -inset-2 bg-purple-500/20 rounded-3xl -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>

                <motion.div variants={itemVariants} className="text-4xl text-white font-mono font-bold mb-4 tracking-tight">
                  ${amount} <span className="text-lg text-slate-500 font-sans">USDC</span>
                </motion.div>
                
                {paymentLink && (
                  <motion.div variants={itemVariants} className="text-xs text-purple-400/70 font-mono mb-8 break-all bg-purple-500/5 p-3 rounded-lg border border-purple-500/10">
                    {paymentLink}
                  </motion.div>
                )}

                <motion.div variants={itemVariants} className="h-16">
                  <AnimatePresence mode="wait">
                    {paymentStatus === 'pending' && (
                      <motion.button 
                        key="btn-pending"
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        onClick={handleSimulatePayment} 
                        className="w-full h-full bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-2 group"
                      >
                        <ScanLine className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors" />
                        Simulate KiraPay Payment
                      </motion.button>
                    )}

                    {paymentStatus === 'verifying' && (
                      <motion.div 
                        key="btn-verifying"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                        className="w-full h-full bg-purple-600/20 border border-purple-500/50 text-purple-400 font-bold rounded-xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                      >
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying Webhook...
                      </motion.div>
                    )}

                    {paymentStatus === 'success' && (
                      <motion.div 
                        key="btn-success"
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="w-full h-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Payment Secured. Routing...
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )}

            {view === 'vault' && (
              <motion.div 
                key="vault"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-4xl glass-panel rounded-3xl p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

                <div className="flex justify-between items-end mb-10">
                  <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <Vault className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h1 className="text-3xl text-white font-bold">Private Vault</h1>
                    </div>
                    <p className="text-slate-400 text-sm font-mono tracking-wider flex items-center gap-2">
                      STEALTH ADDRESS: <span className="text-slate-300">stk_9x2f...a1b4</span>
                    </p>
                  </motion.div>
                  <motion.div variants={itemVariants} className="text-right">
                    <div className="text-sm text-slate-400 mb-1 font-medium tracking-wide uppercase">Total Balance</div>
                    <div className="text-4xl text-emerald-400 font-mono font-bold drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-end gap-2">
                      <span className="text-emerald-500/50 text-2xl">$</span>
                      1,450.00
                    </div>
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="bg-slate-950/50 border border-slate-800/80 rounded-2xl overflow-hidden shadow-inner backdrop-blur-sm">
                  <table className="w-full text-left font-mono text-sm">
                    <thead className="bg-slate-900/80 border-b border-slate-800">
                      <tr>
                        <th className="p-5 text-slate-400 font-medium">Date</th>
                        <th className="p-5 text-slate-400 font-medium">Amount</th>
                        <th className="p-5 text-slate-400 font-medium">Source</th>
                        <th className="p-5 text-slate-400 font-medium text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      <motion.tr 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors group"
                      >
                        <td className="p-5 text-slate-300">Just now</td>
                        <td className="p-5 text-emerald-400 font-bold group-hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all">+{amount} USDC</td>
                        <td className="p-5 text-slate-400">
                          <div className="flex items-center gap-2 max-w-[150px]">
                            <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                            <span className="truncate">KiraPay Webhook #892</span>
                          </div>
                        </td>
                        <td className="p-5 text-emerald-400">
                          <div className="flex items-center justify-end gap-2">
                            Deposited <CheckCircle2 className="w-4 h-4" />
                          </div>
                        </td>
                      </motion.tr>
                      <motion.tr 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="p-5 text-slate-500">2 days ago</td>
                        <td className="p-5 text-emerald-400/70">+500.00 USDC</td>
                        <td className="p-5 text-slate-500 truncate max-w-[150px]">KiraPay Webhook #891</td>
                        <td className="p-5 text-right text-slate-400">Deposited</td>
                      </motion.tr>
                      <motion.tr 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="p-5 text-slate-500">1 week ago</td>
                        <td className="p-5 text-emerald-400/70">+850.00 USDC</td>
                        <td className="p-5 text-slate-500 truncate max-w-[150px]">KiraPay Webhook #890</td>
                        <td className="p-5 text-right text-slate-400">Deposited</td>
                      </motion.tr>
                    </tbody>
                  </table>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </>
  );
}

