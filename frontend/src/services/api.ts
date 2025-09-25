import { PlatformResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

export class ApiService {
  static async fetchPlatformData(platform: string): Promise<PlatformResponse> {
    const response = await fetch(`${API_BASE_URL}/${platform}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ${platform} data: ${response.statusText}`);
    }
    
    return response.json();
  }

  static async fetchAllPlatforms(): Promise<Record<string, PlatformResponse>> {
    const platforms = ['weibo', 'douyin', 'bilibili', 'zhihu', 'baidu', 'toutiao', '36kr', 'huxiu', 'douban', 'hupu'];
    
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

    // 生成聚合热搜
    const aggregatedData = this.generateAggregatedHotTopics(platformData);
    if (aggregatedData) {
      platformData['aggregated'] = aggregatedData;
    }

    return platformData;
  }

  static generateAggregatedHotTopics(platformData: Record<string, PlatformResponse>): PlatformResponse | null {
    const topicMap = new Map<string, { platforms: string[]; hot: number; url: string }>();

    // 收集所有平台的热搜
    Object.entries(platformData).forEach(([platform, data]) => {
      if (data && data.topics) {
        data.topics.forEach(topic => {
          const title = topic.title.toLowerCase().trim();
          if (title.length > 2) { // 过滤太短的标题
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

    // 找出在多个平台都出现的热搜
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
