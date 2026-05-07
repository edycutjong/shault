"use client";

import { StatusBar } from "@/components/StatusBar";
import { Footer } from "@/components/Footer";

import React, { useState } from 'react';
import { kiraPayService } from '@/lib/kirapay';

export default function Home() {
  const [view, setView] = useState<'create' | 'pay' | 'vault'>('create');
  const [amount, setAmount] = useState('100');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'verifying' | 'success'>('pending');

  const [paymentLink, setPaymentLink] = useState<string | null>(null);

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

  return (
    <>
      <StatusBar />
    <main className="min-h-screen flex flex-col bg-slate-950 text-slate-300">
      <header className="border-b border-purple-500/30 bg-slate-900/80 p-4 px-8 flex justify-between items-center backdrop-blur">
        <div className="font-mono text-purple-500 font-bold tracking-widest text-xl">SHAULT</div>
        <nav className="flex gap-4 font-mono text-sm">
          <button onClick={() => setView('create')} className={`${view === 'create' ? 'text-purple-400' : 'text-slate-500'} hover:text-purple-300`}>CREATE</button>
          <button onClick={() => setView('vault')} className={`${view === 'vault' ? 'text-purple-400' : 'text-slate-500'} hover:text-purple-300`}>VAULT</button>
        </nav>
      </header>

      <div className="flex-1 flex items-center justify-center p-8">
        
        {view === 'create' && (
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.1)] animate-in fade-in zoom-in-95">
            <div className="text-center mb-8">
              <h1 className="text-2xl text-white font-bold mb-2">Create Payment Link</h1>
              <p className="text-slate-500 text-sm">Generate a KiraPay link that routes to your stealth address.</p>
            </div>

            <form onSubmit={handleCreateLink} className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">AMOUNT (USDC)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 p-4 pl-8 rounded-xl font-mono text-white text-xl outline-none"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                Generate Secure Link
              </button>
            </form>
          </div>
        )}

        {view === 'pay' && (
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center animate-in slide-in-from-right-8">
            <h1 className="text-2xl text-white font-bold mb-2">Payment Request</h1>
            <p className="text-slate-500 text-sm mb-8">Scan or tap to pay via KiraPay.</p>
            
            <div className="bg-white p-4 rounded-xl inline-block mb-8">
              {/* Simulated QR Code */}
              <div className="w-48 h-48 bg-slate-200 grid grid-cols-4 grid-rows-4 gap-1 p-1">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className={`bg-slate-900 ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                ))}
              </div>
            </div>

            <div className="text-3xl text-white font-mono font-bold mb-4">${amount} <span className="text-sm text-slate-500">USDC</span></div>
            {paymentLink && (
              <div className="text-xs text-purple-400 font-mono mb-8 break-all">
                {paymentLink}
              </div>
            )}

            {paymentStatus === 'pending' && (
              <button onClick={handleSimulatePayment} className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-colors border border-slate-700">
                Simulate KiraPay Payment
              </button>
            )}

            {paymentStatus === 'verifying' && (
              <div className="w-full bg-purple-600/20 border border-purple-500/50 text-purple-400 font-bold py-4 rounded-xl flex items-center justify-center gap-3">
                <span className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></span>
                Verifying Webhook...
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="w-full bg-green-500/20 border border-green-500/50 text-green-400 font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                Payment Secured. Routing to Vault...
              </div>
            )}
          </div>
        )}

        {view === 'vault' && (
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-8 animate-in slide-in-from-bottom-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl text-white font-bold mb-2">Private Vault</h1>
                <p className="text-slate-500 text-sm font-mono">STEALTH ADDRESS: stk_9x2f...a1b4</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500 mb-1">Total Balance</div>
                <div className="text-3xl text-purple-400 font-mono font-bold">$1,450.00</div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left font-mono text-sm">
                <thead className="bg-slate-900 border-b border-slate-800">
                  <tr>
                    <th className="p-4 text-slate-400 font-normal">Date</th>
                    <th className="p-4 text-slate-400 font-normal">Amount</th>
                    <th className="p-4 text-slate-400 font-normal">Source</th>
                    <th className="p-4 text-slate-400 font-normal text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  <tr className="bg-purple-500/5">
                    <td className="p-4 text-slate-300">Just now</td>
                    <td className="p-4 text-green-400">+{amount} USDC</td>
                    <td className="p-4 text-slate-500 truncate max-w-[150px]">KiraPay Webhook #892</td>
                    <td className="p-4 text-right text-purple-400">Deposited</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-slate-500">2 days ago</td>
                    <td className="p-4 text-green-400">+500.00 USDC</td>
                    <td className="p-4 text-slate-500 truncate max-w-[150px]">KiraPay Webhook #891</td>
                    <td className="p-4 text-right text-purple-400">Deposited</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-slate-500">1 week ago</td>
                    <td className="p-4 text-green-400">+850.00 USDC</td>
                    <td className="p-4 text-slate-500 truncate max-w-[150px]">KiraPay Webhook #890</td>
                    <td className="p-4 text-right text-purple-400">Deposited</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
      <Footer />
    </>
  );
}
