'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { validateRegistration } from '@/lib/dvla';
import Link from 'next/link';

const EXAMPLE_REGS = ['AB12CDE', 'CD34EFG', 'EF56GHI'];

export default function Home() {
  const [registration, setRegistration] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

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
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Vetly</h1>
          </div>
          <Link href="/shortlist">
            <Button variant="outline" size="sm">
              Shortlist
            </Button>
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
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
          <div className="flex flex-wrap justify-center gap-3">
            {EXAMPLE_REGS.map((reg) => (
              <button
                key={reg}
                onClick={() => handleExampleClick(reg)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700 hover:border-slate-600"
              >
                {reg}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
