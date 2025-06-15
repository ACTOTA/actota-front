import React from 'react'
import Button from '../figma/Button'
import { LuMail } from 'react-icons/lu';
import { FiMessageSquare } from 'react-icons/fi';
import { RiWhatsappFill } from 'react-icons/ri';
import { BiLogoInstagramAlt, BiSolidCopy } from 'react-icons/bi';
import { IoLogoFacebook } from 'react-icons/io5';
import Input from '../figma/Input';
import { PiCopyLight } from 'react-icons/pi';
import { toast } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

const ShareModal = () => {
    const [isCopied, setIsCopied] = React.useState(false);
    const searchParams = useSearchParams();
    const itineraryId = searchParams.get('itineraryId');

    // Use the full URL as shown in the input field
    const fullShareUrl = itineraryId ? `https://www.actota.com/itineraries/${itineraryId}` : '';
    const shareTitle = 'Check out this amazing itinerary on ACTOTA!';

    const socialShareOptions = [
        {
            name: 'Email',
            icon: <LuMail className='h-5 w-5 text-white' />,
            action: () => {
                window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(fullShareUrl)}`;
            }
        },
        {
            name: 'Text',
            icon: <FiMessageSquare className='h-5 w-5 text-white' />,
            action: () => {
                window.location.href = `sms:?&body=${encodeURIComponent(shareTitle + ' ' + fullShareUrl)}`;
            }
        },
        {
            name: 'WhatsApp',
            icon: <RiWhatsappFill className='h-6 w-6 text-white' />,
            action: () => {
                window.open(`https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + fullShareUrl)}`, '_blank');
            }
        },
        {
            name: 'Instagram',
            icon: <BiLogoInstagramAlt className='h-6 w-6 text-white' />,
            action: () => {
                // Instagram doesn't support direct URL sharing, so we copy the link instead
                handleCopyLink();
                toast.success('Link copied! Share it on Instagram');
            }
        },
        {
            name: 'Facebook',
            icon: <IoLogoFacebook className='h-6 w-6 text-white' />,
            action: () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullShareUrl)}`, '_blank');
            }
        }
    ];

    const handleCopyLink = () => {
        if (!itineraryId) return;
        
        navigator.clipboard.writeText(fullShareUrl);
        setIsCopied(true);
        toast.success('Link copied');
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className='w-full'>
            <p className='text-white text-2xl font-bold'>Share Itinerary</p>
            <div className='flex gap-3 mt-6'>
                {socialShareOptions.map((option, index) => (
                    <button
                        key={index}
                        onClick={option.action}
                        className='bg-white/10 rounded-full border border-white/20 h-16 w-16 flex items-center justify-center hover:bg-white/20 hover:border-white/30 transition-all'
                        title={`Share via ${option.name}`}
                    >
                        {option.icon}
                    </button>
                ))}
            </div>
            <p className='text-gray-400 text-sm mt-6 mb-2'>or copy link</p>
            <div className='w-full'>
                <Input 
                    rightIcon={
                        <button onClick={handleCopyLink} className='flex items-center gap-1 hover:opacity-80 transition-opacity'>
                            Copy {isCopied ? 
                                <BiSolidCopy className='h-5 w-5 text-white' /> : 
                                <PiCopyLight className='h-5 w-5 text-white' />
                            } 
                        </button>
                    } 
                    type="text" 
                    className='w-full bg-black/50 rounded-full border border-border-primary' 
                    value={fullShareUrl}
                    readOnly
                />
            </div>
        </div>
    )
}

export default ShareModal