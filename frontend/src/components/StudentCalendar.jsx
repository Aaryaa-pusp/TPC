import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Megaphone, MonitorPlay, Calendar as CalendarIcon } from 'lucide-react';
import axios from 'axios';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const StudentCalendar = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No authentication token found');

                const response = await axios.get('http://localhost:5000/api/student/calendar', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Map backend strings back to Date objects for Big Calendar
                const formattedEvents = response.data.calendar.map(ev => {
                    const startDate = new Date(ev.start);
                    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
                    console.log(startDate, endDate);
                    return {
                        ...ev,
                        start: startDate,
                        end: endDate
                    };
                });
                setEvents(formattedEvents);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch calendar:', err);
                setError('Could not load calendar data.');
                setLoading(false);
            }
        };

        fetchCalendar();
    }, []);

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
    };

    const closeDrawer = () => {
        setSelectedEvent(null);
    };

    const getEventIcon = (type) => {
        switch (type) {
            case 'internship': return <Briefcase className="w-5 h-5" />;
            case 'placement_drive': return <Briefcase className="w-5 h-5" />;
            case 'announcement': return <Megaphone className="w-5 h-5" />;
            case 'workshop': return <MonitorPlay className="w-5 h-5" />;
            default: return <CalendarIcon className="w-5 h-5" />;
        }
    };

    const eventPropGetter = (event) => {
        return {
            style: {
                backgroundColor: event.color,
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    if (loading) return <div className="p-4">Loading calendar...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen">
            <div className="flex h-[calc(100vh-100px)] w-full overflow-hidden bg-gray-50 relative">

                {/* Calendar Section */}
                <motion.div
                    animate={{ width: selectedEvent ? '65%' : '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="h-full p-4 bg-white shadow-sm rounded-lg"
                >
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 'calc(100vh - 200px)' }}
                        defaultDate={new Date(2026, 2, 3)}
                        onSelectEvent={handleSelectEvent}
                        eventPropGetter={eventPropGetter}
                        views={['month', 'week', 'agenda']}
                        popup={true}
                    />
                </motion.div>

                {/* Drawer Section */}
                <AnimatePresence>
                    {selectedEvent && (
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="absolute right-0 top-0 w-[35%] h-full bg-white shadow-xl border-l border-gray-200 p-6 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center space-x-2 text-gray-700">
                                    {getEventIcon(selectedEvent.type)}
                                    <span className="font-semibold uppercase text-sm tracking-wider">
                                        {selectedEvent.type.replace('_', ' ')}
                                    </span>
                                </div>
                                <button
                                    onClick={closeDrawer}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedEvent.title}</h2>

                            <div className="space-y-4 text-gray-600 mb-8">
                                <div className="flex items-center space-x-2">
                                    <CalendarIcon className="w-4 h-4" />
                                    <span>{format(new Date(selectedEvent.start), 'PPPp')}</span>
                                </div>

                                <div className="prose prose-sm">
                                    <h3 className="font-semibold text-gray-800">Description</h3>
                                    <p>{selectedEvent.extendedProps.description || selectedEvent.extendedProps.content}</p>
                                </div>

                                {selectedEvent.extendedProps.deadline && (
                                    <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-100">
                                        <span className="font-semibold">Deadline: </span>
                                        {format(new Date(selectedEvent.extendedProps.deadline), 'PPP')}
                                    </div>
                                )}
                            </div>

                            {selectedEvent.type === 'internship' && (
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center space-x-2">
                                    <span>Apply for Internship</span>
                                </button>
                            )}

                            {selectedEvent.type === 'placement_drive' && (
                                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm flex items-center justify-center space-x-2">
                                    <span>Apply for Placement</span>
                                </button>
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StudentCalendar;
