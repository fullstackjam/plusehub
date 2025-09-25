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
    // 如果原始热度值存在且大于0，使用原始值
    if (originalHot && originalHot > 0) {
      return originalHot;
    }
    
    // 否则根据排名生成热度值（排名越靠前热度越高）
    const baseHot = 100000;
    const rankMultiplier = Math.max(1, 50 - rank); // 排名1-50对应50-1的倍数
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
    // 使用模拟数据，因为60s API没有36氪端点
    const mockTopics = [
      { title: "小米17系列发布，起售价4499元", hot: 120000 },
      { title: "雷军年度演讲：小米的过去、现在和未来", hot: 98000 },
      { title: "AI大模型在医疗领域的应用突破", hot: 85000 },
      { title: "新能源汽车销量再创新高", hot: 76000 },
      { title: "5G技术推动智慧城市建设", hot: 68000 },
      { title: "区块链技术在金融领域的创新应用", hot: 59000 },
      { title: "人工智能助力制造业转型升级", hot: 52000 },
      { title: "云计算市场持续增长", hot: 48000 },
      { title: "物联网设备连接数突破百亿", hot: 42000 },
      { title: "量子计算技术取得重要进展", hot: 38000 }
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
    // 使用模拟数据
    const mockTopics = [
      { title: "深度解析：为什么小米17能成为爆款", hot: 150000 },
      { title: "科技巨头们的AI布局策略分析", hot: 120000 },
      { title: "新能源汽车产业链投资机会", hot: 98000 },
      { title: "5G时代下的商业模式创新", hot: 85000 },
      { title: "人工智能在医疗健康领域的应用前景", hot: 76000 },
      { title: "区块链技术如何重塑金融行业", hot: 68000 },
      { title: "云计算服务商竞争格局分析", hot: 59000 },
      { title: "物联网安全挑战与解决方案", hot: 52000 },
      { title: "量子计算商业化进程加速", hot: 48000 },
      { title: "边缘计算技术发展趋势", hot: 42000 }
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
    // 使用模拟数据
    const mockTopics = [
      { title: "《热辣滚烫》票房突破30亿", hot: 180000 },
      { title: "《繁花》电视剧引发热议", hot: 150000 },
      { title: "《流浪地球3》预告片发布", hot: 120000 },
      { title: "《封神第二部》定档春节", hot: 98000 },
      { title: "《长安三万里》动画电影", hot: 85000 },
      { title: "《消失的她》悬疑片", hot: 76000 },
      { title: "《满江红》古装片", hot: 68000 },
      { title: "《深海》动画电影", hot: 59000 },
      { title: "《中国乒乓》体育片", hot: 52000 },
      { title: "《无名》谍战片", hot: 48000 }
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
    // 使用模拟数据
    const mockTopics = [
      { title: "NBA总决赛激战正酣", hot: 200000 },
      { title: "世界杯预选赛中国队表现", hot: 180000 },
      { title: "CBA新赛季看点分析", hot: 150000 },
      { title: "欧冠淘汰赛精彩对决", hot: 120000 },
      { title: "中超联赛积分榜变化", hot: 98000 },
      { title: "网球大满贯赛事回顾", hot: 85000 },
      { title: "电竞世界赛精彩瞬间", hot: 76000 },
      { title: "奥运会备战情况更新", hot: 68000 },
      { title: "F1赛车赛季总结", hot: 59000 },
      { title: "高尔夫大师赛精彩集锦", hot: 52000 }
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
