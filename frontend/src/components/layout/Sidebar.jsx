import {
  HomeIcon,
  UserGroupIcon,
  DocumentChartBarIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ChatBubbleLeftIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import MenuItem from "../ui/MenuItem";

const menuItems = [
  { icon: HomeIcon, label: "Dashboard", path: "/" },
  { icon: UserGroupIcon, label: "Students", path: "/students" },
  { icon: DocumentChartBarIcon, label: "Reports", path: "/reports" },
  { icon: EnvelopeIcon, label: "Mail", path: "/mails" },
  { icon: CalendarIcon, label: "Schedule", path: "/schedule" },
  { icon: ChatBubbleLeftIcon, label: "Messages", path: "/messages" },
  { icon: Cog6ToothIcon, label: "Settings", path: "/settings" },
];

export default function Sidebar({ isOpen }) {
  return (
    <aside
      className={`
      fixed lg:static inset-y-0 left-0 z-50
      w-64 bg-white shadow-lg transform 
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 transition-transform duration-300 ease-in-out
    `}
    >
      <div className="h-full overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <MenuItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              path={item.path}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
