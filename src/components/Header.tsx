'use client';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handlePlansClick = () => {
    if (!isAuthenticated) {
      router.push('/?authRequired=true');
      return;
    }
    // TODO: Implement plans page navigation
    router.push('/plans');
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold">Create UGC Video</h2>
      </div>
      
      <button
        onClick={handlePlansClick}
        className={`px-4 py-2 rounded-lg transition-colors ${
          isAuthenticated 
            ? 'bg-blue-500 text-white hover:bg-blue-600' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700'
        }`}
        disabled={!isAuthenticated}
      >
        See Plans
      </button>
    </header>
  );
};

export default Header; 