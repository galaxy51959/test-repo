import { useState, useEffect } from "react";
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
import { getEmailsByAccount } from "../actions/emailActions";
const Mails = () => {
  const [selectedMail, setSelectedMail] = useState(null);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [firstMailInbox, setFirstMailInbox] = useState([]);
  const [secondMailInbox, setSecondMailInbox] = useState([]);
  const [thirdMailInbox, setThirdMailInbox] = useState([]);
  const [totalMailBox, setTotalBox] = useState([]);

  const emailAccounts = [
    {
      id: 1,
      email: "Alexis.Carter@ssg-community.com",
      folders: {
        inbox: [],
        drafts: [],
        sent: [],
        trash: [],
      },
    },
    {
      id: 2,
      email: "alexis.cartetr@provider.presence.com",
      folders: {
        inbox: [],
        drafts: [],
        sent: [],
        trash: [],
      },
    },
    {
      id: 3,
      email: "acarter@dlinorthcounty.org",
      folders: {
        inbox: [],
        drafts: [],
        sent: [],
        trash: [],
      },
    },
  ];
  // Sample email accounts data

  const toggleMenu = (accountId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  };

  const handleMailClick = async (email) => {
    const result = await getEmailsByAccount(email);
    console.log(result);
    console.log(email);
    setSelectedMail(result);
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
                  <span className="px-1 font-medium">
                    {account.email.substring(0, 20)}...
                  </span>
                </button>

                {expandedMenus[account.id] && (
                  <div className="ml-4 mt-2 space-y-1">
                    <button
                      onClick={() => handleMailClick(account.email)}
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
              selectedMail.map((mail) => (
                <div className="bg-white shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">{mail.subject}</h2>
                  <div className="text-sm text-gray-600 mb-2">
                    From: {mail.from}
                  </div>
                  {/* <div className="text-sm text-gray-600 mb-4">
                Date: {new Date(selectedMail.date).toLocaleDateString()}
              </div> */}
                  {mail.attachments.map((file) => (
                    <a
                      className="text-sm text-gray-600 mb-4"
                      href={`http://localhost:5000/reports/${file.filename}`}
                    >
                      {file.path}
                    </a>
                  ))}

                  <div className="border-t pt-4">{mail.body}</div>
                </div>
              ))
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
