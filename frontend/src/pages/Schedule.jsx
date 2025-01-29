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
} from "@heroicons/react/24/outline";

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
      start: "2024-03-25T10:00:00",
      end: "2024-03-25T11:30:00",
      backgroundColor: "#3B82F6",
      borderColor: "#2563EB",
    },
    {
      id: "2",
      title: "Parent Meeting",
      start: "2024-03-26T14:30:00",
      end: "2024-03-26T15:30:00",
      backgroundColor: "#10B981",
      borderColor: "#059669",
    },
  ]);

  useEffect(() => {
    fetchNotionData();
  }, []);

  const fetchNotionData = async () => {
    setLoading(true);
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
    const title = prompt("Please enter a new title for your event");
    if (title) {
      const newEvent = {
        id: String(Date.now()),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        backgroundColor: "#3B82F6",
        borderColor: "#2563EB",
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleEventClick = (clickInfo) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
      setEvents(events.filter((event) => event.id !== clickInfo.event.id));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6 space-y-8">
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

      {/* New Calendar Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Calendar</h2>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              Month
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              Week
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              Day
            </button>
          </div>
        </div>

        <div className="notion-calendar">
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
            height="auto"
            className="notion-calendar-content"
          />
        </div>
      </div>
    </div>
  );
}
