import {
  HomeIcon,
  UserGroupIcon,
  DocumentChartBarIcon,
  AcademicCapIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ChatBubbleLeftIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import MenuItem from '../ui/MenuItem';

const menuItems = [
  { icon: HomeIcon, label: 'Dashboard', path: '/' },
  { icon: UserGroupIcon, label: 'Students', path: '/students' },
  { icon: DocumentChartBarIcon, label: 'Reports', path: '/reports' },
  { icon: AcademicCapIcon, label: 'Teachers', path: '/teachers' },
  { icon: CalendarIcon, label: 'Schedule', path: '/schedule' },
  { icon: ClipboardDocumentListIcon, label: 'Attendance', path: '/attendance' },
  { icon: CurrencyDollarIcon, label: 'Payments', path: '/payments' },
  { icon: ChatBubbleLeftIcon, label: 'Messages', path: '/messages' },
  { icon: BookOpenIcon, label: 'Courses', path: '/courses' },
  { icon: Cog6ToothIcon, label: 'Settings', path: '/settings' },
];

export default function Sidebar({ isOpen }) {
  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-50
      w-64 bg-white shadow-lg transform 
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0 transition-transform duration-300 ease-in-out
    `}>
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
