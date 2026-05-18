'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { validateRegistration } from '@/lib/dvla';
import Link from 'next/link';
import { VetlyLogo } from '@/components/VetlyLogo';

const EXAMPLE_REGS = [
  { reg: 'AB12CDE', label: 'Clean Van' },
  { reg: 'CD34EFG', label: 'Rusty Van' },
  { reg: 'EF56GHI', label: 'Neglected Van' },
  { reg: 'GH78IJK', label: 'Clean Car' },
  { reg: 'IJ90KLM', label: 'Clocked Van' },
  { reg: 'KL12MNO', label: 'Motorcycle' },
  { reg: 'MN34OPQ', label: 'Walk Away Car' },
];

export default function Home() {
  const [registration, setRegistration] = useState('');
  const [error, setError] = useState('');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifySent, setNotifySent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem('vetlyNotifyEmail');
    if (storedEmail) {
      setNotifyEmail(storedEmail);
      setNotifySent(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!registration.trim()) {
      setError('Please enter a registration number');
      return;
    }

    if (!validateRegistration(registration)) {
      setError('Invalid UK registration format. Please use AB12 CDE or AB12CDE');
      return;
    }

    // Navigate to results page with the registration as a query param
    router.push(`/results?reg=${encodeURIComponent(registration.toUpperCase())}`);
  };

  const handleExampleClick = (reg: string) => {
    router.push(`/results?reg=${encodeURIComponent(reg)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <VetlyLogo />
          <Link href="/shortlist">
            <Button variant="outline" size="sm">
              Shortlist
            </Button>
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <VetlyLogo className="mx-auto mb-6" />
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-4">
            Know what you're buying<br />before you hand over cash
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Enter a UK vehicle registration. We'll analyze its MOT history and give you a clear verdict: Buy, Caution, or Walk Away.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-slate-900 rounded-lg p-8 mb-8 border border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="text"
                placeholder="Enter UK registration (e.g., AB12 CDE)"
                value={registration}
                onChange={(e) => {
                  setRegistration(e.target.value);
                  setError('');
                }}
                className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-emerald-500"
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Check Vehicle
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </div>

        {/* Example Chips */}
        <div className="text-center">
          <p className="text-slate-400 mb-4 text-sm">Try an example:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 justify-center">
            {EXAMPLE_REGS.map((item) => (
              <button
                key={item.reg}
                onClick={() => handleExampleClick(item.reg)}
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-left transition hover:border-slate-600 hover:bg-slate-700"
              >
                <span className="block text-sm font-semibold text-white">{item.reg}</span>
                <span className="block text-xs text-slate-400">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-12 bg-slate-900 rounded-3xl border border-slate-800 p-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">Coming Soon</p>
            <h3 className="mt-3 text-3xl font-bold text-white">We're building the most comprehensive vehicle buying tool in the UK</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                icon: '🔍',
                title: 'Batch Checking',
                description: 'Check up to 10 vehicles at once and compare side by side',
              },
              {
                icon: '📸',
                title: 'Photo Analysis',
                description: 'Upload a photo of any van or car and get instant condition insights',
              },
              {
                icon: '🛡️',
                title: 'HPI Check',
                description: 'Full history check including finance, write-offs, stolen status and plate changes',
              },
              {
                icon: '📊',
                title: 'Market Pricing',
                description: 'See whether the asking price is fair based on live market data',
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-slate-800 bg-slate-950/40 p-5 text-slate-300">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-xl">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-white">{feature.title}</h4>
                <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            {notifySent ? (
              <div className="space-y-2 text-center">
                <p className="text-lg font-semibold text-white">Thanks! We'll notify you when it's ready.</p>
                <p className="text-sm text-slate-400">We'll keep your email and send a launch note.</p>
              </div>
            ) : (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!notifyEmail.trim()) return;
                  localStorage.setItem('vetlyNotifyEmail', notifyEmail.trim());
                  setNotifySent(true);
                }}
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={notifyEmail}
                  onChange={(event) => setNotifyEmail(event.target.value)}
                  className="flex-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
                />
                <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                  Notify me when ready
                </Button>
              </form>
            )}
          </div>
        </div>

        <footer className="mt-10 text-center text-sm text-slate-500">Built for UK buyers, designed to make vehicle checks simple.</footer>
      </div>
    </div>
  );
}
