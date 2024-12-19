'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Video,
  History,
  Settings,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuItems = [
    { title: 'Dashboard', href: '/', icon: LayoutDashboard },
    { title: 'Create Video', href: '/create', icon: Video },
    { title: 'History', href: '/history', icon: History },
    { title: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-5 left-6 z-50 p-2 rounded-lg bg-white dark:bg-[#1d1d1f] shadow-lg"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen w-[280px] 
        bg-[#f5f5f7] dark:bg-[#1d1d1f] 
        border-r border-[#e5e5e7] dark:border-[#2d2d2f] 
        text-[#1d1d1f] dark:text-white
        transition-transform duration-300 ease-in-out z-40
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Content Container */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-12 flex items-center">
            <h1 className="text-2xl font-semibold tracking-tight lg:ml-0 ml-8">Face Card</h1>
          </div>
          
          <nav>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white dark:hover:bg-[#2d2d2f] transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-[18px] h-[18px] text-[#86868b] group-hover:text-[#1d1d1f] dark:group-hover:text-white transition-colors" />
                      <span className="text-[15px] text-[#86868b] group-hover:text-[#1d1d1f] dark:group-hover:text-white transition-colors">{item.title}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#86868b] opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Footer - Always at bottom */}
        <div className="p-6 border-t border-[#e5e5e7] dark:border-[#2d2d2f]">
          <p className="text-xs text-[#86868b] text-center">
            © {new Date().getFullYear()} Face Card
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 