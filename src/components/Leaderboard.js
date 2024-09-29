import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, Search, UserPlus, ExternalLink, ChevronDown } from 'lucide-react';


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

export default Leaderboard;