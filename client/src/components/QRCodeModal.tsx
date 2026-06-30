import { useCallback, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FiDownload, FiX } from 'react-icons/fi';
import { getRedirectUrl } from '../services/api';

interface QRCodeModalProps {
  shortCode: string;
  onClose: () => void;
}

export default function QRCodeModal({ shortCode, onClose }: QRCodeModalProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const shortUrl = getRedirectUrl(shortCode);

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

  const handleDownload = useCallback(() => {
    const svgElement = qrRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 512, 512);
        ctx.drawImage(img, 0, 0, 512, 512);

        const link = document.createElement('a');
        link.download = `snip-${shortCode}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  }, [shortCode]);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-panel" role="dialog" aria-label="QR Code">
        <div className="stats-header">
          <h2 className="stats-title gradient-text">QR Code</h2>
          <button className="stats-close" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </div>

        <div className="qr-content">
          <div className="qr-wrapper" ref={qrRef}>
            <QRCodeSVG
              value={shortUrl}
              size={256}
              level="H"
              includeMargin={false}
              bgColor="#ffffff"
              fgColor="#0a0a0f"
            />
          </div>

          <p className="qr-url">{shortUrl}</p>

          <button className="qr-download" onClick={handleDownload}>
            <FiDownload size={16} />
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}
