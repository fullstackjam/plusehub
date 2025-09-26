import { PlatformResponse } from '../types';

const API_BASE_URL = 'https://60s.viki.moe';

export class ApiService {
  private static async fetchFrom60sAPI(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'PulseHub/1.0.0',
          'Accept': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error(`Error fetching from 60s API ${endpoint}:`, error);
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
  }

  static async fetchPlatformData(platform: string): Promise<PlatformResponse> {
    const endpointMap: Record<string, string> = {
      weibo: '/v2/weibo',
      douyin: '/v2/douyin',
      bilibili: '/v2/bili',
      zhihu: '/v2/zhihu',
      baidu: '/v2/baidu/hot',
      toutiao: '/v2/toutiao',
    };

    const endpoint = endpointMap[platform];
    if (!endpoint) {
      throw new Error(`Platform ${platform} is not supported by the API`);
    }

    const data = await this.fetchFrom60sAPI(endpoint);
    return this.transformData(platform, data);
  }

  private static generateHotValue(originalHot: any, rank: number): number {
    // If original hot value exists and is greater than 0, use the original value
    if (originalHot && originalHot > 0) {
      return originalHot;
    }
    
    // Otherwise generate hot value based on rank (higher rank = higher hot value)
    const baseHot = 100000;
    const rankMultiplier = Math.max(1, 50 - rank); // Rank 1-50 corresponds to multiplier 50-1
    return baseHot * rankMultiplier;
  }

  private static transformData(platform: string, data: any): PlatformResponse {
    const urlTemplates: Record<string, string> = {
      weibo: 'https://s.weibo.com/weibo?q={query}&typeall=1&suball=1',
      douyin: 'https://www.douyin.com/search/{query}?type=general',
      bilibili: 'https://search.bilibili.com/all?keyword={query}&order=pubdate',
      zhihu: 'https://www.zhihu.com/search?q={query}&type=content',
      baidu: 'https://www.baidu.com/s?wd={query}&tn=baidu&ie=utf-8',
      toutiao: 'https://www.toutiao.com/search/?keyword={query}&autocomplete=true',
    };

    const urlTemplate = urlTemplates[platform] || 'https://www.baidu.com/s?wd={query}';

    return {
      platform,
      topics: data.data?.map((item: any, index: number) => ({
        title: item.title || item.name || item.word,
        url: item.url || urlTemplate.replace('{query}', encodeURIComponent(item.title || item.name || item.word)),
        hot: this.generateHotValue(item.hot || item.hot_value, index),
        rank: index + 1
      })) || [],
      timestamp: Date.now()
    };
  }


  static async fetchAllPlatforms(): Promise<Record<string, PlatformResponse>> {
    const platforms = ['weibo', 'douyin', 'bilibili', 'zhihu', 'baidu', 'toutiao'];
    
    const promises = platforms.map(async (platform) => {
      try {
        const data = await this.fetchPlatformData(platform);
        return { platform, data };
      } catch (error) {
        console.error(`Error fetching ${platform}:`, error);
        return { platform, data: null };
      }
    });

    const results = await Promise.all(promises);
    
    const platformData = results.reduce((acc, { platform, data }) => {
      if (data) {
        acc[platform] = data;
      }
      return acc;
    }, {} as Record<string, PlatformResponse>);

    // Generate aggregated hot topics
    const aggregatedData = this.generateAggregatedHotTopics(platformData);
    if (aggregatedData) {
      platformData['aggregated'] = aggregatedData;
    }

    return platformData;
  }

  static generateAggregatedHotTopics(platformData: Record<string, PlatformResponse>): PlatformResponse | null {
    const topicMap = new Map<string, { platforms: string[]; hot: number; url: string }>();

    // Collect hot topics from all platforms
    Object.entries(platformData).forEach(([platform, data]) => {
      if (data && data.topics) {
        data.topics.forEach(topic => {
          const title = topic.title.toLowerCase().trim();
          if (title.length > 2) { // Filter titles that are too short
            if (topicMap.has(title)) {
              const existing = topicMap.get(title)!;
              existing.platforms.push(platform);
              existing.hot = Math.max(existing.hot, topic.hot || 0);
            } else {
              topicMap.set(title, {
                platforms: [platform],
                hot: topic.hot || 0,
                url: topic.url || ''
              });
            }
          }
        });
      }
    });

    // Find hot topics that appear on multiple platforms
    const multiPlatformTopics = Array.from(topicMap.entries())
      .filter(([_, data]) => data.platforms.length >= 2)
      .map(([title, data]) => ({
        title: title,
        platforms: data.platforms,
        hot: data.hot,
        url: data.url
      }))
      .sort((a, b) => b.platforms.length - a.platforms.length || b.hot - a.hot)
      .slice(0, 10);

    if (multiPlatformTopics.length === 0) {
      return null;
    }

    return {
      platform: 'aggregated',
      topics: multiPlatformTopics.map((topic, index) => ({
        title: topic.title,
        url: topic.url || `https://www.baidu.com/s?wd=${encodeURIComponent(topic.title)}`,
        hot: topic.hot,
        rank: index + 1,
        platforms: topic.platforms
      })),
      timestamp: Date.now()
    };
  }
}
