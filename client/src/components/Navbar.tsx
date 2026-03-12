import { TrendingUp, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="bg-white border-b border-gray-100 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
            <TrendingUp size={18} />
          </div>
          <span className="font-bold text-gray-800">SpendSmart</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Hi, {user?.name}</span>
          <button onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
