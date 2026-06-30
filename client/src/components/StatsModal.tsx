import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import type { StatsData, ClickData } from '../types';
import { getStats } from '../services/api';
import toast from 'react-hot-toast';

interface StatsModalProps {
  shortCode: string;
  onClose: () => void;
}

function aggregateField(clicks: ClickData[], field: 'device' | 'browser' | 'referrer') {
  const map: Record<string, number> = {};
  for (const click of clicks) {
    const key = click[field] || 'Unknown';
    map[key] = (map[key] || 0) + 1;
  }
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
}

function BarList({
  items,
  total,
}: {
  items: [string, number][];
  total: number;
}) {
  if (items.length === 0) {
    return <div className="stats-no-data">No data available</div>;
  }
  return (
    <div className="stats-bar-list">
      {items.map(([label, count]) => (
        <div key={label} className="stats-bar-item">
          <span className="stats-bar-label" title={label}>{label}</span>
          <div className="stats-bar-track">
            <div
              className="stats-bar-fill"
              style={{ width: `${Math.max((count / total) * 100, 4)}%` }}
            />
          </div>
          <span className="stats-bar-count">{count}</span>
        </div>
      ))}
    </div>
  );
}

export default function StatsModal({ shortCode, onClose }: StatsModalProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats(shortCode);
        setStats(data);
      } catch {
        toast.error('Failed to load stats');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [shortCode, onClose]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const clicks = stats?.clicks || [];
  const total = clicks.length;

  // Last 7 days
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentClicks = clicks.filter(
    (c) => new Date(c.timestamp).getTime() > sevenDaysAgo
  );

  const devices = aggregateField(clicks, 'device');
  const browsers = aggregateField(clicks, 'browser');
  const referrers = aggregateField(clicks, 'referrer');

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-panel" role="dialog" aria-label="Link statistics">
        <div className="stats-header">
          <h2 className="stats-title gradient-text">Analytics</h2>
          <button className="stats-close" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        {loading ? (
          <div className="stats-loading">
            <div className="spinner" />
          </div>
        ) : stats ? (
          <>
            {/* Summary cards */}
            <div className="stats-summary">
              <div className="stats-stat-card">
                <div className="stats-stat-value gradient-text">
                  {stats.accessCount}
                </div>
                <div className="stats-stat-label">Total Clicks</div>
              </div>
              <div className="stats-stat-card">
                <div className="stats-stat-value gradient-text">
                  {recentClicks.length}
                </div>
                <div className="stats-stat-label">Last 7 Days</div>
              </div>
            </div>

            {/* Recent clicks */}
            <div className="stats-section">
              <h3 className="stats-section-title">Recent Clicks</h3>
              {recentClicks.length > 0 ? (
                <div className="stats-clicks-list">
                  {recentClicks.slice(0, 20).map((click) => (
                    <div key={click._id} className="stats-click-row">
                      <span className="stats-click-time">
                        {new Date(click.timestamp).toLocaleString()}
                      </span>
                      <span className="stats-click-info">
                        {click.device} · {click.browser}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="stats-no-data">No clicks in the last 7 days</div>
              )}
            </div>

            {/* Device breakdown */}
            <div className="stats-section">
              <h3 className="stats-section-title">Devices</h3>
              <BarList items={devices} total={total} />
            </div>

            {/* Browser breakdown */}
            <div className="stats-section">
              <h3 className="stats-section-title">Browsers</h3>
              <BarList items={browsers} total={total} />
            </div>

            {/* Referrer sources */}
            <div className="stats-section">
              <h3 className="stats-section-title">Referrers</h3>
              <BarList items={referrers} total={total} />
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
