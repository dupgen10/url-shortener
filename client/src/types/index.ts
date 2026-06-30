export interface UrlData {
  _id: string;
  url: string;
  shortCode: string;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClickData {
  _id: string;
  shortCode: string;
  timestamp: string;
  device: string;
  browser: string;
  referrer?: string;
}

export interface StatsData extends UrlData {
  clicks: ClickData[];
}
