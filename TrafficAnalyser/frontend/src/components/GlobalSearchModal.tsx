import React, { useState, useEffect } from 'react';
import { Search, X, Scan, Route, Sparkles, Scissors, Boxes, ShieldAlert, AlertTriangle } from 'lucide-react';
import { WorkspaceId, Incident } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWorkspace: (id: WorkspaceId) => void;
  onSelectIncident: (inc: Incident) => void;
  incidents: Incident[];
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectWorkspace,
  onSelectIncident,
  incidents,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tools: { id: WorkspaceId; title: string; category: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: 'live-traffic', title: 'Live Traffic Telemetry', category: 'Perception', icon: Scan },
    { id: 'detection', title: 'YOLOv8 Object Detection Studio', category: 'Inference', icon: Scan },
    { id: 'visual-search', title: 'Semantic CLIP & DINOv2 Search', category: 'Vector Search', icon: Search },
    { id: 'segmentation', title: 'SAM 2 Promptable Segmentation', category: 'Foundation Vision', icon: Scissors },
    { id: 'tracking', title: 'Multi-Object Tracking & Trajectories', category: 'Tracking', icon: Route },
    { id: 'restoration', title: 'Adverse Weather Restoration', category: 'Diffusion Models', icon: Sparkles },
    { id: 'robustness', title: 'Robustness & Perturbation Stress Testing', category: 'Reliability', icon: ShieldAlert },
    { id: 'evaluation', title: 'Model Evaluation Benchmarks', category: 'Metrics', icon: Boxes },
    { id: 'models', title: 'Model Registry & Deployment', category: 'Deployment', icon: Boxes },
  ];

  const filteredTools = tools.filter(
    t => t.title.toLowerCase().includes(query.toLowerCase()) || t.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredIncidents = incidents.filter(
    i =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.location.toLowerCase().includes(query.toLowerCase()) ||
      i.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '600px' }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--surface-border)',
          }}
        >
          <Search size={18} color="var(--accent-violet)" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Jump to workspace, model, or traffic incident..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FFF',
              fontSize: '15px',
              width: '100%',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ width: '28px', height: '28px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '12px' }}>
          {/* Workspaces Section */}
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                padding: '4px 8px 8px',
                letterSpacing: '0.06em',
              }}
            >
              Workspaces & Labs
            </div>
            {filteredTools.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '6px 8px' }}>
                No matching workspaces
              </div>
            ) : (
              filteredTools.map(tool => {
                const Icon = tool.icon;
                return (
                  <div
                    key={tool.id}
                    onClick={() => {
                      onSelectWorkspace(tool.id);
                      onClose();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--surface-elevated)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-cyan)',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>{tool.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{tool.category}</div>
                    </div>
                    <span className="badge badge-neutral">Workspace</span>
                  </div>
                );
              })
            )}
          </div>

          {/* Incidents Section */}
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                padding: '4px 8px 8px',
                letterSpacing: '0.06em',
              }}
            >
              Recent Detected Incidents
            </div>
            {filteredIncidents.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '6px 8px' }}>
                No matching incidents
              </div>
            ) : (
              filteredIncidents.map(inc => (
                <div
                  key={inc.id}
                  onClick={() => {
                    onSelectIncident(inc);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <AlertTriangle
                    size={16}
                    color={inc.severity === 'critical' ? 'var(--status-danger)' : '#F59E0B'}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#FFF',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {inc.title}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {inc.location} · {inc.timestamp}
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      inc.severity === 'critical' ? 'badge-danger' : 'badge-simulated'
                    }`}
                  >
                    {inc.severity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
