import React, { useState } from 'react';
import PlatformCard from './PlatformCard';
import { PlatformData } from '../types';
import { ApiService } from '../services/api';

interface DashboardProps {
  platforms: PlatformData[];
  onPlatformsChange?: (platforms: PlatformData[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ platforms, onPlatformsChange }) => {
  const [draggedPlatform, setDraggedPlatform] = useState<string | null>(null);

  const handleRefresh = async (platform: string) => {
    try {
      const data = await ApiService.fetchPlatformData(platform);
      const updatedPlatforms = platforms.map(p => 
        p.platform === platform 
          ? { ...p, data, loading: false, error: null }
          : p
      );
      onPlatformsChange?.(updatedPlatforms);
    } catch (error) {
      console.error(`Error refreshing ${platform}:`, error);
      const updatedPlatforms = platforms.map(p => 
        p.platform === platform 
          ? { ...p, loading: false, error: '刷新失败' }
          : p
      );
      onPlatformsChange?.(updatedPlatforms);
    }
  };

  const handleDragStart = (_e: React.DragEvent, platform: string) => {
    setDraggedPlatform(platform);
  };

  const handleDragEnd = (_e: React.DragEvent) => {
    setDraggedPlatform(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetPlatform: string) => {
    e.preventDefault();
    
    if (draggedPlatform && draggedPlatform !== targetPlatform) {
      const draggedIndex = platforms.findIndex(p => p.platform === draggedPlatform);
      const targetIndex = platforms.findIndex(p => p.platform === targetPlatform);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newPlatforms = [...platforms];
        const [draggedItem] = newPlatforms.splice(draggedIndex, 1);
        newPlatforms.splice(targetIndex, 0, draggedItem);
        onPlatformsChange?.(newPlatforms);
      }
    }
    
    setDraggedPlatform(null);
  };

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="header-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <span className="text-white text-xl font-bold">P</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">PulseHub</h1>
                <p className="mt-2 text-slate-300 text-lg">实时热搜聚合平台</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-slate-300 text-sm mb-1">最后更新</div>
              <div className="text-white font-medium">
                {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {platforms.map((platform) => (
            <PlatformCard 
              key={platform.platform} 
              platformData={platform}
              onRefresh={handleRefresh}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
        
        {/* Empty State */}
        {platforms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <p className="text-lg font-medium">暂无平台数据</p>
              <p className="text-sm mt-2">请检查网络连接或稍后重试</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
