import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaHiking, FaUtensils, FaCar, FaBed, FaShuttleVan, FaClock } from 'react-icons/fa';
import Image from 'next/image';

const localizer = momentLocalizer(moment);

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    type: 'hiking' | 'lunch' | 'dinner' | 'atv' | 'hotel' | 'pickup';
    color: string;
}

export const EVENT_COLORS = {
    hiking: '#5389DF',    // Royal Blue
    lunch: '#F43E62',     // Coral Red
    dinner: '#F43E62',    // Coral Red
    atv: '#5389DF',       // Royal Blue
    hotel: '#FEE562',     // Gold
    pickup: '#FEE562'     // Gold
};


interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
    type: 'hiking' | 'lunch' | 'dinner' | 'atv' | 'hotel' | 'pickup';
    color: string;
}

export default function ItineraryCalendar() {
    // Sample events
    const [events] = useState<any[]>(() => {
        const today = new Date();
        const currentWeekMonday = new Date(today);
        currentWeekMonday.setDate(today.getDate() - today.getDay());

        const mondayEvents = [
            {
                id: 'mon-1',
                title: 'Airport Pickup',
                start: new Date(new Date(currentWeekMonday).setHours(1, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(5, 0, 0)),
                type: 'pickup',
                color: EVENT_COLORS.pickup
            },
            {
                id: 'mon-2',
                title: 'Hotel Check-in',
                start: new Date(new Date(currentWeekMonday).setHours(10, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(11, 0, 0)),
                type: 'hotel',
                color: EVENT_COLORS.hotel
            },
            {
                id: 'mon-3',
                title: 'Welcome Lunch',
                start: new Date(new Date(currentWeekMonday).setHours(12, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(13, 30, 0)),
                type: 'lunch',
                color: EVENT_COLORS.lunch
            },
            {
                id: 'mon-4',
                title: 'Welcome Lunch',
                start: new Date(new Date(currentWeekMonday).setHours(14, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(15, 30, 0)),
                type: 'lunch',
                color: EVENT_COLORS.lunch
            },
            {
                id: 'mon-5',
                title: 'Welcome Lunch',
                start: new Date(new Date(currentWeekMonday).setHours(16, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(17, 30, 0)),
                type: 'lunch',
                color: EVENT_COLORS.lunch   
            },
            {
                id: 'mon-6',
                title: 'Welcome Lunch',
                start: new Date(new Date(currentWeekMonday).setHours(18, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(19, 30, 0)),
                type: 'lunch',
                color: EVENT_COLORS.lunch
            }
        ];

        const tuesdayEvents = [
            {
                id: 'tue-1',
                title: 'Morning Yoga',
                start: new Date(new Date(currentWeekMonday).setHours(24 + 2, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(24 + 4, 30, 0)),
                type: 'hiking',
                color: EVENT_COLORS.hiking
            },
            {
                id: 'tue-2',
                title: 'Mountain Trek',
                start: new Date(new Date(currentWeekMonday).setHours(24 + 10, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(24 + 14, 0, 0)),
                type: 'hiking',
                color: EVENT_COLORS.hiking
            },
            {
                id: 'tue-3',
                title: 'Sunset Dinner',
                start: new Date(new Date(currentWeekMonday).setHours(24 + 18, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(24 + 20, 0, 0)),
                type: 'dinner',
                color: EVENT_COLORS.dinner
            },
            {
                id: 'tue-4',
                title: 'Sunset Dinner',
                start: new Date(new Date(currentWeekMonday).setHours(24 + 22, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(24 + 23, 0, 0)),
                type: 'dinner',
                color: EVENT_COLORS.dinner  
            },
            
        ];

        const wednesdayEvents = [
            {
                id: 'wed-1',
                title: 'ATV Adventure',
                start: new Date(new Date(currentWeekMonday).setHours(48 + 1, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(48 + 3, 0, 0)),
                type: 'atv',
                color: EVENT_COLORS.atv
            },
            {
                id: 'wed-2',
                title: 'Picnic Lunch',
                start: new Date(new Date(currentWeekMonday).setHours(48 + 13, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(48 + 14, 30, 0)),
                type: 'lunch',
                color: EVENT_COLORS.lunch
            },
            {
                id: 'wed-3',
                title: 'Night Safari',
                start: new Date(new Date(currentWeekMonday).setHours(48 + 16, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(48 + 18, 0, 0)),
                type: 'hiking',
                color: EVENT_COLORS.hiking
            },
            {
                id: 'wed-4',
                title: 'Night Safari',
                start: new Date(new Date(currentWeekMonday).setHours(48 + 20, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(48 + 22, 0, 0)),
                type: 'hiking',
                color: EVENT_COLORS.hiking
            }
        ];

        const thursdayEvents = [
            {
                id: 'thu-1',
                title: 'Waterfall Hike',
                start: new Date(new Date(currentWeekMonday).setHours(72 + 8, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(72 + 11, 0, 0)),
                type: 'hiking',
                color: EVENT_COLORS.hiking
            },
            {
                id: 'thu-2',
                title: 'Local Restaurant',
                start: new Date(new Date(currentWeekMonday).setHours(72 + 12, 30, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(72 + 14, 0, 0)),
                type: 'lunch',
                color: EVENT_COLORS.lunch
            },
            {
                id: 'thu-3',
                title: 'Hotel Transfer',
                start: new Date(new Date(currentWeekMonday).setHours(72 + 16, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(72 + 17, 0, 0)),
                type: 'pickup',
                color: EVENT_COLORS.pickup
            },
            {
                id: 'thu-4',
                title: 'Hotel Transfer',
                start: new Date(new Date(currentWeekMonday).setHours(72 + 19, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(72 + 23, 0, 0)),
                type: 'pickup',
                color: EVENT_COLORS.pickup, 
            },
          
        ];

        const fridayEvents = [

            {
                id: 'fri-4',
                title: 'Beachside Dinner',
                start: new Date(new Date(currentWeekMonday).setHours(96 + 1, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(96 + 3, 0, 0)),
                type: 'dinner',
                color: EVENT_COLORS.dinner
                },
            {
                id: 'fri-1',
                title: 'Beach Trek',
                start: new Date(new Date(currentWeekMonday).setHours(96 + 7, 30, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(96 + 10, 0, 0)),
                type: 'hiking',
                color: EVENT_COLORS.hiking
            },
            {
                id: 'fri-2',
                title: 'ATV Beach Ride',
                start: new Date(new Date(currentWeekMonday).setHours(96 + 14, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(96 + 16, 0, 0)),
                type: 'atv',
                color: EVENT_COLORS.atv
            },
            {
                id: 'fri-3',
                title: 'Beachside Dinner',
                start: new Date(new Date(currentWeekMonday).setHours(96 + 19, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(96 + 21, 0, 0)),
                type: 'dinner',
                color: EVENT_COLORS.dinner
                },
           
        ];

        const saturdayEvents = [
            {
                id: 'sat-1',
                title: 'Sunrise Yoga',
                start: new Date(new Date(currentWeekMonday).setHours(120 + 6, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(120 + 7, 30, 0)),
                type: 'hiking',
                color: EVENT_COLORS.hiking
            },
            {
                id: 'sat-2',
                title: 'Mountain Biking',
                start: new Date(new Date(currentWeekMonday).setHours(120 + 10, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(120 + 13, 0, 0)),
                type: 'atv',
                color: EVENT_COLORS.atv
            },
            {
                id: 'sat-3',
                title: 'Farewell Dinner',
                start: new Date(new Date(currentWeekMonday).setHours(120 + 18, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(120 + 20, 0, 0)),
                type: 'dinner',
                color: EVENT_COLORS.dinner
            }
        ];

        const sundayEvents = [
            {
                id: 'sun-1',
                title: 'Breakfast',
                start: new Date(new Date(currentWeekMonday).setHours(144 + 8, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(144 + 9, 30, 0)),
                type: 'lunch',
                color: EVENT_COLORS.lunch
            },
            {
                id: 'sun-2',
                title: 'Hotel Checkout',
                start: new Date(new Date(currentWeekMonday).setHours(144 + 11, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(144 + 12, 0, 0)),
                type: 'hotel',
                color: EVENT_COLORS.hotel
            },
            {
                id: 'sun-3',
                title: 'Airport Transfer',
                start: new Date(new Date(currentWeekMonday).setHours(144 + 14, 0, 0)),
                end: new Date(new Date(currentWeekMonday).setHours(144 + 15, 30, 0)),
                type: 'pickup',
                color: EVENT_COLORS.pickup
            }
        ];

        return [
            ...mondayEvents,
            ...tuesdayEvents,
            ...wednesdayEvents,
            ...thursdayEvents,
            ...fridayEvents,
            ...saturdayEvents,
            ...sundayEvents
        ];
    });

    // Custom event styling
    const eventStyleGetter = (event: Event) => {
        return {
            style: {
                backgroundColor: event.color,
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: 'none',
                display: 'block',
                fontSize: '12px',
                padding: '2px 5px'
            }
        };
    };

    // Custom toolbar to match the design
    const CustomToolbar = ({ label }: any) => (
        <div className="rbc-toolbar">
            <span className="rbc-toolbar-label text-white text-2xl font-bold">{label}</span>
        </div>
    );

    const CustomHeader = ({ label }: any) => {
        const dayIndex = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            .findIndex(day => label.includes(day));

        const dayNumber = (dayIndex + 1).toString().padStart(2, '0');

        return (
            <div className="rbc-header flex flex-col justify-start items-start p-0">
                <p className=" text-primary-gray">Day</p>
                <p className="text-[40px] leading-[56px] font-bold text-start">{dayNumber}</p>
            </div>
        );
    };

    const CustomEvent = ({ event }: { event: Event }) => {
        const getIcon = (type: string) => {
            switch (type) {
                case 'hiking':
                    return <FaHiking className="size-5" />;
                case 'lunch':
                case 'dinner':
                    return <FaUtensils className="size-5" />;
                case 'atv':
                    return <FaCar className="size-5" />; // Or your custom ATV icon
                case 'hotel':
                    return <FaBed className="size-5" />;
                case 'pickup':
                    return <FaShuttleVan className="size-5" />;
                default:
                    return null;
            }
        };

        return (
            <div
                className={`flex flex-col gap-0 p-2 justify-between rounded-md w-full h-full bg-gradient-to-r from-white/20 to-white/10 border-t-8 `}
                style={{ borderTopColor: event.color }}
            >
                <div>

                    {getIcon(event.type)}
                </div>
                <span className="text-sm font-medium whitespace-nowrap !mb-2.5">{event.title}</span>
                {/* </div> */}
            </div>
        );
    };

    // Add this custom component
    const CustomTimeGutterHeader = () => {
        return (
            <div className="rbc-time-header-gutter flex justify-center items-center">
               <Image src="/svg-icons/clock.svg" alt="clock" width={24} height={24} />
            </div>
        );
    };

    return (
        <div className="md:h-screen h-auto bg-black">
            <div className="hidden 3xl:block">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    defaultView="week"
                    views={['week']}
                    step={60}
                    timeslots={1}
                    slotPropGetter={() => ({
                        className: 'custom-time-slot'
                    })}
                    // min={new Date(2024, 2, 1, 1, 0)} // Start at 8 AM
                    // max={new Date(2024, 2, 1, 24, 0)} // End at 8 PM
                    eventPropGetter={eventStyleGetter}
                    components={{
                        toolbar: CustomToolbar,
                        header: CustomHeader,
                        event: CustomEvent,
                        timeGutterHeader: CustomTimeGutterHeader
                    }}
                    className="bg-black text-white"
                />
            </div>

            {/* Mobile/tablet/desktop view - simplified calendar list (shown on all except 3xl screens) */}
            <div className="3xl:hidden p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from(new Set(events.map(event => {
                        const date = new Date(event.start);
                        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                    }))).sort().map((dateString) => {
                        const eventsOnDate = events.filter(event => {
                            const date = new Date(event.start);
                            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` === dateString;
                        });

                        const date = new Date(dateString);
                        const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

                        return (
                            <div key={dateString} className="border border-primary-gray rounded-lg p-4">
                                <h3 className="text-white text-lg font-semibold mb-2">{formattedDate}</h3>
                                <div className="space-y-3">
                                    {eventsOnDate.sort((a, b) => a.start.getTime() - b.start.getTime()).map(event => {
                                        const startTime = event.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                                        const endTime = event.end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

                                        const getIcon = (type: string) => {
                                            switch (type) {
                                                case 'hiking':
                                                    return <FaHiking className="size-5" />;
                                                case 'lunch':
                                                case 'dinner':
                                                    return <FaUtensils className="size-5" />;
                                                case 'atv':
                                                    return <FaCar className="size-5" />;
                                                case 'hotel':
                                                    return <FaBed className="size-5" />;
                                                case 'pickup':
                                                    return <FaShuttleVan className="size-5" />;
                                                default:
                                                    return <FaClock className="size-5" />;
                                            }
                                        };

                                        return (
                                            <div
                                                key={event.id}
                                                className="flex items-center p-2 rounded-md"
                                                style={{ borderLeft: `4px solid ${event.color}` }}
                                            >
                                                <div className="text-white mr-3">
                                                    {getIcon(event.type)}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium">{event.title}</div>
                                                    <div className="text-primary-gray text-sm">{startTime} - {endTime}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx global>{`
        .rbc-calendar {
          background-color: black;
        }
        .rbc-time-view {
          border: none;
        }
        .rbc-time-header {
          background-color: black;
          border: none;
        }
        .rbc-header {
          background-color: black;
          color: #ffffff;
          border: none !important;
          padding: 0 !important;
          min-height: 70px !important;
          display: flex;
          align-items: start;
          justify-content: start;
        }
        .rbc-time-content {
          background-color: black;
          border: none;
        }
        .rbc-time-slot {
          color: #ffffff;
          border: none;
        }
        .rbc-time-gutter {
          background-color: black;
          border: none;
        }
        .rbc-timeslot-group {
          border: none;
        }
        .rbc-time-column {
          background-color: black;
          border: none;
        }
        .rbc-day-slot .rbc-time-slot {
          border: none;
        }
        .rbc-day-slot {
          border: none !important;
        }
        .rbc-time-header-content {
          border: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .rbc-time-header {
          padding: 0 !important;
          margin: 0 !important;
          min-height: auto !important;
        }
        .rbc-today {
          background-color: transparent !important;
        }
        
        /* Remove all vertical borders */
        .rbc-time-view .rbc-time-content > * + * > * {
          border-left: none !important;
        }
        
        .rbc-time-content > .rbc-day-slot {
          border-right: none !important;
        }
        
        .rbc-time-header.rbc-overflowing {
          border-right: none !important;
        }
        
        .rbc-time-header-content {
          border-left: none !important;
        }
        
        .rbc-time-header .rbc-header {
          border-left: none !important;
          border-right: none !important;
        }
        
        .rbc-time-content .rbc-day-slot {
          border: none !important;
        }

        /* Remove any remaining borders */
        .rbc-time-view *,
        .rbc-time-view *:before,
        .rbc-time-view *:after {
          border-left: none !important;
          border-right: none !important;
        }

        .rbc-event {
          background-color: transparent !important;
          border: none !important;
          padding: 0 !important;
          margin: 1px 0 !important;
        }

        .rbc-event-content {
          font-size: 14px !important;
          padding: 0 !important;
        }

        /* Increase time slot height */
        .rbc-timeslot-group {
          min-height: 80px !important;  /* Adjust this value to change row height */
        }

        .rbc-time-slot {
          height: 80px !important;  /* Match the height above */
        }

        .rbc-time-gutter .rbc-timeslot-group {
          min-height: 80px !important;  /* Match the height above */
        }

        /* Ensure time labels are vertically centered */
        .rbc-time-gutter .rbc-timeslot-group {
          display: flex;
          align-items: center;
        }

        .rbc-time-header-gutter {
            background-color: black;
            border: none !important;
            min-width: 100px !important;
            padding: 10px !important;
            display: flex;
            align-items: start;
            justify-content: center;
        }
      `}</style>
        </div>
    );
} 