export default function Home() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Videos"
          value="12"
          icon="🎥"
          trend="+33%"
        />
        <DashboardCard
          title="Processing"
          value="2"
          icon="⚙️"
          trend="-10%"
        />
        <DashboardCard
          title="Storage Used"
          value="1.2 GB"
          icon="💾"
          trend="+5%"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Videos</h2>
        <div className="space-y-4">
          {/* Placeholder for recent videos */}
          <p className="text-gray-500 dark:text-gray-400">No videos yet</p>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon, trend }: {
  title: string;
  value: string;
  icon: string;
  trend: string;
}) {
  const isPositive = trend.startsWith('+');
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`mt-2 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {trend} from last month
      </div>
    </div>
  );
}
