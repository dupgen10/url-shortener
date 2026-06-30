import { FiExternalLink, FiBarChart2, FiTrash2, FiMousePointer, FiClock } from 'react-icons/fi';
import { HiOutlineQrCode } from 'react-icons/hi2';
import type { UrlData } from '../types';
import { getRedirectUrl } from '../services/api';
import CopyButton from './CopyButton';

interface UrlCardProps {
  data: UrlData;
  index: number;
  onDelete: (shortCode: string) => void;
  onViewStats: (shortCode: string) => void;
  onViewQR: (shortCode: string) => void;
}

export default function UrlCard({
  data,
  index,
  onDelete,
  onViewStats,
  onViewQR,
}: UrlCardProps) {
  const shortUrl = getRedirectUrl(data.shortCode);
  const createdDate = new Date(data.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="url-card"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Short URL */}
      <div className="url-card-short">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="url-card-short-link"
        >
          {shortUrl.replace(/^https?:\/\//, '')}
        </a>
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Open link"
          style={{ color: 'var(--text-muted)', flexShrink: 0 }}
        >
          <FiExternalLink size={14} />
        </a>
      </div>

      {/* Original URL */}
      <div className="url-card-original" title={data.url}>
        {data.url}
      </div>

      {/* Meta */}
      <div className="url-card-meta">
        <span className="url-card-meta-item">
          <FiMousePointer size={12} />
          {data.accessCount} click{data.accessCount !== 1 ? 's' : ''}
        </span>
        <span className="url-card-meta-item">
          <FiClock size={12} />
          {createdDate}
        </span>
      </div>

      {/* Actions */}
      <div className="url-card-actions">
        <CopyButton text={shortUrl} label="Copy" />
        <button
          className="action-btn"
          onClick={() => onViewQR(data.shortCode)}
          title="QR Code"
        >
          <HiOutlineQrCode size={14} />
          QR
        </button>
        <button
          className="action-btn"
          onClick={() => onViewStats(data.shortCode)}
          title="View stats"
        >
          <FiBarChart2 size={14} />
          Stats
        </button>
        <button
          className="action-btn delete"
          onClick={() => onDelete(data.shortCode)}
          title="Delete"
        >
          <FiTrash2 size={14} />
        </button>
      </div>
    </div>
  );
}
