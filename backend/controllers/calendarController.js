const Calendar = require('../models/Calendar');
const { Client } = require('@notionhq/client');
const notion = new Client({
    auth: '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',
});
const databaseId = '123d34b2ab098066a485e51f116dedfc';
const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            startTime,
            endTime,
            type,
            attendees,
            studentId,
            location,
            reminders,
        } = req.body;

        // Create event in Google Calendar
        const googleEvent = await GoogleCalendarService.createEvent({
            title,
            description,
            startTime,
            endTime,
            attendees,
            location,
        });

        // Create local calendar entry
        const calendarEvent = new Calendar({
            title,
            description,
            startTime,
            endTime,
            type,
            attendees,
            student: studentId,
            location,
            reminders,
            createdBy: req.user.id,
            googleEventId: googleEvent.id,
        });

        await calendarEvent.save();
        res.status(201).json(calendarEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// const getEvents = async (req, res) => {
//     try {
//         const { start, end, type } = req.query;
//         const query = {};

//         if (start && end) {
//             query.startTime = { $gte: new Date(start) };
//             query.endTime = { $lte: new Date(end) };
//         }

//         if (type) {
//             query.type = type;
//         }

//         const events = await Calendar.find(query)
//             .populate('student', 'firstName lastName')
//             .populate('createdBy', 'name');

//         res.json(events);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
const getEvents = async (req, res) => {
    console.log('Hello');
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
        });
        console.log(response.results);
        // const events = response.results.map((page) => {
        //     const dateProperty = page.properties.Name.title;
        //     const startDate = page.properties.Attendees.people;
        //     // const endDate = dateProperty.date.end; // Optional

        //     return {
        //         dataProperty: dateProperty,
        //         startDate: startDate, // Optional
        //         // Add other relevant properties
        //     };
        // });
        // console.log(events);
        res.json(response.results);
        //return events;
    } catch (error) {
        console.log('ERROR', error);
        res.status(500).json({ message: error.message });
    }
};
const getEventById = async (req, res) => {
    try {
        const event = await Calendar.findById(req.params.id)
            .populate('student')
            .populate('createdBy', 'name');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const event = await Calendar.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Update in Google Calendar
        if (event.googleEventId) {
            await GoogleCalendarService.updateEvent(
                event.googleEventId,
                req.body
            );
        }

        Object.assign(event, req.body);
        await event.save();
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Calendar.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Delete from Google Calendar
        if (event.googleEventId) {
            await GoogleCalendarService.deleteEvent(event.googleEventId);
        }

        await event.remove();
        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
};
