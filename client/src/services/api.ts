import axios from 'axios';
import type { UrlData, StatsData } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createShortUrl = async (
  url: string,
  customAlias?: string
): Promise<UrlData> => {
  const payload: Record<string, string> = { url };
  if (customAlias) payload.customAlias = customAlias;
  const { data } = await api.post<UrlData>('/api/shorten', payload);
  return data;
};

export const getAllUrls = async (): Promise<UrlData[]> => {
  const { data } = await api.get<UrlData[]>('/api/shorten');
  return data;
};

export const getUrl = async (shortCode: string): Promise<UrlData> => {
  const { data } = await api.get<UrlData>(`/api/shorten/${shortCode}`);
  return data;
};

export const updateUrl = async (
  shortCode: string,
  url: string
): Promise<UrlData> => {
  const { data } = await api.put<UrlData>(`/api/shorten/${shortCode}`, { url });
  return data;
};

export const deleteUrl = async (shortCode: string): Promise<void> => {
  await api.delete(`/api/shorten/${shortCode}`);
};

export const getStats = async (shortCode: string): Promise<StatsData> => {
  const { data } = await api.get<StatsData>(`/api/shorten/${shortCode}/stats`);
  return data;
};

export const getRedirectUrl = (shortCode: string): string => {
  return `${API_URL}/${shortCode}`;
};
