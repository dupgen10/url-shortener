import { Toaster } from 'react-hot-toast';

export default function Toast() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: 'rgba(18, 18, 26, 0.95)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          backdropFilter: 'blur(20px)',
          fontSize: '0.875rem',
          fontFamily: "'Inter', sans-serif",
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}
