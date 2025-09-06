'use client';

import React, { useState, useEffect } from 'react';

const images = [
  '/1.png',
  '/2.jpg',
  '/3.jpg',
];

const SplashScreen = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 100); // Change image every 0.10 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // Hide overflow to prevent scrollbars
      }}
    >
      <img
        src={images[currentImageIndex]}
        alt="Splash Screen Image"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain', // Ensure the image fits within the container
        }}
      />
    </div>
  );
};

export default SplashScreen;
