import axios from 'axios';

const API_BASE_URL = 'https://60s.viki.moe';

export interface HotTopic {
  title: string;
  url?: string;
  hot?: number;
  rank?: number;
}

export interface PlatformResponse {
  platform: string;
  topics: HotTopic[];
  timestamp: number;
}

export class ApiService {
  private   static async fetchFrom60sAPI(endpoint: string): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'PulseHub/1.0.0'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching from 60s API ${endpoint}:`, error);
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
  }

  static generateHotValue(originalHot: any, rank: number): number {
    // If original hot value exists and is greater than 0, use the original value
    if (originalHot && originalHot > 0) {
      return originalHot;
    }
    
    // Otherwise generate hot value based on rank (higher rank = higher hot value)
    const baseHot = 100000;
    const rankMultiplier = Math.max(1, 50 - rank); // Rank 1-50 corresponds to multiplier 50-1
    return baseHot * rankMultiplier;
  }

  static async getWeiboHot(): Promise<PlatformResponse> {
    const data = await this.fetchFrom60sAPI('/v2/weibo');
    return {
      platform: 'weibo',
      topics: data.data?.map((item: any, index: number) => ({
        title: item.title || item.name || item.word,
        url: item.url || `https://s.weibo.com/weibo?q=${encodeURIComponent(item.title || item.name || item.word)}&typeall=1&suball=1`,
        hot: this.generateHotValue(item.hot || item.hot_value, index),
        rank: index + 1
      })) || [],
      timestamp: Date.now()
    };
  }

  static async getDouyinHot(): Promise<PlatformResponse> {
    const data = await this.fetchFrom60sAPI('/v2/douyin');
    return {
      platform: 'douyin',
      topics: data.data?.map((item: any, index: number) => ({
        title: item.title || item.name || item.word,
        url: item.url || `https://www.douyin.com/search/${encodeURIComponent(item.title || item.name || item.word)}?type=general`,
        hot: this.generateHotValue(item.hot || item.hot_value, index),
        rank: index + 1
      })) || [],
      timestamp: Date.now()
    };
  }

  static async getBilibiliHot(): Promise<PlatformResponse> {
    const data = await this.fetchFrom60sAPI('/v2/bili');
    return {
      platform: 'bilibili',
      topics: data.data?.map((item: any, index: number) => ({
        title: item.title || item.name || item.word,
        url: item.url || `https://search.bilibili.com/all?keyword=${encodeURIComponent(item.title || item.name || item.word)}&order=pubdate`,
        hot: this.generateHotValue(item.hot || item.hot_value, index),
        rank: index + 1
      })) || [],
      timestamp: Date.now()
    };
  }

  static async getZhihuHot(): Promise<PlatformResponse> {
    const data = await this.fetchFrom60sAPI('/v2/zhihu');
    return {
      platform: 'zhihu',
      topics: data.data?.map((item: any, index: number) => ({
        title: item.title || item.name || item.word,
        url: item.url || `https://www.zhihu.com/search?q=${encodeURIComponent(item.title || item.name || item.word)}&type=content`,
        hot: this.generateHotValue(item.hot || item.hot_value, index),
        rank: index + 1
      })) || [],
      timestamp: Date.now()
    };
  }

  static async getBaiduHot(): Promise<PlatformResponse> {
    const data = await this.fetchFrom60sAPI('/v2/baidu/hot');
    return {
      platform: 'baidu',
      topics: data.data?.map((item: any, index: number) => ({
        title: item.title || item.name || item.word,
        url: item.url || `https://www.baidu.com/s?wd=${encodeURIComponent(item.title || item.name || item.word)}&tn=baidu&ie=utf-8`,
        hot: this.generateHotValue(item.hot || item.hot_value, index),
        rank: index + 1
      })) || [],
      timestamp: Date.now()
    };
  }

  static async getToutiaoHot(): Promise<PlatformResponse> {
    const data = await this.fetchFrom60sAPI('/v2/toutiao');
    return {
      platform: 'toutiao',
      topics: data.data?.map((item: any, index: number) => ({
        title: item.title || item.name || item.word,
        url: item.url || `https://www.toutiao.com/search/?keyword=${encodeURIComponent(item.title || item.name || item.word)}&autocomplete=true`,
        hot: this.generateHotValue(item.hot || item.hot_value, index),
        rank: index + 1
      })) || [],
      timestamp: Date.now()
    };
  }

  static async get36krHot(): Promise<PlatformResponse> {
    // Use mock data since 60s API doesn't have 36Kr endpoint
    const mockTopics = [
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
    ];

    return {
      platform: '36kr',
      topics: mockTopics.map((item, index) => ({
        title: item.title,
        url: `https://36kr.com/search/articles/${encodeURIComponent(item.title)}`,
        hot: this.generateHotValue(item.hot, index),
        rank: index + 1
      })),
      timestamp: Date.now()
    };
  }

  static async getHuxiuHot(): Promise<PlatformResponse> {
    // Use mock data
    const mockTopics = [
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
    ];

    return {
      platform: 'huxiu',
      topics: mockTopics.map((item, index) => ({
        title: item.title,
        url: `https://www.huxiu.com/search?q=${encodeURIComponent(item.title)}`,
        hot: this.generateHotValue(item.hot, index),
        rank: index + 1
      })),
      timestamp: Date.now()
    };
  }

  static async getDoubanHot(): Promise<PlatformResponse> {
    // Use mock data
    const mockTopics = [
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
    ];

    return {
      platform: 'douban',
      topics: mockTopics.map((item, index) => ({
        title: item.title,
        url: `https://movie.douban.com/subject_search?search_text=${encodeURIComponent(item.title)}`,
        hot: this.generateHotValue(item.hot, index),
        rank: index + 1
      })),
      timestamp: Date.now()
    };
  }

  static async getHupuHot(): Promise<PlatformResponse> {
    // Use mock data
    const mockTopics = [
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
    ];

    return {
      platform: 'hupu',
      topics: mockTopics.map((item, index) => ({
        title: item.title,
        url: `https://bbs.hupu.com/search?q=${encodeURIComponent(item.title)}`,
        hot: this.generateHotValue(item.hot, index),
        rank: index + 1
      })),
      timestamp: Date.now()
    };
  }

}
