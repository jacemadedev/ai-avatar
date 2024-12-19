import Link from 'next/link';
import {
  LayoutDashboard,
  Video,
  History,
  Settings,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { title: 'Dashboard', href: '/', icon: LayoutDashboard },
    { title: 'Create Video', href: '/create', icon: Video },
    { title: 'History', href: '/history', icon: History },
    { title: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="h-screen w-[280px] bg-[#f5f5f7] dark:bg-[#1d1d1f] border-r border-[#e5e5e7] dark:border-[#2d2d2f] text-[#1d1d1f] dark:text-white p-6 fixed left-0 top-0 flex flex-col">
      <div className="mb-12">
        <h1 className="text-2xl font-semibold tracking-tight">Face Card</h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
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

      <div className="pt-6 mt-auto border-t border-[#e5e5e7] dark:border-[#2d2d2f]">
        <p className="text-xs text-[#86868b] text-center">
          © {new Date().getFullYear()} Face Card
        </p>
      </div>
    </div>
  );
};

export default Sidebar; 