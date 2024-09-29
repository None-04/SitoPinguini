import React, { useState, useEffect, useRef } from 'react';
import Leaderboard from './Leaderboard';
import ImageCard from './ImageCard';
import Navigation from './Navigation';
import { ChevronUp, Search, UserPlus, ExternalLink, ChevronDown } from 'lucide-react';

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

// Section Component
const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">{title}</h2>
    {children}
  </div>
);

// Filter Dropdown Component
const FilterDropdown = ({ onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Filter");

  const handleSelection = (value) => {
    setSelectedValue(value);
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-[180px] bg-white bg-opacity-20 text-white border border-transparent focus:ring-2 focus:ring-[rgb(230,164,14)] rounded-lg flex items-center justify-between px-4 py-2"
      >
        {selectedValue}
        <span className="ml-2">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="absolute z-10 bg-white bg-opacity-80 rounded-lg shadow-lg mt-1 w-full">
          {['All', 'Recent', 'Popular', 'Trending'].map((filter) => (
            <div
              key={filter}
              onClick={() => handleSelection(filter.toLowerCase())}
              className="cursor-pointer hover:bg-[rgb(230,164,14)] hover:text-white p-2"
            >
              {filter}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Gallery Component
const Gallery = ({ backgroundImage = 'SitoPinguini.png' }) => {
  const [images, setImages] = useState([]);
  const [visibleImages, setVisibleImages] = useState(20);
  const [activeSection, setActiveSection] = useState('Leaderboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setImages(fetchImages(500));
  }, []);

  const handleVote = (id) => {
    setImages(images.map(img => img.id === id ? { ...img, votes: img.votes + 1 } : img));
  };

  const loadMore = () => {
    setVisibleImages(prev => Math.min(prev + 20, images.length));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    console.log('Filtering by:', value);
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
    <div
      className="min-h-screen overflow-auto"
      style={backgroundStyle}
      onScroll={(p) => {
        const { scrollTop, clientHeight, scrollHeight } = p.target;
        if (activeSection === 'Gallery') {
          if (scrollTop + clientHeight >= scrollHeight) {
            loadMore();
          }
        }
      }}
    >
      <div className="px-4 sm:px-6 lg:px-8 relative z-10 safe-area-padding">
        <div className="flex justify-between items-center my-8">
          <div className="flex-grow text-center">
            <h1 className="text-4xl font-bold text-white">Stage 2</h1>
          </div>
          <div className="flex-none">
            <button className="bg-[rgb(230,164,14)] hover:bg-[rgb(194,134,0)] text-white font-bold py-2 px-4 rounded-lg flex items-center">
              <UserPlus size={20} className="mr-2" />
              Connect
            </button>
          </div>
        </div>

        <Navigation
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sections={['Leaderboard', 'Gallery', 'My Submission']}
        />


        {activeSection === 'Gallery' && (
          <div className="mb-8 flex items-center justify-center space-x-4">
            <form onSubmit={handleSearch} className="flex-grow max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[rgb(230,164,14)]"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
            <FilterDropdown onValueChange={handleFilterChange} />
          </div>
        )}

        {activeSection === 'Leaderboard' && (
          <Section title="">
            <Leaderboard />
          </Section>
        )}

        {activeSection === 'Gallery' && (
          <Section title="">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-5/6 mx-auto">
              {images.slice(0, visibleImages).map(image => (
                <ImageCard
                  key={image.id}
                  image={image}
                  onVote={handleVote}
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
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }

        /* Safe area padding for notched devices */
        @supports (padding-top: env(safe-area-inset-top)) {
          .safe-area-padding {
            padding-top: env(safe-area-inset-top);
            padding-right: env(safe-area-inset-right);
            padding-bottom: env(safe-area-inset-bottom);
            padding-left: env(safe-area-inset-left);
          }
        }

        /* Fallback for devices without notch */
        .safe-area-padding {
          padding-top: max(16px, env(safe-area-inset-top));
          padding-right: max(16px, env(safe-area-inset-right));
          padding-bottom: max(16px, env(safe-area-inset-bottom));
          padding-left: max(16px, env(safe-area-inset-left));
        }

        /* Ensure the content is not hidden behind the notch on landscape orientation */
        @media screen and (orientation: landscape) {
          .safe-area-padding {
            padding-left: max(32px, env(safe-area-inset-left));
            padding-right: max(32px, env(safe-area-inset-right));
          }
        }
      `}</style>
    </div>
  );
};

export default Gallery;