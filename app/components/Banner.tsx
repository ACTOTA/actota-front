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
                background: 'linear-gradient(to bottom, rgba(255,255,255,0) 80%, rgba(255,255,255,1) 100%)'  // Gradient only at the bottom
            }}></div>
        </div>
    );
}

export default Banner;
