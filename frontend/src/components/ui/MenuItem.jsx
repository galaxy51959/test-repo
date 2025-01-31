import { Link, useLocation } from "react-router-dom";

export default function MenuItem({ icon: Icon, label, path }) {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`
        flex items-center px-4 py-3 text-sm font-medium
        ${
          isActive
            ? "text-gray-900 bg-gray-300"
            : "text-gray-700 hover:bg-gray-300 hover:text-gray-900"
        }
      `}
    >
      <Icon className="h-5 w-5 mr-3" />
      {label}
    </Link>
  );
}
