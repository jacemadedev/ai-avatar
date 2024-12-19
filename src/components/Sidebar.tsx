import Link from 'next/link';
import {
  LayoutDashboard,
  Video,
  History,
  Files,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { title: 'Dashboard', href: '/', icon: LayoutDashboard },
    { title: 'Create Video', href: '/create', icon: Video },
    { title: 'History', href: '/history', icon: History },
    { title: 'Templates', href: '/templates', icon: Files },
    { title: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white p-4 fixed left-0 top-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">UGC Creator</h1>
      </div>
      
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 