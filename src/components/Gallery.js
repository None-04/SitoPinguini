import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

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
        className="relative overflow-hidden rounded-lg border border-gray-300 w-full"
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
          className="flex items-center justify-center text-white rounded-full w-8 h-8 shadow-lg transition-transform duration-300 transform group-hover:scale-110"
          style={{ backgroundColor: 'rgb(230, 164, 14)', ':hover': { backgroundColor: 'rgb(194, 134, 0)' } }}
        >
          <ChevronUp size={16} />
          <span className="sr-only">Upvote</span>
        </button>
        <span className="mt-1 text-white text-xs px-2 py-1 rounded-full" style={{ backgroundColor: 'rgb(230, 164, 14)' }}>
          {image.votes}
        </span>
      </div>
    </div>
  );
};

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [visibleImages, setVisibleImages] = useState(20);

  useEffect(() => {
    setImages(fetchImages(500));
  }, []);

  const handleVote = (id) => {
    setImages(images.map(img => img.id === id ? { ...img, votes: img.votes + 1 } : img));
  };

  const loadMore = () => {
    setVisibleImages(prev => Math.min(prev + 20, images.length));
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold my-4 sm:my-6 lg:my-8 text-center">Image Gallery</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
        {images.slice(0, visibleImages).map(image => (
          <ImageCard key={image.id} image={image} onVote={handleVote} />
        ))}
      </div>
      {visibleImages < images.length && (
        <div className="text-center my-6 sm:my-8 lg:my-10">
          <button
            onClick={loadMore}
            className="text-white font-bold py-2 px-4 rounded-lg text-sm sm:text-base"
            style={{ backgroundColor: 'rgb(230, 164, 14)', ':hover': { backgroundColor: 'rgb(194, 134, 0)' } }}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;