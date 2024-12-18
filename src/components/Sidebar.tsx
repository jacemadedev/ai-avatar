import Link from 'next/link';

const Sidebar = () => {
  const menuItems = [
    { title: 'Dashboard', href: '/', icon: '📊' },
    { title: 'Create Video', href: '/create', icon: '🎥' },
    { title: 'My Videos', href: '/videos', icon: '📼' },
    { title: 'Templates', href: '/templates', icon: '📋' },
    { title: 'Settings', href: '/settings', icon: '⚙️' },
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
                <span className="text-xl">{item.icon}</span>
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