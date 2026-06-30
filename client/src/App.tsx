import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import './App.css';
import type { UrlData } from './types';
import { createShortUrl, getAllUrls, deleteUrl } from './services/api';
import Layout from './components/Layout';
import Hero from './components/Hero';
import UrlList from './components/UrlList';
import StatsModal from './components/StatsModal';
import QRCodeModal from './components/QRCodeModal';
import Toast from './components/Toast';

export default function App() {
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShorting, setIsShorting] = useState(false);
  const [statsCode, setStatsCode] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  // Fetch all URLs on mount
  const fetchUrls = useCallback(async () => {
    try {
      const data = await getAllUrls();
      setUrls(data);
    } catch {
      toast.error('Failed to load links');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  // Shorten URL
  const handleShorten = async (url: string, customAlias?: string) => {
    setIsShorting(true);
    try {
      const newUrl = await createShortUrl(url, customAlias);
      setUrls((prev) => [newUrl, ...prev]);
      toast.success('Link created successfully!');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to shorten URL';
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err
      ) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        toast.error(axiosErr.response?.data?.error || message);
      } else {
        toast.error(message);
      }
    } finally {
      setIsShorting(false);
    }
  };

  // Delete URL
  const handleDelete = async (shortCode: string) => {
    try {
      await deleteUrl(shortCode);
      setUrls((prev) => prev.filter((u) => u.shortCode !== shortCode));
      toast.success('Link deleted');
    } catch {
      toast.error('Failed to delete link');
    }
  };

  // Modal handlers
  const handleViewStats = (shortCode: string) => setStatsCode(shortCode);
  const handleCloseStats = useCallback(() => setStatsCode(null), []);

  const handleViewQR = (shortCode: string) => setQrCode(shortCode);
  const handleCloseQR = useCallback(() => setQrCode(null), []);

  return (
    <>
      <Toast />
      <Layout>
        <Hero onShorten={handleShorten} isLoading={isShorting} />
        <UrlList
          urls={urls}
          isLoading={isLoading}
          onDelete={handleDelete}
          onViewStats={handleViewStats}
          onViewQR={handleViewQR}
        />
      </Layout>

      {/* Modals */}
      {statsCode && (
        <StatsModal shortCode={statsCode} onClose={handleCloseStats} />
      )}
      {qrCode && (
        <QRCodeModal shortCode={qrCode} onClose={handleCloseQR} />
      )}
    </>
  );
}
