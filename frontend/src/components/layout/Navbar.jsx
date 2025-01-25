import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../../services/auth';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Add sign out logic here (clear tokens, etc.)
    signOut();
    navigate('/signin');
  };

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
          
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex space-x-4">
              <a href="#" className="hover:bg-blue-800 px-3 py-2">Home</a>
              <a href="#" className="hover:bg-blue-800 px-3 py-2">Settings</a>
            </div>

            {/* Profile Dropdown */}
            <Menu as="div" className="relative ml-3">
              <Menu.Button className="flex items-center text-sm rounded-full hover:opacity-80 focus:outline-none">
                <UserCircleIcon className="h-8 w-8" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block px-4 py-2 text-sm text-gray-700'
                        )}
                      >
                        Account
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleSignOut}
                        className={classNames(
                          active ? 'bg-gray-100' : '',
                          'block w-full text-left px-4 py-2 text-sm text-gray-700'
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
}
