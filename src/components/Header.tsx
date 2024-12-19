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
    router.push('/plans');
  };

  return (
    <header className="h-16 bg-[#f5f5f7]/80 dark:bg-black/80 backdrop-blur-xl border-b border-[#e5e5e7] dark:border-[#2d2d2f] flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <h2 className="text-[17px] font-medium text-[#1d1d1f] dark:text-white">Create Video</h2>
      </div>
      
      <button
        onClick={handlePlansClick}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          isAuthenticated 
            ? 'bg-[#1d1d1f] text-white hover:bg-[#2d2d2f] dark:bg-white dark:text-black dark:hover:bg-[#f5f5f7]' 
            : 'bg-[#f5f5f7] text-[#86868b] cursor-not-allowed dark:bg-[#1d1d1f]'
        }`}
        disabled={!isAuthenticated}
      >
        See Plans
      </button>
    </header>
  );
};

export default Header; 