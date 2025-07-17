import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white text-gray-800 border-b border-gray-300 px-6 py-4 flex items-center shadow-sm">
      <div className="flex items-center space-x-6">
        <div className="text-xl font-bold">Spending Tracker</div>
        <Link
          to="/"
          className={`hover:underline ${isActive('/') ? 'underline font-semibold' : ''}`}
        >
          Analytics
        </Link>
        <Link
          to="/journal"
          className={`hover:underline ${isActive('/journal') ? 'underline font-semibold' : ''}`}
        >
          Journal
        </Link>
      </div>
    </nav>
  );
}
