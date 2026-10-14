import React, { useState } from 'react';
import {
  Search,
  Bell,
  Cpu,
  Layers,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  ShieldCheck,
  User,
} from 'lucide-react';
import { DatasetVideo, NotificationItem, WorkspaceId } from '../types';

interface TopNavProps {
  onOpenSearch: () => void;
  datasets: DatasetVideo[];
  selectedDataset: DatasetVideo;
  onSelectDataset: (d: DatasetVideo) => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onSelectWorkspace: (id: WorkspaceId) => void;
  backendOnline: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenSearch,
  datasets,
  selectedDataset,
  onSelectDataset,
  isDemoMode,
  onToggleDemoMode,
  notifications,
  onMarkNotificationRead,
  onSelectWorkspace,
  backendOnline,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDatasetMenu, setShowDatasetMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header
      style={{
        height: 'var(--header-height)',
        backgroundColor: 'rgba(11, 16, 32, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--surface-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      {/* Left: Global Search Trigger & Tagline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button
          onClick={onOpenSearch}
          className="search-box"
          style={{
            cursor: 'pointer',
            minWidth: '280px',
            padding: '7px 12px',
          }}
        >
          <Search size={15} color="var(--text-muted)" />
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', flex: 1, textAlign: 'left' }}>
            Search incidents, models, tools...
          </span>
          <kbd
            style={{
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              padding: '2px 6px',
              backgroundColor: 'var(--surface-elevated)',
              color: 'var(--text-secondary)',
              borderRadius: '4px',
              border: '1px solid var(--surface-border)',
            }}
          >
            Ctrl K
          </kbd>
        </button>

        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}
          className="nav-tagline"
        >
          <span style={{ color: 'var(--accent-violet)', fontWeight: 700 }}>✦</span>
          <span style={{ fontStyle: 'italic' }}>"See Beyond Detection"</span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Dataset Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDatasetMenu(!showDatasetMenu)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '8px' }}
          >
            <Layers size={14} color="var(--accent-cyan)" />
            <span style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {selectedDataset.title}
            </span>
            <ChevronDown size={14} />
          </button>

          {showDatasetMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                width: '240px',
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--surface-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                padding: '6px',
                zIndex: 100,
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  padding: '6px 10px',
                }}
              >
                Select Video Feed
              </div>
              {datasets.map(ds => (
                <div
                  key={ds.id}
                  onClick={() => {
                    onSelectDataset(ds);
                    setShowDatasetMenu(false);
                  }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    cursor: 'pointer',
                    backgroundColor: ds.id === selectedDataset.id ? 'var(--surface-hover)' : 'transparent',
                    color: ds.id === selectedDataset.id ? '#FFFFFF' : 'var(--text-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{ds.title}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {ds.resolution} · {ds.formatted_duration} · {ds.filename}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Demo Mode Toggle Badge */}
        <button
          onClick={onToggleDemoMode}
          className={`badge ${isDemoMode ? 'badge-simulated' : 'badge-real'}`}
          style={{
            cursor: 'pointer',
            padding: '5px 12px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
          }}
          title="Click to toggle between Showcase Demonstration Mode and Live Stream Mode"
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: isDemoMode ? '#FBBF24' : '#34D399',
            }}
          />
          {isDemoMode ? 'Demo Showcase Mode' : 'Live Inference Mode'}
        </button>

        {/* Model Runtime Pill */}
        <div
          onClick={() => onSelectWorkspace('models')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px',
            borderRadius: '9999px',
            backgroundColor: 'var(--surface-elevated)',
            border: '1px solid var(--surface-border)',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
          }}
          title="Inspect Model Registry & Hardware"
        >
          <Cpu size={14} color="var(--accent-violet)" />
          <span style={{ fontWeight: 600, color: '#FFF' }}>
            {backendOnline ? 'PyTorch CUDA' : 'TorchScript Edge'}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span>8.4ms</span>
        </div>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn btn-secondary btn-icon"
            style={{ position: 'relative' }}
            title="System & Incident Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-danger)',
                  boxShadow: '0 0 6px var(--status-danger)',
                }}
              />
            )}
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                width: '320px',
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--surface-border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-md)',
                overflow: 'hidden',
                zIndex: 100,
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--surface-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 700 }}>Telemetry Alerts</span>
                <span className="badge badge-neutral">{unreadCount} unread</span>
              </div>
              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => onMarkNotificationRead(n.id)}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid var(--surface-border-subtle)',
                      backgroundColor: n.read ? 'transparent' : 'rgba(124, 92, 252, 0.06)',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '10px',
                    }}
                  >
                    {n.type === 'alert' && <AlertTriangle size={16} color="var(--status-danger)" />}
                    {n.type === 'success' && <CheckCircle2 size={16} color="var(--status-success)" />}
                    {n.type === 'info' && <Info size={16} color="var(--accent-cyan)" />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFF' }}>{n.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {n.message}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {n.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="btn btn-ghost"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px',
              borderRadius: '9999px',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7C5CFC, #36D6E7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0B1020',
                fontWeight: 700,
                fontSize: '12px',
              }}
            >
              AV
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFF' }}>Lead Vision Ops</div>
              <div style={{ fontSize: '10px', color: 'var(--accent-cyan)' }}>Enterprise Admin</div>
            </div>
          </button>

          {showUserMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                width: '210px',
                backgroundColor: 'var(--surface-card)',
                border: '1px solid var(--surface-border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                padding: '6px',
                zIndex: 100,
              }}
            >
              <div
                onClick={() => {
                  onSelectWorkspace('settings');
                  setShowUserMenu(false);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <ShieldCheck size={14} color="var(--accent-cyan)" />
                <span>Security & API Keys</span>
              </div>
              <div
                onClick={() => {
                  onSelectWorkspace('evaluation');
                  setShowUserMenu(false);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Cpu size={14} color="var(--accent-violet)" />
                <span>Runtime Telemetry</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
