import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import { PlatformData } from './types';
import { ApiService } from './services/api';

const PLATFORM_CONFIG = [
  {
    platform: 'weibo',
    displayName: 'Weibo Hot Search',
    icon: 'W',
    color: '#ff6b35'
  },
  {
    platform: 'douyin',
    displayName: 'Douyin Hot List',
    icon: 'D',
    color: '#000000'
  },
  {
    platform: 'bilibili',
    displayName: 'Bilibili Hot List',
    icon: 'B',
    color: '#00a1d6'
  },
  {
    platform: 'zhihu',
    displayName: 'Zhihu Hot List',
    icon: 'Z',
    color: '#0084ff'
  },
  {
    platform: 'baidu',
    displayName: 'Baidu Hot Search',
    icon: 'B',
    color: '#2932e1'
  },
  {
    platform: 'toutiao',
    displayName: 'Toutiao Hot List',
    icon: 'T',
    color: '#ff6600'
  },
  {
    platform: '36kr',
    displayName: '36Kr Hot List',
    icon: '36',
    color: '#00d4aa'
  },
  {
    platform: 'huxiu',
    displayName: 'Huxiu Hot Articles',
    icon: 'H',
    color: '#ff6b35'
  },
  {
    platform: 'douban',
    displayName: 'Douban Hot Movies',
    icon: 'D',
    color: '#007722'
  },
  {
    platform: 'hupu',
    displayName: 'Hupu Hot Posts',
    icon: 'H',
    color: '#ff6b35'
  },
  {
    platform: 'aggregated',
    displayName: 'Aggregated Hot Topics',
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
          error: platformData ? null : 'Data fetch failed'
        };
      });

      setPlatforms(updatedPlatforms);
    } catch (error) {
      console.error('Error fetching platform data:', error);
      
      const updatedPlatforms = platformList.map(platform => ({
        ...platform,
        loading: false,
        error: 'Network connection failed'
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
          <p className="text-slate-600 text-lg font-medium">Loading hot topics data...</p>
          <p className="text-slate-500 text-sm mt-2">Please wait, aggregating the latest hot topics for you</p>
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
        title="Refresh Data"
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
