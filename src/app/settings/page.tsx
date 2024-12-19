'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/?authRequired=true');
          return;
        }
        setEmail(session.user.email || '');
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [supabase, router]);

  const handleUpdatePassword = async () => {
    try {
      setUpdating(true);
      setError(null);
      setSuccessMessage(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
      });

      if (error) throw error;

      setSuccessMessage('Password reset email sent. Please check your inbox.');
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setUpdating(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push('/');
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign out');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-lg">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-lg">
              {successMessage}
            </div>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <button
              onClick={handleUpdatePassword}
              disabled={updating}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {updating ? 'Processing...' : 'Update Password'}
            </button>

            <button
              onClick={handleSignOut}
              disabled={updating}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {updating ? 'Processing...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 