import React, { useState, useRef } from 'react';
import { PlatformData } from '../types';

interface PlatformCardProps {
  platformData: PlatformData;
  onRefresh?: (platform: string) => void;
  onDragStart?: (e: React.DragEvent, platform: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, platform: string) => void;
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
  const [showAll, setShowAll] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Define unique background colors and styles for each platform
  const getCardBackground = (platform: string) => {
    const backgrounds = {
      'weibo': 'bg-gradient-to-br from-orange-50 via-orange-100 to-red-50',
      'douyin': 'bg-gradient-to-br from-gray-50 via-gray-100 to-slate-50',
      'bilibili': 'bg-gradient-to-br from-blue-50 via-cyan-100 to-blue-50',
      'zhihu': 'bg-gradient-to-br from-blue-50 via-indigo-100 to-blue-50',
      'baidu': 'bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50',
      'toutiao': 'bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-50',
      '36kr': 'bg-gradient-to-br from-green-50 via-emerald-100 to-teal-50',
      'huxiu': 'bg-gradient-to-br from-orange-50 via-orange-100 to-red-50',
      'douban': 'bg-gradient-to-br from-green-50 via-green-100 to-emerald-50',
      'hupu': 'bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50',
      'aggregated': 'bg-gradient-to-br from-purple-50 via-pink-100 to-rose-50'
    };
    return backgrounds[platform as keyof typeof backgrounds] || 'bg-gradient-to-br from-slate-50 via-gray-100 to-slate-50';
  };

  // Define unique decorative patterns for each platform
  const getCardPattern = (platform: string) => {
    const patterns = {
      'weibo': 'before:content-["🔥"] before:absolute before:top-4 before:right-4 before:text-2xl before:opacity-20 before:pointer-events-none',
      'douyin': 'before:content-["🎵"] before:absolute before:top-4 before:right-4 before:text-2xl before:opacity-20 before:pointer-events-none',
      'bilibili': 'before:content-["📺"] before:absolute before:top-4 before:right-4 before:text-2xl before:opacity-20 before:pointer-events-none',
      'zhihu': 'before:content-["💡"] before:absolute before:top-4 before:right-4 before:text-2xl before:opacity-20 before:pointer-events-none',
      'baidu': 'before:content-["🔍"] before:absolute before:top-4 before:right-4 before:text-2xl before:opacity-20 before:pointer-events-none',
      'toutiao': 'before:content-["📰"] before:absolute before:top-4 before:right-4 before:text-2xl before:opacity-20 before:pointer-events-none',
      '36kr': 'before:content-["💼"] before:absolute before:top-4 before:right-4 before:text-2xl before:opacity-20 before:pointer-events-none',
      'huxiu': 'before:content-["🐅"] before:absolute before:top-4 before:right-4 before:text-2xl before:opacity-20 before:pointer-events-none',
      'douban': 'before:content-["🎬"] before:absolute before:top-4 before:right-4 before:text-2xl before:opacity-20 before:pointer-events-none',
      'hupu': 'before:content-["⚽"] before:absolute before:top-4 before:right-4 before:text-2xl before:opacity-20 before:pointer-events-none',
      'aggregated': 'before:content-["🌟"] before:absolute before:top-4 before:right-4 before:text-2xl before:opacity-20 before:pointer-events-none'
    };
    return patterns[platform as keyof typeof patterns] || '';
  };

  const handleTopicClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh(platform);
      setIsRefreshing(false);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', platform);
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(e, platform);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setIsDragging(false);
    onDragEnd?.(e);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver?.(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop?.(e, platform);
  };

  // Get the hot topics list to display
  const getDisplayTopics = () => {
    if (!data || !data.topics) return [];
    return showAll ? data.topics : data.topics.slice(0, 10);
  };

  const displayTopics = getDisplayTopics();
  const hasMoreTopics = data && data.topics && data.topics.length > 10;

  return (
    <div 
      ref={cardRef}
      className={`card platform-card group ${isDragging ? 'dragging' : ''} ${getCardBackground(platform)} ${getCardPattern(platform)} relative`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className="platform-icon group-hover:scale-110 group-hover:rotate-3"
              style={{ 
                background: `linear-gradient(135deg, ${color}dd, ${color}aa)`,
                boxShadow: `0 8px 32px ${color}40`
              }}
            >
              {icon}
            </div>
            <div className="flex-1">
              <h3 className="card-title group-hover:text-blue-600 transition-colors duration-300">
                {displayName}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                {data ? `${data.topics.length} hot topics` : 'Loading...'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Drag handle */}
            <div className="drag-handle">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
              </svg>
            </div>
            
            {/* Refresh button */}
            {onRefresh && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                className="card-refresh-btn"
                title="Refresh Data"
              >
                <svg 
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
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
            )}
          </div>
        </div>
      </div>
      
      <div className="min-h-[320px]">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {error && (
          <div className="px-6 py-12 text-center">
            <div className="text-red-500 text-sm">
              <p className="font-medium">Loading Failed</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          </div>
        )}
        
        {data && data.topics && data.topics.length > 0 && (
          <>
            <div className="divide-y divide-gray-100">
              {displayTopics.map((topic, index) => (
                <div key={index} className="hot-topic-item group/item">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <span className="text-sm font-bold text-slate-400 w-6 flex-shrink-0 text-center">
                        {topic.rank || index + 1}
                      </span>
                      <span 
                        className="hot-topic-link text-sm truncate flex-1 group-hover/item:text-blue-600"
                        onClick={() => topic.url && handleTopicClick(topic.url)}
                        title={topic.title}
                      >
                        {topic.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                      {topic.platforms && topic.platforms.length > 1 && (
                        <span className="platform-badge">
                          {topic.platforms.length} platforms
                        </span>
                      )}
                      {topic.hot && (
                        <span className="hot-badge">
                          {topic.hot}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Show more button */}
            {hasMoreTopics && (
              <div className="px-6 py-4 border-t border-slate-100/50 bg-gradient-to-r from-slate-50/50 to-white/50">
                <button
                  onClick={toggleShowAll}
                  className="w-full flex items-center justify-center space-x-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 px-4 py-3 rounded-xl transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-md"
                >
                  <span>
                    {showAll ? 'Collapse' : `Show More`}
                  </span>
                  {!showAll && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                      +{data.topics.length - 10}
                    </span>
                  )}
                  <svg 
                    className={`w-4 h-4 transition-all duration-300 ease-out ${showAll ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
        
        {data && data.topics && data.topics.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            <p>No hot topic data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformCard;
