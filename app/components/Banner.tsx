import React from 'react';

function Banner() {
    return (
        <div className="banner" style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
            <div style={{
                position: 'absolute',
                top: '75%',  
                left: '50%', 
                transform: 'translate(-50%, -100%)',
                width: '100%',
                textAlign: 'center',
                zIndex: 2, 
            }}>
                <p className="text-lg text-white">Not sure where to go? Perfect.</p>
            </div>
            <video autoPlay muted loop style={{
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                position: 'absolute', 
                top: 0, 
                left: 0,
                zIndex: 1  // Explicit z-index lower than the text
            }}>
                <source src="/videos/DVbanner.mp4" type="video/mp4" />
                <source src="/videos/DVbanner.webm" type="video/webm" />
                Your browser does not support the video tag.
            </video>
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0) 80%, rgba(255,255,255,1) 100%)',
                zIndex: 1  // Same z-index as video to ensure consistent layering
            }}></div>
            <button style={{
                position: 'absolute',
                top: '80%', // Align with the start of the gradient
                left: '50%', // Center horizontally
                transform: 'translate(-50%, -50%)', // Center the button
                padding: '10px 20px',
                fontSize: '16px',
                color: 'black',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                zIndex: 2  // Ensures it is above the video
            }}>
                Surprise Me!
            </button>
        </div>
    );
}

export default Banner;
