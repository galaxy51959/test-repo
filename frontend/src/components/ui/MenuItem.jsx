import { Link, useLocation } from 'react-router-dom';

export default function MenuItem({ icon: Icon, label, path }) {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`
        flex items-center px-4 py-2 text-sm font-medium
        ${isActive 
          ? 'bg-primary text-white' 
          : 'text-gray-700 hover:bg-gray-100'}
      `}
    >
      <Icon className="h-5 w-5 mr-3" />
      {label}
    </Link>
  );
}
