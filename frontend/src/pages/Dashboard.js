import { useEffect, useState } from "react";
import { FileBarChart2, UploadCloud, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom"; // Added Link for navigation

export default function Dashboard() {
  const [chartHistory, setChartHistory] = useState([]);

  useEffect(() => {
    // Fetch chart history from backend (replace with real API)
    fetch("/api/chart-history") // API endpoint (Spring Boot or Node backend)
      .then((res) => res.json())
      .then((data) => setChartHistory(data))
      .catch((err) => console.error("Error loading chart history", err));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-all">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-800 text-white p-6 space-y-6 shadow-lg animate-fadeIn">
        <h2 className="text-2xl font-extrabold tracking-wide">Excel Platform</h2>
        <nav className="space-y-4">
          <Link to="/dashboard" className="flex items-center space-x-2 hover:text-indigo-300">
            <LayoutDashboard size={20} />
            <span>Home</span>
          </Link>
          <Link to="/upload" className="flex items-center space-x-2 hover:text-indigo-300">
            <UploadCloud size={20} />
            <span>Upload Excel</span>
          </Link>
          <Link to="/graph" className="flex items-center space-x-2 hover:text-indigo-300">
            <FileBarChart2 size={20} />
            <span>Charts</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-8 animate-fadeIn">
        <h1 className="text-3xl font-bold text-indigo-700 dark:text-white">Welcome to Your Dashboard</h1>

        {/* Chart History Section */}
        <section className="bg-white dark:bg-gray-800 shadow p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600 dark:text-white">Chart Generation History</h2>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            {chartHistory.length > 0 ? (
              chartHistory.map((entry, index) => (
                <li key={index} className="bg-indigo-50 dark:bg-gray-700 p-3 rounded">
                  {entry.fileName} – {entry.date}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">No charts generated yet.</li>
            )}
          </ul>
        </section>

        {/* What's Next Section */}
        <section className="bg-white dark:bg-gray-800 shadow p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600 dark:text-white">What's Next</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Display parsed Excel data in table</li>
            <li>Export charts to PNG or PDF</li>
            <li>Allow delete/reupload files</li>
            <li>AI-based Excel data summary</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
