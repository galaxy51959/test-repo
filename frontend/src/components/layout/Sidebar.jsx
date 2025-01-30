import { useState } from "react";
import {
  HomeIcon,
  UserGroupIcon,
  DocumentChartBarIcon,
  CalendarIcon,
  Cog6ToothIcon,
  ChatBubbleLeftIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  DocumentPlusIcon,
  CommandLineIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import MenuItem from "../ui/MenuItem";

const menuItems = [
  { icon: HomeIcon, label: "Dashboard", path: "/" },
  { icon: UserGroupIcon, label: "Students", path: "/students" },
  {
    icon: DocumentChartBarIcon,
    label: "Reports",
    subMenus: [
      {
        icon: DocumentPlusIcon,
        label: "Generate Report",
        path: "/reports/generate",
      },
      { icon: CommandLineIcon, label: "Prompt", path: "/reports/prompts" },
      { icon: DocumentTextIcon, label: "Template", path: "/reports/template" },
    ],
  },
  { icon: EnvelopeIcon, label: "Mail", path: "/mails" },
  { icon: CalendarIcon, label: "Schedule", path: "/schedule" },
  { icon: ChatBubbleLeftIcon, label: "Messages", path: "/messages" },
  { icon: Cog6ToothIcon, label: "Settings", path: "/settings" },
];

export default function Sidebar({ isOpen }) {
  const [expandedMenu, setExpandedMenu] = useState(null);

  const toggleSubmenu = (label) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  return (
    <aside
      className={`
      fixed lg:static inset-y-0 left-0 z-50
      w-64 bg-slate-800 shadow-lg transform 
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 transition-transform duration-300 ease-in-out
    `}
    >
      <div className="h-full overflow-y-auto">
        <div className="">
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.subMenus ? (
                // Menu item with submenu
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.label)}
                    className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-slate-50 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <div className="flex items-center">
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </div>
                    <ChevronDownIcon
                      className={`h-4 w-4 transform transition-transform ${
                        expandedMenu === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {/* Submenu items */}
                  {expandedMenu === item.label && (
                    <div className="pl-6">
                      {item.subMenus.map((subItem) => (
                        <MenuItem
                          key={subItem.label}
                          icon={subItem.icon}
                          label={subItem.label}
                          path={subItem.path}
                          className="pl-6"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Regular menu item
                <MenuItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
