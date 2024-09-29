import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, Search, UserPlus, ExternalLink, ChevronDown } from 'lucide-react';

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

export default ImageCard;