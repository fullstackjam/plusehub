import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { PlatformData } from './types';
import { ApiService } from './services/api';

const PLATFORM_CONFIG = [
  {
    platform: 'weibo',
    displayName: '微博热搜',
    icon: '微',
    color: '#ff6b35'
  },
  {
    platform: 'douyin',
    displayName: '抖音热榜',
    icon: '抖',
    color: '#000000'
  },
  {
    platform: 'bilibili',
    displayName: '哔哩哔哩',
    icon: 'B',
    color: '#00a1d6'
  },
  {
    platform: 'zhihu',
    displayName: '知乎热榜',
    icon: '知',
    color: '#0084ff'
  },
  {
    platform: 'baidu',
    displayName: '百度热搜',
    icon: '百',
    color: '#2932e1'
  },
  {
    platform: 'toutiao',
    displayName: '今日头条',
    icon: '头',
    color: '#ff6600'
  },
  {
    platform: '36kr',
    displayName: '36氪热榜',
    icon: '36',
    color: '#00d4aa'
  },
  {
    platform: 'huxiu',
    displayName: '虎嗅热文',
    icon: '虎',
    color: '#ff6b35'
  },
  {
    platform: 'douban',
    displayName: '豆瓣新片',
    icon: '豆',
    color: '#007722'
  },
  {
    platform: 'hupu',
    displayName: '虎扑热帖',
    icon: '虎',
    color: '#ff6b35'
  },
  {
    platform: 'aggregated',
    displayName: '聚合热搜',
    icon: '🔥',
    color: '#ff6b35'
  }
];

function App() {
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializePlatforms();
  }, []);

  const initializePlatforms = () => {
    const initialPlatforms: PlatformData[] = PLATFORM_CONFIG.map(config => ({
      platform: config.platform,
      displayName: config.displayName,
      icon: config.icon,
      color: config.color,
      data: null,
      loading: true,
      error: null
    }));

    setPlatforms(initialPlatforms);
    fetchAllData(initialPlatforms);
  };

  const fetchAllData = async (platformList: PlatformData[]) => {
    try {
      const data = await ApiService.fetchAllPlatforms();
      
      const updatedPlatforms = platformList.map(platform => {
        const platformData = data[platform.platform];
        return {
          ...platform,
          data: platformData || null,
          loading: false,
          error: platformData ? null : '数据获取失败'
        };
      });

      setPlatforms(updatedPlatforms);
    } catch (error) {
      console.error('Error fetching platform data:', error);
      
      const updatedPlatforms = platformList.map(platform => ({
        ...platform,
        loading: false,
        error: '网络连接失败'
      }));

      setPlatforms(updatedPlatforms);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setLoading(true);
    const updatedPlatforms = platforms.map(platform => ({
      ...platform,
      loading: true,
      error: null
    }));
    setPlatforms(updatedPlatforms);
    await fetchAllData(updatedPlatforms);
  };

  if (loading && platforms.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">正在加载热点数据...</p>
          <p className="text-slate-500 text-sm mt-2">请稍候，正在为您聚合最新热点</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Dashboard 
        platforms={platforms} 
        onPlatformsChange={setPlatforms}
      />
      
      {/* Refresh Button */}
      <button
        onClick={refreshData}
        disabled={loading}
        className="refresh-button group"
        title="刷新数据"
      >
        <svg 
          className={`w-6 h-6 transition-all duration-300 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} 
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
  );
}

export default App;
