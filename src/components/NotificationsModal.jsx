"use client";
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const CloseIcon = ({width=20,height=20}) => (
  <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M18 6L6 18M6 6l12 12" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function NotificationsModal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  // Close on escape key
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Sample notifications data - will be replaced with actual data from backend
  const notifications = [
    {
      id: 1,
      title: "Pickup Reminder",
      message: "Tomorrow at 8:00 AM",
      type: "pickup"
    },
    {
      id: 2,
      title: "Report Update",
      message: "Your report about Oak Street was updated.",
      type: "report"
    }
  ];

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2147483647,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 0,
          maxWidth: 500,
          width: '100%',
          maxHeight: '80vh',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '24px 24px 16px 24px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{
              margin: '0 0 4px 0',
              fontSize: 24,
              fontWeight: 700,
              color: '#1F2937'
            }}>
              Notifications
            </h2>
            <p className="muted" style={{
              margin: 0,
              fontSize: 14,
              color: '#6B7280'
            }}>
              All your notifications will appear here.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              transition: 'background 0.2s',
              marginLeft: 16
            }}
            onMouseEnter={(e) => { if (e && e.currentTarget) e.currentTarget.style.background = '#F3F4F6'; }}
            onMouseLeave={(e) => { if (e && e.currentTarget) e.currentTarget.style.background = 'transparent'; }}
            aria-label="Close notifications"
          >
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1
        }}>
          {notifications.length === 0 ? (
            <div style={{
              padding: 48,
              textAlign: 'center',
              borderRadius: 12,
              background: '#F9FAFB',
              border: '1px dashed #E5E7EB'
            }}>
              <p className="muted" style={{ margin: 0, fontSize: 14 }}>
                No notifications yet.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12
            }}>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: 12,
                    background: '#ECFDF5',
                    border: '1px solid #D1FAE5',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (e && e.currentTarget) {
                      e.currentTarget.style.background = '#D1FAE5';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (e && e.currentTarget) {
                      e.currentTarget.style.background = '#ECFDF5';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  <strong style={{
                    display: 'block',
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#1F2937',
                    marginBottom: 6
                  }}>
                    {notification.title}
                  </strong>
                  <div className="muted" style={{
                    fontSize: 14,
                    color: '#6B7280',
                    lineHeight: '1.5'
                  }}>
                    {notification.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

