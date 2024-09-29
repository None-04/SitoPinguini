import React, { useState, useEffect, useRef } from 'react';
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

// Image Card Component
const ImageCard = ({ image, onVote }) => {
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
        className={`relative overflow-hidden rounded-lg w-full shadow-[0_6px_20px_rgba(50,50,50,0.8)]`}
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

// Navigation Component
const Navigation = ({ activeSection, setActiveSection, sections }) => {
  const wordRefs = useRef([]);

  const addToRefs = (el) => {
    if (el && !wordRefs.current.includes(el)) {
      wordRefs.current.push(el);
    }
  };

  return (
    <div className="relative mb-8 w-full max-w-xl mx-auto">
      <div className="relative flex justify-between">
        {sections.map((section) => (
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

// Underline Component
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
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  );
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
};
// Custom X Icon Component
const XIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill={color} />
  </svg>
);
const LeaderboardRow = ({ entry, position, isExpanded, toggleExpand, isFirst, isLast }) => {
  return (
    <div 
      className={`bg-white bg-opacity-70 overflow-hidden transition-all duration-700 ease-in-out cursor-pointer
                  border-b-2 border-gray-300 last:border-b-0
                  ${isFirst ? 'rounded-t-lg' : ''} ${isLast ? 'rounded-b-lg' : ''}`}
      onClick={toggleExpand}
    >
      <div className={`p-4 transition-all duration-700 ease-in-out ${isExpanded ? 'pb-8' : ''}`}>
        <div className="flex items-center space-x-4">
          <div className="w-16 flex items-center justify-center font-bold text-3xl text-[rgb(230,164,14)]">
            {position}
          </div>
          <div className="flex-grow flex items-center">
            <div className="relative overflow-hidden transition-all duration-700 ease-in-out"
                 style={{
                   width: isExpanded ? '25%' : '4rem',
                   paddingBottom: isExpanded ? '25%' : '4rem',
                   flexShrink: 0,
                 }}>
              <img 
                src={entry.imageUrl} 
                alt={entry.title} 
                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg transition-all duration-700 ease-in-out"
              />
            </div>
            <div className="flex-grow ml-4">
              <h3 className="font-semibold text-gray-800 text-base">{entry.title}</h3>
              <p className="text-sm text-gray-600">Team: {entry.teamMembers.join(', ')}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-gray-600">Votes: {entry.votes}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-500 transition-transform duration-700 ${isExpanded ? 'transform rotate-180' : ''}`}
                />
              </div>
              <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
                   style={{
                     transform: isExpanded ? 'translateY(0)' : 'translateY(-20px)',
                   }}>
                <div className="w-full">
                  <h4 className="font-bold text-gray-800 mb-2">Description</h4>
                  <p className="text-gray-700 mb-4 text-sm">{entry.description}</p>
                </div>
                <div className="flex justify-start items-center">
                  <a 
                    href={entry.customLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors duration-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <XIcon size={20} color="white" />
                    <span>View on X</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// Leaderboard Component
const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    const fetchedData = Array.from({ length: 15 }, (_, index) => ({
      id: index + 1,
      teamMembers: [`Member ${index * 2 + 1}`, `Member ${index * 2 + 2}`],
      title: `Artwork ${index + 1}`,
      customLink: `https://example.com/custom-link-${index + 1}`,
      imageUrl: `https://www.wwf.it/uploads/Original_WW223791-scaled.jpg`,
      description: `This is a brief description for Artwork ${index + 1}. It showcases the creativity and skill of the team. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      votes: Math.floor(Math.random() * 1000),
    }));
    
    fetchedData.sort((a, b) => b.votes - a.votes);
    setLeaderboardData(fetchedData);
  }, []);

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full sm:w-2/3 bg-white bg-opacity-50 backdrop-blur-sm overflow-hidden rounded-lg">
        {leaderboardData.map((entry, index) => (
          <LeaderboardRow 
            key={entry.id}
            entry={entry}
            position={index + 1}
            isExpanded={expandedRow === entry.id}
            toggleExpand={() => toggleExpand(entry.id)}
            isFirst={index === 0}
            isLast={index === leaderboardData.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

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
    <div className="min-h-screen overflow-auto" style={backgroundStyle} onScroll={(p)=>{
      const { scrollTop, clientHeight, scrollHeight } = p.target;
      if(activeSection === 'Gallery'){
        if (scrollTop + clientHeight >= scrollHeight) {
          loadMore();
        }
      }
    }}>
      <div className="px-4 sm:px-6 lg:px-8 relative z-10">
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
      `}</style>
    </div>
  );
};

export default Gallery;