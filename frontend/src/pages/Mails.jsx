import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ChevronRightIcon,
  InboxIcon,
  PencilSquareIcon,
  PaperAirplaneIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  getEmailsByAccount,
  sendEmails,
  getEmails,
} from "../actions/emailActions";
import { Modal, Button, Form, Container } from "react-bootstrap";
import { FaPlus, FaPaperPlane, FaPaperclip } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Mails = () => {
  const [selectedMail, setSelectedMail] = useState(null);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedMails, setSelectedMails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sendEmailData, setSendEmailData] = useState({
    from: "",
    to: "",
    subject: "",
    message: "",
    attachment: null,
  });

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

  const handleClose = () => setShowModal(false);
  const handleShow = () => {
    if (selectedMail != null) {
      setSendEmailData({ ...sendEmailData, from: selectedMail.email });
    } else {
      setSendEmailData({
        ...sendEmailData,
        from: "alexis.cartetr@provider.presence.com",
      });
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSendEmailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setSendEmailData((prev) => ({
      ...prev,
      attachment: e.target.files[0],
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
    try {
      // Send the email with attachment
      const n8nLink =
        "https://aec.app.n8n.cloud/webhook-test/2f137679-6041-4c14-ba16-305ff69e0fba";
      const response = await sendEmails(n8nLink, formData);
      if (!response.error) {
        handleClose();
        alert("send Email successfully"); // Show success message
      }
    } catch (error) {
      console.error("Failed to send email:", error);
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
          <h1 className="pl-4 text-xl font-semibold">Mail</h1>
          <form
            onSubmit={submitSearch}
            className="flex items-center max-w-md w-full"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  console.log(searchTerm);
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
          </form>
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
                      onClick={() => handleMailClick("inbox", account)}
                      className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <InboxIcon className="h-4 w-4" />
                      <span>Inbox</span>
                    </button>
                    <button className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded-lg">
                      <PencilSquareIcon className="h-4 w-4" />
                      <span>Drafts</span>
                    </button>
                    <button
                      onClick={() => handleMailClick("sent", account)}
                      className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded-lg"
                    >
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
            {selectedMails ? (
              selectedMails.map((mail) => (
                <div className="bg-white shadow p-6 mb-4" key={mail._id}>
                  <h2 className="text-xl font-semibold mb-4">{mail.subject}</h2>
                  <div className="text-sm text-gray-600 mb-2">
                    From: {mail.from}
                  </div>
                  {mail.attachments.map((file) => (
                    <a
                      key={file.filename}
                      className="text-sm text-gray-600 mb-4"
                      href={`http://localhost:5000/reports/${file.path}`}
                      target="_blank"
                    >
                      {file.filename}
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
            {/* {searchTerm != "" && selectedMails.length === 0  (
                <div className="text-center text-gray-500 pt-10">
                    No emails found matching your search
                </div>
            )} */}
          </div>
        </div>

        {/* New Mail Button */}
        <button
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          onClick={handleShow}
        >
          <FaPlus className="h-6 w-6" />
        </button>

        {/* Email Composition Modal */}
        <Modal
          show={showModal}
          onHide={handleClose}
          size="md"
          aria-labelledby="email-compose-modal"
          centered
          style={{ zIndex: 1050 }}
        >
          <Modal.Header closeButton className="bg-gray-50">
            <Modal.Title id="email-compose-modal">New Message</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>From:</Form.Label>
                <Form.Control
                  type="email"
                  name="from"
                  value={sendEmailData.from}
                  onChange={handleChange}
                  disabled
                  className="bg-gray-50"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>To:</Form.Label>
                <Form.Control
                  type="email"
                  name="to"
                  value={sendEmailData.to}
                  onChange={handleChange}
                  placeholder="recipient@example.com"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Subject:</Form.Label>
                <Form.Control
                  type="text"
                  name="subject"
                  value={sendEmailData.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Message:</Form.Label>
                <ReactQuill
                  theme="snow"
                  value={sendEmailData.message}
                  onChange={(content) => {
                    setSendEmailData((prev) => ({
                      ...prev,
                      message: content,
                    }));
                  }}
                  style={{ height: "200px", marginBottom: "50px" }}
                  modules={{
                    toolbar: [
                      ["bold", "italic", "underline"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link"],
                      ["clean"],
                    ],
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="cursor-pointer">
                  <div className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                    <FaPaperclip />
                    <span>Attach File</span>
                  </div>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </Form.Label>
                {sendEmailData.attachment && (
                  <div className="mt-2 text-sm text-gray-600">
                    Attached: {sendEmailData.attachment.name}
                  </div>
                )}
              </Form.Group>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="d-flex align-items-center gap-2"
                >
                  <FaPaperPlane /> Send
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default Mails;
