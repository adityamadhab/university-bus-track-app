import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              Bus Tracker
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              {isAdmin && (
                <Link to="/admin" className="hover:text-blue-200">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>{user.username}</span>
            <button
              onClick={logout}
              className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 