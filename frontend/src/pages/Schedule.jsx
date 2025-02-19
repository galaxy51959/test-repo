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
import { toast } from "react-hot-toast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
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
  const [selectedEvent, setSelectedEvent] = useState({});
  const [createdEvent, setCreatedEvent] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [events, setEvents] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showTypeModal, setShowTypeModal] = useState(false);

  useEffect(() => {
    fetchNotionData();
  }, []);

  const fetchNotionData = async () => {
    try {
      setLoading(true);
      const data = await getNotionData();
      const tasks = data.tasks.map((page) => {
        return {
          key: "tasks",
          id: page.id,
          created_time: page.created_time,
          title: page.properties["Task name"]?.title[0]?.plain_text,
          start: page.properties.Due?.date?.start,
          end: page.properties.Due?.date?.end,
          state: page.properties.Status.status.name,
          backgroundColor: "#62d743bd",
          borderColor: "#62d743bd",
          summary: page.properties.Summary?.rich_text[0]?.plain_text,
          priority: page.properties.Priority?.select?.id,
          // Add other properties as needed
        };
      });

      const meetings = data.meetings.map((page) => {
        return {
          key: "meetings",
          id: page.id,
          created_time: page.created_time,
          title: page.properties["Name"]?.title[0]?.plain_text,
          start: page.properties["Event time"]?.date?.start,
          end: page.properties["Event time"]?.date?.end,
          Type: page.properties?.Type?.select?.name,
          url: page.url,
          backgroundColor: "#d74343bd",
          borderColor: "#d74343bd",
          // Add other properties as needed
        };
      });
      const newArray = tasks.concat(meetings);
      setEvents(newArray);
    } catch (error) {
      console.error("Error fetching Notion data:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const handleTypeSelect = (type) => {
    setSelectedType(type);
    if (type == "task") {
      const newTask = {
        key: "task",
        title: "New Task",
        created_time: new Date().toISOString(),
        start: selectedEvent.startStr,
        end: selectedEvent.endStr,
        priority: "priority_low",
      };

      setCreatedEvent(newTask);
      setSelectedEvent(null);
      setShowSidebar(true);
    } else if (type == "meet") {
      const newMeet = {
        key: "meet",
        title: "New Meet",
        created_time: new Date().toISOString(),
        start: selectedEvent.startStr,
        end: selectedEvent.endStr,
        Type: "Training",
      };

      setCreatedEvent(newMeet);
      setSelectedEvent(null);
      setShowSidebar(true);
    }
    setShowTypeModal(false);
    setShowSidebar(true);
  };
  const handleDateSelect = (selectInfo) => {
    if (selectInfo.jsEvent && selectInfo.jsEvent.button === 0) {
      setShowTypeModal(true);
      setSelectedEvent(selectInfo);

      // toast.success(`${selectedType === 'meet' ? 'Meeting' : 'Task'} scheduled successfully!`);
      // handleClose();
    }
  };

  const handleClose = () => {
    setShowSidebar(false);
    setShowTypeModal(false);
    setSelectedType(null);
    setCreatedEvent(null);
    setSelectedEvent(null);
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
    const response = deleteNotionData(selectedEventId);
    if (response) fetchNotionData();
    setShowDeleteModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50  p-6 space-y-8 relative">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div>
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

          <div className="flex">
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
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: "#d74343bd" }}
                  ></div>
                  <span className="text-sm">Meetings</span>
                </div>
                <div className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: "#62d743bd" }}
                  ></div>
                  <span className="text-sm">Tasks</span>
                </div>
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
                <div className="text-2xl font-bold text-green-700">2</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-blue-600 font-medium">Calendar Events</div>
                <div className="text-2xl font-bold text-blue-700">
                  {events && events.length}
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
          {/* Type Selection Modal */}
          {showTypeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-80">
                <h2 className="text-xl font-semibold mb-4">
                  Select Event Type
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => handleTypeSelect("meet")}
                    className="w-full py-3 px-4 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-800 font-medium transition-colors"
                  >
                    Meeting
                  </button>
                  <button
                    onClick={() => handleTypeSelect("task")}
                    className="w-full py-3 px-4 bg-green-100 hover:bg-green-200 rounded-lg text-green-800 font-medium transition-colors"
                  >
                    Task
                  </button>
                </div>
              </div>
            </div>
          )}

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
                <div className="space-y-6"></div>
                {selectedEvent ? (
                  selectedEvent.key == "tasks" ? (
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
                          value={selectedEvent.created_time.slice(0, 16) || ""}
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
                          Summary
                        </label>
                        <textarea
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          rows="4"
                          value={selectedEvent.summary}
                          onChange={(e) =>
                            setSelectedEvent({
                              ...selectedEvent,
                              summary: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Priority
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          value={selectedEvent.priority}
                          onChange={(e) =>
                            setSelectedEvent({
                              ...selectedEvent,
                              priority: e.target.value,
                            })
                          }
                        >
                          <option value="priority_low" className="text-red-500">
                            low
                          </option>
                          <option
                            value="priority_medium"
                            className="text-green-500"
                          >
                            middle
                          </option>
                          <option
                            value="priority_high"
                            className="text-blue-500"
                          >
                            high
                          </option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Start At
                        </label>
                        <input
                          type="datetime"
                          value={selectedEvent?.start?.slice(0, 16) || ""}
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
                    // Edit Event Form meeting
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
                          Type
                        </label>

                        <select
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          value={selectedEvent.Type}
                          onChange={(e) =>
                            setSelectedEvent({
                              ...selectedEvent,
                              Type: e.target.value,
                            })
                          }
                        >
                          <option value="Standup" className="text-red-500">
                            Stand Up
                          </option>

                          <option value="BrainStorm" className="text-green-500">
                            BrainStorm
                          </option>

                          <option value="Team weekly" className="text-blue-500">
                            Team weekly
                          </option>

                          <option value="Training" className="text-pink-500">
                            Training
                          </option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Start At
                        </label>
                        <input
                          type="datetime"
                          value={selectedEvent?.start?.slice(0, 16) || ""}
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
                    </>
                  )
                ) : selectedType == "task" ? (
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
                        // onChange={(e) =>
                        //   setCreatedEvent({
                        //     ...createdEvent,
                        //     created_time: e.target.value,
                        //   })
                        // }
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Summary
                      </label>
                      <textarea
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        rows="4"
                        value={createdEvent.summary}
                        onChange={(e) =>
                          setCreatedEvent({
                            ...createdEvent,
                            summary: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Priority
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={createdEvent.priority}
                        onChange={(e) => {
                          setCreatedEvent({
                            ...createdEvent,
                            priority: Array.from(
                              e.target.selectedOptions,
                              (option) => option.value
                            )[0],
                          });
                        }}
                      >
                        <option value="priority_low" className="text-red-500">
                          low
                        </option>
                        <option
                          value="priority_medium"
                          className="text-green-500"
                        >
                          middle
                        </option>
                        <option value="priority_high" className="text-blue-500">
                          high
                        </option>
                      </select>
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
                ) : (
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
                        // onChange={(e) =>
                        //   setCreatedEvent({
                        //     ...createdEvent,
                        //     created_time: e.target.value,
                        //   })
                        // }
                        className="w-full p-2 border rounded-md"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={createdEvent.Type}
                        onChange={(e) => {
                          setCreatedEvent({
                            ...createdEvent,
                            Type: Array.from(
                              e.target.selectedOptions,
                              (option) => option.value
                            ),
                          });
                        }}
                      >
                        <option value="Standup" className="text-red-500">
                          Stand Up
                        </option>

                        <option value="BrainStorm" className="text-green-500">
                          BrainStorm
                        </option>

                        <option value="Team weekly" className="text-blue-500">
                          Team weekly
                        </option>

                        <option value="Training" className="text-pink-500">
                          Training
                        </option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={createdEvent.startTime}
                          onChange={(e) =>
                            setCreatedEvent({
                              ...createdEvent,
                              startTime: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

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
                      if (response) fetchNotionData();
                    } else {
                      // Create new event
                      let startDateTime = "";
                      if (createdEvent.startTime) {
                        startDateTime = new Date(
                          `${createdEvent.start}T${createdEvent.startTime}`
                        );
                      } else {
                        startDateTime = new Date(`${createdEvent.start}`);
                      }
                      const created_Event = {
                        ...createdEvent,
                        startDateTime: startDateTime,
                      };
                      setCreatedEvent({
                        ...createdEvent,
                        startDateTime: startDateTime,
                      });
                      const response = await createNotionData(created_Event);
                      if (response) fetchNotionData();
                    }
                    setShowSidebar(false);
                  }}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {selectedEvent ? "Update Event" : "Create Event"}
                </button>
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
      )}
    </div>
  );
}
