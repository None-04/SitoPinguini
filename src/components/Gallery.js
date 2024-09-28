import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp } from 'lucide-react';

// Function to fetch images (simulation)
const fetchImages = (count) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    imageUrl: `https://www.wwf.it/uploads/Original_WW223791-scaled.jpg`,
    title: `Image ${index + 1}`,
    description: `This is a brief description for Image ${index + 1}. It showcases the creativity and skill of the team.`,
    teamMembers: [`Member ${index * 2 + 1}`, `Member ${index * 2 + 2}`],
    votes: Math.floor(Math.random() * 100),
  }));
};

// Image Card Component
const ImageCard = ({ image, onVote, isSelected }) => {
  const [aspectRatio, setAspectRatio] = useState(4 / 3);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setAspectRatio(img.width / img.height);
    };
    img.src = image.imageUrl;
  }, [image.imageUrl]);

  return (
    <div className="relative group">
      <div 
        className={`relative overflow-hidden rounded-lg w-full shadow-[0_6px_20px_rgba(50,50,50,0.8)] ${isSelected ? 'border border-black' : ''}`} // Adjusted shadow to darker gray
        style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
      >
        <img 
          src={image.imageUrl} 
          alt={image.title} 
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          loading="lazy" 
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
        <div className="absolute inset-0 p-2 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-center">
            <p className="text-white text-xs font-semibold">
              Team: {image.teamMembers.join(', ')}
            </p>
          </div>
          <div>
            <h3 className="text-white text-xs font-semibold mb-1">{image.title}</h3>
            <p className="text-white text-xs">{image.description}</p>
          </div>
        </div>
      </div>
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <button
          onClick={() => onVote(image.id)}
          className="flex items-center justify-center text-white rounded-full w-8 h-8 shadow-lg transition-transform duration-300 transform group-hover:scale-110 bg-[rgb(230,164,14)] hover:bg-[rgb(194,134,0)]"
        >
          <ChevronUp size={16} />
          <span className="sr-only">Upvote</span>
        </button>
        <span className="mt-1 text-white text-xs px-2 py-1 rounded-full bg-[rgb(230,164,14)]">
          {image.votes}
        </span>
      </div>
    </div>
  );
};

// Navigation Component with Clickable Words and Underline
const Navigation = ({ activeSection, setActiveSection, sections }) => {
  const wordRefs = useRef([]);
  wordRefs.current = [];

  const addToRefs = (el) => {
    if (el && !wordRefs.current.includes(el)) {
      wordRefs.current.push(el);
    }
  };

  return (
    <div className="relative mb-8 w-full max-w-xl mx-auto">
      <div className="relative flex justify-between">
        {sections.map((section, index) => (
          <span
            key={section}
            ref={addToRefs}
            onClick={() => setActiveSection(section)}
            className={`cursor-pointer px-3 py-2 text-sm font-medium ${
              activeSection === section ? 'text-[rgb(230,164,14)]' : 'text-white hover:text-gray-300'
            }`}
          >
            {section}
          </span>
        ))}
      </div>
      <Underline activeSection={activeSection} sections={sections} wordRefs={wordRefs} />
    </div>
  );
};

// Underline Component (Black Line + Yellow Underline)
const Underline = ({ activeSection, sections, wordRefs }) => {
  const activeIndex = sections.indexOf(activeSection);
  const [lineWidth, setLineWidth] = useState(0);
  const [lineLeft, setLineLeft] = useState(0);

  useEffect(() => {
    if (wordRefs.current[activeIndex]) {
      const wordElement = wordRefs.current[activeIndex];
      setLineWidth(wordElement.offsetWidth);
      setLineLeft(wordElement.offsetLeft);
    }
  }, [activeIndex]);

  return (
    <div className="absolute bottom-0 left-0 w-full flex items-center">
      <div className="h-[2px] bg-gray-300 flex-grow" />
      <div
        className="absolute bg-[rgb(230,164,14)] h-[4px] transition-all duration-300"
        style={{
          width: lineWidth,
          left: lineLeft,
          top: '50%', // Align vertically to the middle
          transform: 'translateY(-50%)', // Center vertically
        }}
      />
    </div>
  );
};

// Section Component for Title and Children
const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">{title}</h2>
    {children}
  </div>
);

// Main Gallery Component
const Gallery = ({ backgroundImage = 'SitoPinguini.png' }) => {
  const [images, setImages] = useState([]);
  const [visibleImages, setVisibleImages] = useState(20);
  const [activeSection, setActiveSection] = useState('Leaderboard');

  useEffect(() => {
    setImages(fetchImages(500));
  }, []);

  const handleVote = (id) => {
    setImages(images.map(img => img.id === id ? { ...img, votes: img.votes + 1 } : img));
  };

  const loadMore = () => {
    setVisibleImages(prev => Math.min(prev + 20, images.length));
  };

  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
      }
    : {};

  return (
    <div className="min-h-screen overflow-auto" style={backgroundStyle}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 className="text-4xl font-bold my-8 text-center text-white">Stage 2</h1>
        
        <Navigation 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          sections={['Leaderboard', 'Gallery', 'My Submission']} 
        />

        {activeSection === 'Leaderboard' && (
          <Section title="">
            <p className="text-white">Leaderboard content goes here.</p>
          </Section>
        )}

        {activeSection === 'Gallery' && (
          <Section title="">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.slice(0, visibleImages).map(image => (
                <ImageCard 
                  key={image.id} 
                  image={image} 
                  onVote={handleVote} 
                  isSelected={false} // Change this to dynamically set based on user selection if needed
                />
              ))}
            </div>
            {visibleImages < images.length && (
              <div className="text-center my-6">
                <button
                  onClick={loadMore}
                  className="text-white font-bold py-2 px-4 rounded-lg text-sm bg-[rgb(230,164,14)] hover:bg-[rgb(194,134,0)]"
                >
                  Load More
                </button>
              </div>
            )}
          </Section>
        )}

        {activeSection === 'My Submission' && (
          <Section title="">
            <p className="text-white">Your submission form or content goes here.</p>
          </Section>
        )}
      </div>
      <style jsx global>{`
        /* Custom Scrollbar Styles */
        ::-webkit-scrollbar {
          width: 8px; /* Thinner scrollbar */
          height: 8px; /* Thinner horizontal scrollbar */
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.5); /* Dark gray scrollbar */
          border-radius: 10px; /* Rounded edges */
        }
        ::-webkit-scrollbar-track {
          background: transparent; /* Transparent background for track */
        }
      `}</style>
    </div>
  );
};

export default Gallery;