import React from 'react';
import { X, AlertTriangle, ShieldCheck, Download, Route, MapPin, Video, Gauge, Tag } from 'lucide-react';
import { Incident, WorkspaceId } from '../types';
import { exportToJSON } from '../services/api';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
  onNavigateToWorkspace: (id: WorkspaceId) => void;
  onUpdateStatus: (id: string, status: 'investigating' | 'confirmed' | 'resolved') => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  onNavigateToWorkspace,
  onUpdateStatus,
}) => {
  if (!incident) return null;

  const handleExport = () => {
    exportToJSON(`incident_${incident.id}`, {
      ...incident,
      exportedAt: new Date().toISOString(),
      platform: 'AetherVision AI Enterprise Surveillance',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              className={`badge ${
                incident.severity === 'critical'
                  ? 'badge-danger'
                  : incident.severity === 'high'
                  ? 'badge-simulated'
                  : 'badge-neutral'
              }`}
            >
              {incident.severity.toUpperCase()}
            </span>
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              {incident.id}
            </span>
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ width: '28px', height: '28px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Image Thumbnail */}
          <div
            style={{
              width: '100%',
              height: '240px',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#000',
              border: '1px solid var(--surface-border)',
            }}
          >
            <img
              src={incident.thumbnail}
              alt={incident.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '12px 16px',
                background: 'linear-gradient(to top, rgba(11,16,32,0.95), transparent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#FFF' }}>
                <Video size={13} color="var(--accent-cyan)" />
                <span style={{ fontWeight: 600 }}>{incident.camera}</span>
              </div>
              <span className="badge badge-real">Confidence: {Math.round(incident.confidence * 100)}%</span>
            </div>
          </div>

          {/* Incident Description */}
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{incident.title}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {incident.description}
            </p>
          </div>

          {/* Telemetry Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              backgroundColor: 'var(--surface-elevated)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--surface-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={16} color="var(--accent-cyan)" />
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Location</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFF' }}>{incident.location}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Gauge size={16} color="var(--accent-violet)" />
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Speed Vector</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFF' }}>
                  {incident.speedEstimateKmh !== undefined ? `${incident.speedEstimateKmh} km/h` : 'N/A (Calibrated)'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Video size={16} color="var(--status-info)" />
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Corridor Lane</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFF' }}>{incident.lane || 'Lane 1'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={16} color="var(--status-success)" />
              <div>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Current Status</div>
                <div style={{ fontSize: '12px', fontWeight: 600, textTransform: 'capitalize', color: '#FFF' }}>
                  {incident.status}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Tag size={14} color="var(--text-muted)" />
            {incident.tags.map(tag => (
              <span key={tag} className="badge badge-neutral">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button onClick={handleExport} className="btn btn-secondary btn-sm">
            <Download size={14} />
            Export Dossier
          </button>

          <button
            onClick={() => {
              onNavigateToWorkspace('tracking');
              onClose();
            }}
            className="btn btn-secondary btn-sm"
          >
            <Route size={14} />
            Track Trajectory
          </button>

          {incident.status !== 'resolved' ? (
            <button
              onClick={() => {
                onUpdateStatus(incident.id, 'resolved');
                onClose();
              }}
              className="btn btn-primary btn-sm"
            >
              <ShieldCheck size={14} />
              Mark as Resolved
            </button>
          ) : (
            <button
              onClick={() => {
                onUpdateStatus(incident.id, 'investigating');
                onClose();
              }}
              className="btn btn-secondary btn-sm"
            >
              Reopen Incident
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
