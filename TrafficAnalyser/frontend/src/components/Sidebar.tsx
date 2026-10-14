import React from 'react';
import {
  LayoutDashboard,
  Radio,
  Scan,
  Search,
  Scissors,
  Route,
  Sparkles,
  ShieldAlert,
  BarChart3,
  FlaskConical,
  Boxes,
  Settings,
  ChevronLeft,
  ChevronRight,
  Eye,
  Activity,
} from 'lucide-react';
import { WorkspaceId } from '../types';

interface SidebarProps {
  currentWorkspace: WorkspaceId;
  onSelectWorkspace: (id: WorkspaceId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  backendOnline: boolean;
}

interface NavItem {
  id: WorkspaceId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string; strokeWidth?: number }>;
  badge?: string;
  badgeType?: 'real' | 'sim' | 'new';
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'live-traffic', label: 'Live Traffic', icon: Radio, badge: 'Real', badgeType: 'real' },
  { id: 'detection', label: 'Object Detection', icon: Scan, badge: 'YOLO', badgeType: 'real' },
  { id: 'visual-search', label: 'Visual Search', icon: Search, badge: 'CLIP', badgeType: 'sim' },
  { id: 'segmentation', label: 'Segmentation Lab', icon: Scissors, badge: 'SAM 2', badgeType: 'sim' },
  { id: 'tracking', label: 'Tracking Studio', icon: Route, badge: 'Tracks', badgeType: 'real' },
  { id: 'restoration', label: 'Image Restoration', icon: Sparkles, badge: 'Diff', badgeType: 'sim' },
  { id: 'robustness', label: 'Robustness Lab', icon: ShieldAlert, badge: 'Stress', badgeType: 'sim' },
  { id: 'evaluation', label: 'Model Evaluation', icon: BarChart3 },
  { id: 'experiments', label: 'Experiments', icon: FlaskConical },
  { id: 'models', label: 'Model Registry', icon: Boxes, badge: '6 Models', badgeType: 'sim' },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentWorkspace,
  onSelectWorkspace,
  collapsed,
  onToggleCollapse,
  backendOnline,
}) => {
  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--surface-border)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '0 12px' : '0 20px',
          borderBottom: '1px solid var(--surface-border)',
        }}
      >
        <div
          onClick={() => onSelectWorkspace('overview')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
        >
          {/* Logo Icon */}
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7C5CFC 0%, #36D6E7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(124, 92, 252, 0.45)',
              flexShrink: 0,
            }}
          >
            <Eye size={22} color="#0B1020" strokeWidth={2.5} />
          </div>

          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: '16px',
                  letterSpacing: '-0.02em',
                  color: '#FFFFFF',
                  lineHeight: 1.1,
                }}
              >
                Aether<span style={{ color: 'var(--accent-cyan)' }}>Vision</span> AI
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginTop: '2px',
                }}
              >
                Visual Intelligence
              </span>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="btn btn-ghost btn-sm"
            style={{ width: '28px', height: '28px', padding: 0 }}
            title="Collapse Sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {!collapsed && (
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-dim)',
              padding: '6px 12px',
              marginBottom: '4px',
            }}
          >
            Workspaces & Labs
          </div>
        )}

        {navItems.map(item => {
          const isActive = currentWorkspace === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectWorkspace(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: collapsed ? '12px 0' : '10px 14px',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isActive ? 'var(--surface-hover)' : 'transparent',
                border: isActive
                  ? '1px solid var(--surface-border-accent)'
                  : '1px solid transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                width: '100%',
                textAlign: 'left',
                position: 'relative',
              }}
              title={collapsed ? item.label : undefined}
            >
              {/* Active Indicator Glow Bar */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    bottom: '20%',
                    width: '3px',
                    borderRadius: '0 4px 4px 0',
                    background: 'var(--accent-violet)',
                    boxShadow: '0 0 10px var(--accent-violet)',
                  }}
                />
              )}

              <Icon
                size={18}
                color={isActive ? 'var(--accent-cyan)' : 'currentColor'}
                strokeWidth={isActive ? 2.2 : 1.8}
              />

              {!collapsed && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.label}
                  </span>

                  {item.badge && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        letterSpacing: '0.04em',
                        backgroundColor:
                          item.badgeType === 'real'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : 'rgba(124, 92, 252, 0.15)',
                        color:
                          item.badgeType === 'real'
                            ? '#34D399'
                            : '#A78BFA',
                        border:
                          item.badgeType === 'real'
                            ? '1px solid rgba(16, 185, 129, 0.3)'
                            : '1px solid rgba(124, 92, 252, 0.3)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Expand Button / Engine Status */}
      <div
        style={{
          padding: collapsed ? '12px 6px' : '14px 16px',
          borderTop: '1px solid var(--surface-border)',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {collapsed ? (
          <button
            onClick={onToggleCollapse}
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
            title="Expand Sidebar"
          >
            <ChevronRight size={18} />
          </button>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              color: 'var(--text-secondary)',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: backendOnline ? 'var(--status-success)' : '#F59E0B',
                boxShadow: backendOnline
                  ? '0 0 8px var(--status-success)'
                  : '0 0 8px #F59E0B',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <span style={{ fontWeight: 600, color: '#FFFFFF' }}>
                {backendOnline ? 'Flask Backend Online' : 'Local Showcase Engine'}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                YOLOv8n · PyTorch 2.0
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
