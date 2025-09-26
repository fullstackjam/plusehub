export interface HotTopic {
  title: string;
  url?: string;
  hot?: number;
  rank?: number;
  platforms?: string[];
}

export interface PlatformResponse {
  platform: string;
  topics: HotTopic[];
  timestamp: number;
}

export interface PlatformData {
  platform: string;
  displayName: string;
  icon: string;
  color: string;
  data: PlatformResponse | null;
  loading: boolean;
  error: string | null;
}
