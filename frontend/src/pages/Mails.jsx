import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
  InboxIcon,
  PencilSquareIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
  TrashIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import {
  getEmailsByAccount,
  sendEmails,
  getEmails,
} from "../actions/emailActions";
import { toast } from 'react-hot-toast';

const Mails = () => {
  const [selectedMail, setSelectedMail] = useState(null);
  const [selectMail, setSelectMail] = useState();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedMails, setSelectedMails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sendEmailData, setSendEmailData] = useState();

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

  const handleMailClick = async (folder, account) => {
    setSelectedMail(account);
    const result = await getEmailsByAccount(account.email, folder);
    setSelectedMails(result);
    setSearchTerm("");
  };

  const handleClickMail = async (mail) => {
    setSendEmailData();
    setSelectMail(mail);
  };

  const handleClose = () => setShowModal(false);

  const handleNewMail = () => {
    if (selectedMail != null) {
      setSelectMail();
      setSendEmailData({ ...sendEmailData, from: selectedMail.email });
      console.log(sendEmailData);
    } else {
      setSendEmailData({
        ...sendEmailData,
        from: "alexis.cartetr@provider.presence.com",
      });
    }
    // setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSendEmailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const attachment = e.target.files[0];
    setSendEmailData((prev) => ({
      ...prev,
      attachment: attachment,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("from", sendEmailData.from);
    formData.append("to", sendEmailData.to);
    formData.append("subject", sendEmailData.subject);
    formData.append("body", sendEmailData.message);
    if (sendEmailData.attachment) {
      formData.append("attachment", sendEmailData.attachment);
    }
    let n8nLink;
    if (sendEmailData.from == import.meta.env.USER_MAIL1) {
      n8nLink = import.meta.env.N8N_WEBHOOK_URL1;
    }
    if (sendEmailData.from == import.meta.env.USER_MAIL2) {
      n8nLink = import.meta.env.N8N_WEBHOOK_URL2;
    }
    try {
      const response = await sendEmails(n8nLink, formData);
      if (!response.error) {
        handleClose();
        toast.success("Email sent successfully");
        setSendEmailData({});
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error("Failed to send email. Please try again later.");
    }
  };

  const submitSearch = async (e) => {
    e.preventDefault();
    const results = await getEmails(searchTerm);
    setSelectedMails(results);
    setSearchTerm("");
  };

  return (
    <div className="h-full rounded-lg">
      <div className="py-4 h-full flex flex-col">
        {/* Header Section */}
        <div className="flex items-center mb-4">
          <div className="w-60">
            <button
              className="bg-blue-600 rounded hover:bg-blue-700 text-white py-1 px-4 flex gap-2 items-center"
              onClick={handleNewMail}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
              New Mail
            </button>
          </div>
          <div className="w-72">
            <form onSubmit={submitSearch} className="flex items-center w-full">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    console.log(searchTerm);
                  }}
                  className="w-full pl-10 pr-4 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <input type="submit" hidden />
            </form>
          </div>
        </div>

        {/* Body Section */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-60 bg-white border-r overflow-y-auto">
            {emailAccounts.map((account) => (
              <div key={account.id} className="p-3">
                <button
                  onClick={() => toggleMenu(account.id)}
                  className="flex items-center w-full text-left p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRightIcon
                    className={`h-4 w-4 transform transition-transform ${
                      expandedMenus[account.id] ? "rotate-90" : ""
                    }`}
                  />
                  <span className="px-1 font-medium line-clamp-1">
                    {account.email}
                  </span>
                </button>

                {expandedMenus[account.id] && (
                  <div className="ml-4 mt-2">
                    <button
                      onClick={() => handleMailClick("inbox", account)}
                      className="flex items-center space-x-2 w-full px-1 py-2 hover:bg-gray-200 focus:bg-gray-200 transition duration-300 rounded-md"
                    >
                      <InboxIcon className="h-4 w-4" />
                      <span>Inbox</span>
                    </button>
                    <button className="flex items-center space-x-2 w-full px-1 py-2 hover:bg-gray-200 focus:bg-gray-200 transition duration-300 rounded-md">
                      <PencilSquareIcon className="h-4 w-4" />
                      <span>Drafts</span>
                    </button>
                    <button
                      onClick={() => handleMailClick("sent", account)}
                      className="flex items-center space-x-2 w-full px-1 py-2 hover:bg-gray-200 focus:bg-gray-200 transition duration-300 rounded-md"
                    >
                      <PaperAirplaneIcon className="h-4 w-4" />
                      <span>Sent</span>
                    </button>
                    <button className="flex items-center space-x-2 w-full px-1 py-2 hover:bg-gray-200 focus:bg-gray-200 transition duration-300 rounded-md">
                      <TrashIcon className="h-4 w-4" />
                      <span>Trash</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden gap-2">
            <div className="w-72 overflow-y-auto bg-white rounded-r-md shadow-sm">
              {selectedMails ? (
                selectedMails.map((mail) => (
                  <div
                    className="border-b-2 border-gray-300 flex cursor-pointer"
                    key={mail._id}
                    onClick={() => handleClickMail(mail)}
                  >
                    <div className="flex w-20 justify-end pl-3 pt-3">
                      <span className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                        {mail.from.charAt(0)}
                      </span>
                    </div>
                    <div className="px-2 pt-2 pb-1">
                      <h2 className="text-md font-normal mb-1 first-letter:capitalize">
                        {mail.from}
                      </h2>
                      <p className="text-sm text-gray-600 mb-2">
                        {mail.subject || "No Subject"}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {mail.body}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 pt-10 bg-gray-200 h-full">
                  Select an email to view its contents
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto rounded-r-md shadow-sm">
              {sendEmailData ? (
                <div className="flex flex-col h-full overflow-hidden gap-2 rounded-md">
                  <div className="flex bg-white justify-between px-3 py-2">
                    <button
                      className="bg-blue-600 rounded hover:bg-blue-700 text-white py-1 px-4 flex gap-2 items-center"
                      onClick={handleSubmit}
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                      Send Mail
                    </button>
                    <p className="text-md text-gray-600">
                      {sendEmailData.from}
                    </p>
                    <button className="rounded p-1 flex items-center cursor-pointer hover:bg-gray-100">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex flex-col bg-white px-3">
                    <div className="flex items-center gap-2 py-3">
                      <label className="w-fit">To:</label>
                      <input
                        type="text"
                        name="to"
                        value={sendEmailData.to}
                        onChange={handleChange}
                        className="w-full p-1 border-b-2 focus:border-blue-700 focus:outline-none transition duration-100"
                      />
                    </div>
                    <div className="flex items-center gap-2 py-3">
                      <label className="w-fit">Subject:</label>
                      <input
                        type="text"
                        name="subject"
                        value={sendEmailData.subject}
                        onChange={handleChange}
                        className="w-full p-1 border-b-2 focus:border-blue-700 focus:outline-none transition duration-100"
                      />
                    </div>
                    <div className="flex gap-2">
                      <label className="w-fit flex items-center py-3">
                        Attachments:
                      </label>
                      {sendEmailData.attachment && (
                        <label className="relative w-40 border-2 px-2 flex gap-2 items-center rounded border-gray-400">
                          <div>
                            <DocumentTextIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="line-clamp-1 text-sm ">
                              {sendEmailData.attachment.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {sendEmailData.attachment.name.includes(".docx")
                                ? "DOCX"
                                : "PDF"}
                            </p>
                          </div>
                        </label>
                      )}
                      <label className="flex-1 border-b-2 my-2 focus:border-blue-700 focus:outline-none transition duration-100">
                        <input
                          type="file"
                          accept=".pdf, .doc, .docx"
                          multiple
                          hidden
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex-1 rounded-md">
                    <textarea
                      name="message"
                      value={sendEmailData.message}
                      onChange={handleChange}
                      className="w-full h-full border-none focus:outline-none p-4 text-sm"
                    />
                  </div>
                </div>
              ) : selectMail ? (
                selectedMails
                  .filter(
                    (item) =>
                      item.subject == selectMail.subject &&
                      item.body == selectMail.body &&
                      item.from == item.from
                  )
                  .map((mail) => (
                    <div className="flex flex-col gap-2 h-full">
                      <div className="bg-white px-3 py-2 w-full rounded-sm shadow-sm">
                        <p className="font-medium">{mail.subject}</p>
                      </div>
                      <div className="flex-1 w-full flex flex-col bg-white rounded-sm shadow-sm">
                        <div className="border-b-2 border-gray-300 flex justify-between items-center p-3">
                          <div className="flex">
                            <div className="w-10 flex-shrink-0">
                              <span className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                {selectMail.from.charAt(0)}
                              </span>
                            </div>
                            <div className="px-2">
                              <p className="text-md text-gray-600">
                                {selectMail.from}
                              </p>
                              <p className="text-xs pt-1">
                                To: ({selectMail.to})
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-5">
                            <ArrowUturnLeftIcon className="h-5 w-5 text-pink-600 cursor-pointer" />
                            <ArrowUturnRightIcon className="h-5 w-5 text-blue-600 cursor-pointer" />
                            <EllipsisVerticalIcon className="h-5 w-5 cursor-pointer" />
                          </div>
                        </div>
                        {mail.attachments[0].path && (
                          <div className="border-b-2 border-gray-300 flex justify-between items-center p-3">
                            <a
                              target={"_blank"}
                              href={`${import.meta.PUBLIC_URL}/attachments/${mail.attachments[0].path}`}
                              className="text-blue-600"
                            >
                              {mail.attachments[0].filename}
                            </a>
                          </div>
                        )}

                        <div className="flex-1 p-6">{mail.body}</div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center text-gray-500 pt-10 bg-gray-200 h-full">
                  Select an email to view its contents
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mails;
