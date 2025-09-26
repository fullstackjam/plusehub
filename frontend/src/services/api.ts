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
      // For platforms not supported by 60s API, return mock data
      return this.getMockData(platform);
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

  private static getMockData(platform: string): PlatformResponse {
    const mockDataMap: Record<string, any[]> = {
      '36kr': [
        { title: "Xiaomi 17 Series Released, Starting Price 4499 Yuan", hot: 120000 },
        { title: "Lei Jun Annual Speech: Xiaomi's Past, Present and Future", hot: 98000 },
        { title: "AI Large Model Breakthrough in Medical Field", hot: 85000 },
        { title: "New Energy Vehicle Sales Hit New High", hot: 76000 },
        { title: "5G Technology Drives Smart City Construction", hot: 68000 },
        { title: "Blockchain Technology Innovation in Financial Field", hot: 59000 },
        { title: "AI Helps Manufacturing Industry Transformation", hot: 52000 },
        { title: "Cloud Computing Market Continues to Grow", hot: 48000 },
        { title: "IoT Device Connections Exceed 10 Billion", hot: 42000 },
        { title: "Quantum Computing Technology Makes Important Progress", hot: 38000 }
      ],
      'huxiu': [
        { title: "In-depth Analysis: Why Xiaomi 17 Became a Hit", hot: 150000 },
        { title: "Analysis of Tech Giants' AI Strategy Layout", hot: 120000 },
        { title: "Investment Opportunities in New Energy Vehicle Industry Chain", hot: 98000 },
        { title: "Business Model Innovation in the 5G Era", hot: 85000 },
        { title: "AI Application Prospects in Medical Health Field", hot: 76000 },
        { title: "How Blockchain Technology Reshapes Financial Industry", hot: 68000 },
        { title: "Cloud Computing Service Provider Competition Analysis", hot: 59000 },
        { title: "IoT Security Challenges and Solutions", hot: 52000 },
        { title: "Quantum Computing Commercialization Process Accelerates", hot: 48000 },
        { title: "Edge Computing Technology Development Trends", hot: 42000 }
      ],
      'douban': [
        { title: "'YOLO' Box Office Breaks 3 Billion", hot: 180000 },
        { title: "'Blossoms Shanghai' TV Series Sparks Discussion", hot: 150000 },
        { title: "'The Wandering Earth 3' Trailer Released", hot: 120000 },
        { title: "'Creation of the Gods II' Scheduled for Spring Festival", hot: 98000 },
        { title: "'Chang'an 30,000 Miles' Animated Movie", hot: 85000 },
        { title: "'Lost in the Stars' Suspense Film", hot: 76000 },
        { title: "'Full River Red' Period Drama", hot: 68000 },
        { title: "'Deep Sea' Animated Movie", hot: 59000 },
        { title: "'Ping Pong of China' Sports Film", hot: 52000 },
        { title: "'Hidden Blade' Spy Film", hot: 48000 }
      ],
      'hupu': [
        { title: "NBA Finals Battle Intensifies", hot: 200000 },
        { title: "China Team Performance in World Cup Qualifiers", hot: 180000 },
        { title: "CBA New Season Highlights Analysis", hot: 150000 },
        { title: "Champions League Knockout Exciting Matchups", hot: 120000 },
        { title: "Chinese Super League Standings Changes", hot: 98000 },
        { title: "Tennis Grand Slam Tournament Review", hot: 85000 },
        { title: "Esports World Championship Highlights", hot: 76000 },
        { title: "Olympic Games Preparation Updates", hot: 68000 },
        { title: "F1 Racing Season Summary", hot: 59000 },
        { title: "Golf Masters Tournament Highlights", hot: 52000 }
      ]
    };

    const mockTopics = mockDataMap[platform] || [];
    const urlTemplates: Record<string, string> = {
      '36kr': 'https://36kr.com/search/articles/{query}',
      'huxiu': 'https://www.huxiu.com/search?q={query}',
      'douban': 'https://movie.douban.com/subject_search?search_text={query}',
      'hupu': 'https://bbs.hupu.com/search?q={query}',
    };

    const urlTemplate = urlTemplates[platform] || 'https://www.baidu.com/s?wd={query}';

    return {
      platform,
      topics: mockTopics.map((item, index) => ({
        title: item.title,
        url: urlTemplate.replace('{query}', encodeURIComponent(item.title)),
        hot: this.generateHotValue(item.hot, index),
        rank: index + 1
      })),
      timestamp: Date.now()
    };
  }

  static async fetchAllPlatforms(): Promise<Record<string, PlatformResponse>> {
    const platforms = ['weibo', 'douyin', 'bilibili', 'zhihu', 'baidu', 'toutiao', '36kr', 'huxiu', 'douban', 'hupu'];
    
    const promises = platforms.map(async (platform) => {
      try {
        const data = await this.fetchPlatformData(platform);
        return { platform, data };
      } catch (error) {
        console.error(`Error fetching ${platform}:`, error);
        // Return mock data as fallback
        return { platform, data: this.getMockData(platform) };
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
