'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Home, Trash2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ShortlistEntry {
  reg: string;
  make: string;
  model: string;
  verdict: 'BUY' | 'CAUTION' | 'WALK_AWAY';
  savedAt: string;
}

export default function Shortlist() {
  const [entries, setEntries] = useState<ShortlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const shortlist = JSON.parse(localStorage.getItem('shortlist') || '[]');
    setEntries(shortlist);
    setLoading(false);
  }, []);

  const handleRemove = (reg: string) => {
    const updated = entries.filter((e) => e.reg !== reg);
    setEntries(updated);
    localStorage.setItem('shortlist', JSON.stringify(updated));
  };

  const handleViewResult = (reg: string) => {
    router.push(`/results?reg=${encodeURIComponent(reg)}`);
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'BUY':
        return 'success';
      case 'CAUTION':
        return 'warning';
      case 'WALK_AWAY':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/">
          <Button variant="outline" size="sm" className="mb-8">
            <Home className="w-4 h-4 mr-2" />
            Back Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-white mb-2">Your Shortlist</h1>
        <p className="text-slate-400 mb-8">Vehicles you've saved for review</p>

        {entries.length === 0 ? (
          <Alert variant="default">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No vehicles saved</AlertTitle>
            <AlertDescription>
              Start by checking a vehicle from the home page, then save it to your shortlist.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card
                key={entry.reg}
                className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                onClick={() => handleViewResult(entry.reg)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">
                        {entry.make} {entry.model}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">
                        {entry.reg} • Saved{' '}
                        {new Date(entry.savedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={getVerdictColor(entry.verdict)}>
                        {entry.verdict}
                      </Badge>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(entry.reg);
                        }}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
