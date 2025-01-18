import { Bars3Icon } from '@heroicons/react/24/outline';

export default function Navbar({ onMenuClick }) {
  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md hover:bg-blue-800"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <span className="ml-2 text-xl font-semibold">Report Generation</span>
          </div>
          
          <div className="hidden lg:flex space-x-4">
            <a href="#" className="hover:bg-blue-800 px-3 py-2">Home</a>
            <a href="#" className="hover:bg-blue-800 px-3 py-2">Settings</a>
            <a href="#" className="hover:bg-blue-800 px-3 py-2">Profile</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
