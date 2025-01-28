import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronRightIcon,
  InboxIcon,
  PencilSquareIcon,
  PaperAirplaneIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const Mails = () => {
  const [selectedMail, setSelectedMail] = useState(null);
  const [expandedMenus, setExpandedMenus] = useState({});

  // Sample email accounts data
  const emailAccounts = [
    {
      id: 1,
      email: "work@example.com",
      folders: {
        inbox: [
          {
            id: 1,
            subject: "Meeting Tomorrow",
            from: "john@example.com",
            content: "Let's discuss the project...",
            date: "2024-03-20",
          },
          {
            id: 2,
            subject: "Project Update",
            from: "sarah@example.com",
            content: "Here's the latest update...",
            date: "2024-03-19",
          },
        ],
        drafts: [],
        sent: [],
        trash: [],
      },
    },
    {
      id: 2,
      email: "personal@example.com",
      folders: {
        inbox: [
          {
            id: 3,
            subject: "Family Gathering",
            from: "mom@example.com",
            content: "About this weekend...",
            date: "2024-03-18",
          },
        ],
        drafts: [],
        sent: [],
        trash: [],
      },
    },
  ];

  const toggleMenu = (accountId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  };

  const handleMailClick = (mail) => {
    setSelectedMail(mail);
  };

  return (
    <div className="h-full rounded-lg">
      <div className="py-4 h-full flex flex-col">
        {/* Header Section */}
        <div className="flex items-center mb-4">
          <h1 className="pl-4 text-xl font-semibold">Mail</h1>
          <div className="flex items-center max-w-md w-full">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search emails..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Body Section */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r overflow-y-auto">
            {emailAccounts.map((account) => (
              <div key={account.id} className="p-4">
                <button
                  onClick={() => toggleMenu(account.id)}
                  className="flex items-center w-full text-left p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRightIcon
                    className={`h-4 w-4 transform transition-transform ${
                      expandedMenus[account.id] ? "rotate-90" : ""
                    }`}
                  />
                  <span className="px-1 font-medium">{account.email}</span>
                </button>

                {expandedMenus[account.id] && (
                  <div className="ml-4 mt-2 space-y-1">
                    <button
                      onClick={() => handleMailClick(account.folders.inbox[0])}
                      className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <InboxIcon className="h-4 w-4" />
                      <span>Inbox</span>
                    </button>
                    <button className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded-lg">
                      <PencilSquareIcon className="h-4 w-4" />
                      <span>Drafts</span>
                    </button>
                    <button className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded-lg">
                      <PaperAirplaneIcon className="h-4 w-4" />
                      <span>Sent</span>
                    </button>
                    <button className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded-lg">
                      <TrashIcon className="h-4 w-4" />
                      <span>Trash</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6">
            {selectedMail ? (
              <div className="bg-white shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {selectedMail.subject}
                </h2>
                <div className="text-sm text-gray-600 mb-2">
                  From: {selectedMail.from}
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Date: {new Date(selectedMail.date).toLocaleDateString()}
                </div>
                <div className="border-t pt-4">{selectedMail.content}</div>
              </div>
            ) : (
              <div className="text-center text-gray-500 pt-10 bg-gray-200 h-full">
                Select an email to view its contents
              </div>
            )}
          </div>
        </div>

        {/* New Mail Button */}
        <button
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          onClick={() => {
            /* Handle new mail */
          }}
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Mails;
