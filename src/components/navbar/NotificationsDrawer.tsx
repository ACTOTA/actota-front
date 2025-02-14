import { ArrowRightIcon, DocumentCheckIcon, BellIcon, PencilIcon, UserPlusIcon, XMarkIcon, EyeIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import React from 'react'
import Button from '../figma/Button'
import Image from 'next/image'
import { PiChecksBold } from 'react-icons/pi'
import { IoLocationOutline } from 'react-icons/io5'
import { BiTime } from 'react-icons/bi'
import { LuUser } from 'react-icons/lu'
import { CheckIcon } from '@heroicons/react/20/solid'

const NotificationItem = ({ type, time, isRead, ...props }: {
    type: string,
    time: string,
    isRead: boolean,
    [key: string]: any
}) => {
    const renderContent = () => {
        switch (type) {
            case 'meeting-info':
                return (
                    <div className="space-y-2  w-full ">
                        <div>{props.message}</div>
                        <div className="text-xs mt-2 text-primary-gray">{time}</div>

                        {props.location && (
                            <div className='border border-primary-gray rounded-md p-2 w-full'>
                            <div className="flex items-center gap-2">
                                <IoLocationOutline /> {props.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <BiTime /> {props.meetingTime}
                            </div>
                            </div>
                        )}
                    </div>
                );
            case 'join-request':
            case 'edit-invite':
            case 'view-invite':
                return (
                    <span>
                        <strong>{props.user}</strong> {props.message} <strong>{props.tripName}</strong>
                    </span>
                );
            default:
                return props.message;
        }
    };

    const renderActions = () => {
        switch (type) {
            case 'join-request':
            case 'edit-invite':
                return (
                    <div className="flex gap-2">
                        <Button variant='outline' size="sm">Decline</Button>
                        <Button variant='primary' size="sm">Accept</Button>
                    </div>
                );
            case 'view-invite':
                return (
                    <div className="flex gap-2">
                        <Button variant='outline' size="sm" className='whitespace-nowrap'>Decline</Button>
                        <Button variant='primary' size="sm">View</Button>
                    </div>
                );
            case 'trip-summary':
                return (
                    <Button variant='outline' size="sm" className="flex items-center gap-2 whitespace-nowrap">
                        Trip Summary <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                );
            case 'waiver':
                return <Button variant='primary' size="sm" className='whitespace-nowrap'>Sign Now</Button>;
            case 'activity-completed':
            case 'trip-completed':
                return <Button variant='primary' size="sm" className='whitespace-nowrap'>Give Feedback</Button>;
            default:
                return props.action && <Button variant='primary' size="sm" className='whitespace-nowrap'>{props.action}</Button>;
        }
    };

    const renderIcon = () => {
        switch (type) {
            case 'trip-reminder':
                return <Image src="/svg-icons/announcement-icon.svg" alt="trip reminder" width={20} height={20} />
            case 'meeting-info':
                return <Image src="/images/no-profile.jpeg" alt="meeting info"  width={48} height={48}  />;
            case 'join-request':
                return <Image src="/images/no-profile.jpeg" alt="meeting info"  width={48} height={48}  />;
            case 'edit-invite':
                return <Image src="/svg-icons/edit-icon.svg" alt="edit invite" width={20} height={20} />
            case 'itinerary-edit':
                return <Image src="/svg-icons/edit-icon.svg" alt="edit invite" width={20} height={20} />;
            case 'waiver':
                return <Image src="/images/no-profile.jpeg" alt="meeting info"  width={48} height={48}  />;
            case 'guide-alert':
                return <BellIcon className="w-6 h-6 text-white" />;
            case 'activity-completed':
                return <CheckIcon  className="w-6 h-6 text-white  " />;
            case 'trip-completed':
                return <CheckIcon  className="w-6 h-6 text-white  " />;
            case 'trip-summary':
                return <ArrowRightIcon className="w-5 h-5 text-white" />;
            case 'view-invite':
                return  <Image src="/images/no-profile.jpeg" alt="meeting info"  width={48} height={48}  />;
            default:
                return null;
        }
    };
    return (
        <div className={`flex gap-4 p-4 ${isRead ? '' : 'bg-[#1A1A1A]'}`}>
            <div className="w-12 h-12 overflow-hidden rounded-full bg-[#05080D] border border-white/20 flex items-center justify-center">
                {renderIcon()}
                {/* Icon based on notification type */}
            </div>
            <div className="flex-1">
                <div className="flex justify-between gap-5 items-center">
                    <div className='w-full'>
                        <div className="text-white">{renderContent()}</div>
                        {type !== 'meeting-info' && <div className="text-xs mt-2 text-primary-gray">{time}</div>}

                    </div>
                    <div className='flex items-center gap-2 h-full '>
                        {renderActions()}
                        {!isRead && <div className='w-2 h-2 bg-[#F43E62] rounded-full'></div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const NotificationsDrawer = ({ setIsDrawerOpen }: { setIsDrawerOpen: (isDrawerOpen: boolean) => void }) => {
    const notifications = [
        {
            type: 'trip-reminder',
            message: 'Your trip is starting in 24h!',
            time: '1 day ago',
            isRead: false
        },
        {
            type: 'meeting-info',
            message: "Let's meet at:",
            location: 'ABC Restaurant Lobby',
            meetingTime: '10:15AM',
            time: '4 mins ago',
            isRead: false
        },
        {
            type: 'join-request',
            user: 'Jessica R.',
            message: 'requested edit access to',
            tripName: 'Denver Tour',
            time: '4 mins ago',
            isRead: false
        },
        {
            type: 'itinerary-edit',
            message: (
                <span>
                    <strong>Alicia</strong> replaced St. Mary's Glacier Hike with Mountain Biking in Denver Tour.
                </span>
            ),
            time: '1 day ago',
            action: 'View',
            isRead: true
        },
        {
            type: 'waiver',
            message: 'Sign the waiver before your trip begins.',
            time: '1 day ago',
            action: 'Sign Now',
            isRead: true
        },
        {
            type: 'guide-alert',
            message: "Let's gather 30 mins than initially planned, there's possibility of bad traffic.",
            time: '4 mins ago',
            isRead: false
        },
        {
            type: 'activity-completed',
            message: (
                <span>
                    You completed <strong>Day 1</strong> of the trip!<br />
                    Tell us about it!
                </span>
            ),
            time: '2 mins ago',
            action: 'Give Feedback',
            isRead: true
        },
        {
            type: 'trip-completed',
            message: (
                <span>
                    You completed <strong>Denver Tour</strong> trip!<br />
                    Tell us about it!
                </span>
            ),
            time: '2 mins ago',
            action: 'Give Feedback',
            isRead: true
        },
        {
            type: 'trip-summary',
            message: (
                <span>
                    Thank you for completing the trip with us. See your trip summary.
                </span>
            ),
            time: '2 mins ago',
            isRead: true
        },
        {
            type: 'edit-invite',
            user: 'Jessica R.',
            message: 'invited you to edit',
            tripName: 'Denver Tour',
            time: '4 mins ago',
            isRead: true
        },
        {
            type: 'view-invite',
            user: 'Jessica R.',
            message: 'invited you to view',
            tripName: 'Denver Tour',
            time: '4 mins ago',
            isRead: true
        }
    ]

    return (
        <div className='flex flex-1 flex-col w-[600px]'>
            <div className="flex items-center justify-between p-8 pb-2  ">
                <h2 className="text-2xl font-bold text-white">Notification</h2>
                <div className='flex  justify-between items-center gap-4 '>
                    <Button variant='simple' className='text-white text-sm font-medium flex items-center gap-2'>
                        <PiChecksBold className="w-5 h-5" />
                        Mark all as read
                    </Button>
                    <Button
                        variant='simple'
                        className='!p-0'
                        onClick={() => setIsDrawerOpen(false)}
                    >
                        <XMarkIcon className="w-6 h-6 text-white" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col overflow-y-auto">
                {notifications.map((notification, index) => (
                    <div key={index}>
                        <NotificationItem key={index} {...notification} />
                        {index !== notifications.length - 1 && (
                            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary-gray to-transparent"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default NotificationsDrawer