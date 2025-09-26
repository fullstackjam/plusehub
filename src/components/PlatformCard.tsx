import React from 'react';
import { PlatformData } from '../types';

interface PlatformCardProps {
  platformData: PlatformData;
  onRefresh: (platform: string) => void;
  onDragStart: (e: React.DragEvent, platform: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetPlatform: string) => void;
}

const PlatformCard: React.FC<PlatformCardProps> = ({
  platformData,
  onRefresh,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop
}) => {
  const { platform, displayName, icon, color, data, loading, error } = platformData;

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRefresh(platform);
  };

  return (
    <div
      className="platform-card group relative bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white/20 p-5 sm:p-6 lg:p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-move"
      draggable
      onDragStart={(e) => onDragStart(e, platform)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, platform)}
      style={{ borderTopColor: color, borderTopWidth: '4px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          <div 
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg flex-shrink-0"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-800 text-base sm:text-lg lg:text-xl truncate">{displayName}</h3>
            <p className="text-slate-500 text-sm sm:text-base">
              {data ? `${data.topics.length} topics` : 'No data'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="refresh-btn opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 flex-shrink-0"
          title="Refresh"
        >
          <svg 
            className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[200px] sm:min-h-[240px] lg:min-h-[280px]">
        {loading && (
          <div className="flex items-center justify-center h-32 sm:h-40 lg:h-48">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center justify-center h-32 sm:h-40 lg:h-48 text-center px-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-red-100 flex items-center justify-center mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-1 sm:mb-2 text-sm sm:text-base">Data fetch failed</p>
            <p className="text-red-500 text-xs sm:text-sm">{error}</p>
          </div>
        )}
        
        {data && !loading && !error && (
          <div className="space-y-1.5">
            {data.topics.slice(0, 8).map((topic, index) => (
              <a
                key={index}
                href={topic.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2.5 rounded-md bg-slate-50 hover:bg-slate-100 transition-colors duration-200 group/link"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <span className="text-slate-400 text-sm font-mono flex-shrink-0 w-6 text-center">
                      {topic.rank}
                    </span>
                    <p className="text-slate-800 font-medium text-sm leading-snug group-hover/link:text-blue-600 transition-colors duration-200 line-clamp-1 flex-1">
                      {topic.title}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                    {topic.hot && topic.hot > 0 && (
                      <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded-full">
                        {topic.hot > 10000 ? `${(topic.hot / 10000).toFixed(1)}w` : topic.hot}
                      </span>
                    )}
                    {topic.platforms && topic.platforms.length > 1 && (
                      <div className="flex items-center space-x-1">
                        {topic.platforms.slice(0, 2).map((platform, idx) => (
                          <span
                            key={idx}
                            className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full"
                          >
                            {platform}
                          </span>
                        ))}
                        {topic.platforms.length > 2 && (
                          <span className="text-slate-500 text-xs">+{topic.platforms.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            ))}
            
            {data.topics.length > 8 && (
              <div className="text-center pt-2">
                <span className="text-slate-500 text-sm">
                  +{data.topics.length - 8} more topics
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformCard;
