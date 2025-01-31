const Calendar = require('../models/Calendar');
const { Client } = require('@notionhq/client');
const notion = new Client({
    auth: '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',
});
const databaseId = '123d34b2ab098066a485e51f116dedfc';

const createEvents = async (req, res) => {
    console.log(req.body.priority);
    try {
        if (!req.body.title || !req.body.start) {
            throw new Error("Missing required fields: 'title' or 'start'");
        }
        if (req.body.end == '') {
            req.body.end = null;
        }
        // Call the Notion API to create a new page
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            created_time: req.body.created_time,
            properties: {
                // Task Name (title)
                'Task name': {
                    title: [
                        {
                            text: {
                                content: req.body.title, // The task title
                            },
                        },
                    ],
                },
                // Due Date (start and end dates)
                Due: {
                    date: {
                        start: req.body.start, // Example: "2025-01-30"
                        end: req.body.end, // Optional: Example: "2025-01-31"
                    },
                },
                Status: {
                    status: {
                        name: 'Not started',
                    },
                },
                Summary: {
                    rich_text: [
                        {
                            text: {
                                content: req.body.summary,
                            },
                        },
                    ],
                },

                Priority: {
                    select: {
                        id: req.body.priority[0],
                    },
                },
            },
        });
        res.status(200).send({
            message: 'Task created successfully',
            data: response,
        });
    } catch (error) {
        console.error('Error creating page:', error.message);
        res.status(400).send({ error: error.message || error.body });
    }
};

const updateEvents = async (req, res) => {
    try {
        console.log(req.body);
        // Validate the input to ensure `pageId`, `title`, or `start` are present
        if (!req.params.pageid) {
            throw new Error("Missing required field: 'pageId'");
        }
        if (!req.body.title && !req.body.start) {
            throw new Error(
                "You must provide at least one field to update: 'title' or 'start'"
            );
        }
        if (req.body.end == '') {
            req.body.end = null;
        }
        const { title, start, end, state } = req.body;
        console.log(req.body);
        const pageId = req.params.pageid;
        // Prepare the properties to update
        const properties = {};

        // Update the title if provided
        if (title) {
            properties['Task name'] = {
                title: [
                    {
                        text: {
                            content: title, // The updated task title
                        },
                    },
                ],
            };
            properties['Summary'] = {
                rich_text: [
                    {
                        text: {
                            content: req.body.summary,
                        },
                    },
                ],
            };
            properties['Priority'] = {
                select: {
                    id: req.body.priority,
                },
            };
        }

        // Update the due date if provided
        if (start) {
            properties['Due'] = {
                date: {
                    start: start, // The updated start date
                    end: end || null, // Optional end date
                },
            };
        }
        if (state) {
            properties['Status'] = {
                status: {
                    name: state, // The updated status (e.g., "To Do", "In Progress", "Completed")
                },
            };
        }

        // Call the Notion API to update the page
        const response = await notion.pages.update({
            page_id: pageId, // The ID of the page to update
            properties: properties, // The properties to update
        });

        console.log('Page updated successfully:', response);
        res.status(200).send({
            message: 'Task updated successfully',
            data: response,
        });
    } catch (error) {
        console.error('Error updating page:', error.message);
        res.status(400).send({ error: error.message || error.body });
    }
};

const deleteEvents = async (req, res) => {
    try {
        const pageId = req.params.pageid;
        const response = await notion.blocks.delete({ block_id: pageId });
        console.log('Deleted page:', pageId);
        res.status(200).send({
            message: 'Task updated successfully',
            data: response,
        });
    } catch (error) {
        console.error('Error deleting page:', error.message);
        res.status(400).send({ error: error.message || error.body });
    }
};

const getEvents = async (req, res) => {
    console.log('gettting');
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
        });
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

module.exports = {
    createEvents,
    getEvents,
    getEventById,
    updateEvents,
    deleteEvents,
};
