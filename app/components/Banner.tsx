import React from 'react';

function Banner() {
    return (
        <div className="banner" style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
            <video autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}>
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
                background: 'linear-gradient(to bottom, rgba(255,255,255,0) 80%, rgba(255,255,255,1) 100%)'
            }}></div>
            <button style={{
                position: 'absolute',
                top: '80%', // Align with the start of the gradient
                left: '50%', // Center horizontally
                transform: 'translate(-50%, -50%)', // Center the button
                padding: '10px 20px',
                fontSize: '16px',
                color: '#fff',
                backgroundColor: '#007BFF', // Example blue color
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
            }}>
                Surprise Me! 
            </button>
        </div>
    );
}

export default Banner;
