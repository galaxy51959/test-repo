import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
// import Notification from '../Notification';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />
        
        {/* <main className="flex-1 p-4 lg:ml-64"> */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
      {/* <Notification /> */}
    </div>
  );
}
