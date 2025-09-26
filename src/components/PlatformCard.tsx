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
      className="platform-card group relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-move"
      draggable
      onDragStart={(e) => onDragStart(e, platform)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, platform)}
      style={{ borderTopColor: color, borderTopWidth: '4px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">{displayName}</h3>
            <p className="text-slate-500 text-sm">
              {data ? `${data.topics.length} topics` : 'No data'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="refresh-btn opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50"
          title="Refresh"
        >
          <svg 
            className={`w-5 h-5 text-slate-600 ${loading ? 'animate-spin' : ''}`} 
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
      <div className="min-h-[200px]">
        {loading && (
          <div className="flex items-center justify-center h-48">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {error && (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-2">Data fetch failed</p>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        
        {data && !loading && !error && (
          <div className="space-y-3">
            {data.topics.slice(0, 5).map((topic, index) => (
              <a
                key={index}
                href={topic.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200 group/link"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-medium text-sm leading-relaxed group-hover/link:text-blue-600 transition-colors duration-200 line-clamp-2">
                      {topic.title}
                    </p>
                    {topic.platforms && topic.platforms.length > 1 && (
                      <div className="flex items-center mt-2 space-x-1">
                        {topic.platforms.slice(0, 3).map((platform, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full"
                          >
                            {platform}
                          </span>
                        ))}
                        {topic.platforms.length > 3 && (
                          <span className="text-slate-500 text-xs">+{topic.platforms.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end ml-3">
                    <span className="text-xs text-slate-500">#{topic.rank}</span>
                    {topic.hot && topic.hot > 0 && (
                      <span className="text-xs text-red-500 font-medium">
                        {topic.hot > 10000 ? `${(topic.hot / 10000).toFixed(1)}w` : topic.hot}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
            
            {data.topics.length > 5 && (
              <div className="text-center pt-2">
                <span className="text-slate-500 text-sm">
                  +{data.topics.length - 5} more topics
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
