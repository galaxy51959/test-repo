import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  getNotionData,
  createNotionData,
  updateNotionData,
  deleteNotionData,
} from "../actions/notionAction";

export default function Schedule() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [notionData, setNotionData] = useState({
    databases: [],
    calendar: {
      events: [],
      upcoming: [],
    },
    tasks: [],
  });
  const [selectedEvent, setSelectedEvent] = useState({
    id: "",
    title: "",
    created_At: "",
    end: "",
    state: "",
  });
  const [createdEvent, setCreatedEvent] = useState({
    title: "",
    created_At: "",
    due_At: "",
  });
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Sample data - Replace with actual Notion API calls
  const sampleDatabases = [
    { id: 1, name: "Student Records", lastSync: "2024-03-20" },
    { id: 2, name: "Assessment Tracking", lastSync: "2024-03-19" },
    { id: 3, name: "Report Templates", lastSync: "2024-03-18" },
  ];

  const sampleEvents = [
    {
      id: 1,
      title: "Student Assessment",
      date: "2024-03-25",
      time: "10:00 AM",
    },
    { id: 2, title: "Parent Meeting", date: "2024-03-26", time: "2:30 PM" },
    { id: 3, title: "Report Review", date: "2024-03-27", time: "11:00 AM" },
  ];

  // Sample calendar events
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Student Assessment",
      start: "2025-03-25",
      end: "2025-03-25",
      backgroundColor: "#3B82F6",
      borderColor: "#2563EB",
    },
    {
      id: "2",
      title: "Parent Meeting",
      start: "2025-03-26",
      end: "2025-03-26",
      backgroundColor: "#10B981",
      borderColor: "#059669",
    },
  ]);

  useEffect(() => {
    fetchNotionData();
  }, []);

  const fetchNotionData = async () => {
    console.log("fetch");
    setLoading(true);
    const data = await getNotionData();
    console.log(data);
    const tasks = data.map((page) => {
      return {
        id: page.id,
        created_time: page.created_time,
        title: page.properties["Task name"].title[0].plain_text,
        start: page.properties.Due?.date?.start,
        end: page.properties.Due?.date?.end,
        state: page.properties.Status.status.name,
        backgroundColor: "#3B82F6",
        borderColor: "#2563EB",
        // Add other properties as needed
      };
    });
    setEvents(tasks);
    try {
      // Simulate API call
      setTimeout(() => {
        setNotionData({
          databases: sampleDatabases,
          calendar: {
            events: sampleEvents,
            upcoming: sampleEvents.slice(0, 2),
          },
          tasks: [],
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching Notion data:", error);
      setLoading(false);
    }
  };

  const handleDateSelect = (selectInfo) => {
    if (selectInfo.jsEvent && selectInfo.jsEvent.button === 0) {
      const newEvent = {
        title: "New Task",
        created_time: new Date().toISOString(),
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      };
      setCreatedEvent(newEvent);
      setSelectedEvent(null);
      setShowSidebar(true);
    }
  };

  const handleEventClick = (clickInfo) => {
    if (clickInfo.jsEvent.button === 0) {
      clickInfo.jsEvent.preventDefault();
      const event = events.find((event) => event.id == clickInfo.event.id);
      setSelectedEvent(event);
      setCreatedEvent(null);
      setShowSidebar(true);
    }
  };

  const handleEventRightClick = (info) => {
    // info.jsEvent.preventDefault();
    setSelectedEventId(info.event.id);
    setShowDeleteModal(true);
  };

  const handleDeleteEvent = async () => {
    deleteNotionData(selectedEventId);
    await fetchNotionData();
    setShowDeleteModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6 space-y-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/reports")}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold">Notion Integration</h1>
        </div>
        <button
          onClick={fetchNotionData}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          Sync with Notion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Databases Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Notion Databases</h2>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <PlusIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="space-y-4">
            {notionData.databases.map((db) => (
              <div
                key={db.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="font-medium">{db.name}</span>
                </div>
                <span className="text-sm text-gray-500">
                  Last synced: {new Date(db.lastSync).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Notion Calendar</h2>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <CalendarIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="space-y-4">
            {notionData.calendar.events.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{event.title}</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {event.date}
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {event.time}
                </div>
              </div>
            ))}
          </div>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            // eventContent={renderEventContent}
            eventDidMount={(info) => {
              info.el.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                handleEventRightClick(info);
              });
            }}
            height="auto"
            className="notion-calendar-content"
          />
        </div>
      </div>

      {/* Sync Status */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-6">Sync Status</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-green-600 font-medium">Databases</div>
            <div className="text-2xl font-bold text-green-700">
              {notionData.databases.length}
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-600 font-medium">Calendar Events</div>
            <div className="text-2xl font-bold text-blue-700">
              {notionData.calendar.events.length}
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-purple-600 font-medium">Last Sync</div>
            <div className="text-sm font-medium text-purple-700">
              {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {/* {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 transition-opacity z-40"
          onClick={() => setShowSidebar(false)}
        />
      )} */}

      {/* Notion-like Sidebar */}
      {showSidebar && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto z-50">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {selectedEvent ? "Edit Event" : "New Event"}
              </h2>
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {selectedEvent ? (
                // Edit Event Form
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={selectedEvent.title}
                      onChange={(e) =>
                        setSelectedEvent({
                          ...selectedEvent,
                          title: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Created At
                    </label>
                    <input
                      type="datetime-local"
                      value={selectedEvent.created_time?.slice(0, 16) || ""}
                      onChange={(e) =>
                        setSelectedEvent({
                          ...selectedEvent,
                          created_time: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Start At
                    </label>
                    <input
                      type="datetime"
                      value={selectedEvent.start?.slice(0, 16) || ""}
                      onChange={(e) =>
                        setSelectedEvent({
                          ...selectedEvent,
                          start: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      End At
                    </label>
                    <input
                      type="datetime"
                      value={selectedEvent.end?.slice(0, 16) || ""}
                      onChange={(e) =>
                        setSelectedEvent({
                          ...selectedEvent,
                          end: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <select
                      value={selectedEvent.state || "todo"}
                      onChange={(e) =>
                        setSelectedEvent({
                          ...selectedEvent,
                          state: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Not started">To Do</option>
                      <option value="In progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </>
              ) : (
                // New Event Form
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      value={createdEvent.title}
                      onChange={(e) =>
                        setCreatedEvent({
                          ...createdEvent,
                          title: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Created Time
                    </label>
                    <input
                      type="datetime-local"
                      value={createdEvent.created_time?.slice(0, 16) || ""}
                      onChange={(e) =>
                        setCreatedEvent({
                          ...createdEvent,
                          created_time: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Start
                    </label>
                    <input
                      type="datetime"
                      value={createdEvent.start?.slice(0, 16) || ""}
                      onChange={(e) =>
                        setCreatedEvent({
                          ...createdEvent,
                          start: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      End
                    </label>
                    <input
                      type="datetime"
                      value={createdEvent.end?.slice(0, 16) || ""}
                      onChange={(e) =>
                        setCreatedEvent({
                          ...createdEvent,
                          end: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </>
              )}

              <button
                onClick={async () => {
                  if (selectedEvent) {
                    // Update existing event
                    const response = await updateNotionData(selectedEvent);
                    alert(response.message);
                    fetchNotionData();
                  } else {
                    // Create new event
                    const response = createNotionData(createdEvent);
                    alert(response.message);
                    fetchNotionData();
                  }
                  setShowSidebar(false);
                }}
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {selectedEvent ? "Update Event" : "Create Event"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Delete Event</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
