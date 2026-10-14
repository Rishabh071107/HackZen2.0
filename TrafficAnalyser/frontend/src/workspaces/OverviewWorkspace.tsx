import React, { useState } from 'react';
import {
  Car,
  Activity,
  AlertTriangle,
  Search,
  Zap,
  Gauge,
  Play,
  Pause,
  SkipForward,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react';
import { Incident, WorkspaceId, DatasetVideo } from '../types';

interface OverviewWorkspaceProps {
  onSelectWorkspace: (id: WorkspaceId) => void;
  onSelectIncident: (inc: Incident) => void;
  incidents: Incident[];
  selectedDataset: DatasetVideo;
}

export const OverviewWorkspace: React.FC<OverviewWorkspaceProps> = ({
  onSelectWorkspace,
  onSelectIncident,
  incidents,
  selectedDataset,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [incidentFilter, setIncidentFilter] = useState<'all' | 'critical' | 'high' | 'investigating'>('all');
  const [showOverlays, setShowOverlays] = useState(true);

  const filteredIncidents = incidents.filter(inc => {
    if (incidentFilter === 'critical') return inc.severity === 'critical';
    if (incidentFilter === 'high') return inc.severity === 'high' || inc.severity === 'critical';
    if (incidentFilter === 'investigating') return inc.status === 'investigating';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Workspace Header */}
      <div className="workspace-header">
        <div className="workspace-title-group">
          <h1>
            <span>Executive Traffic Intelligence Dashboard</span>
            <span className="badge badge-real">Live Stream Active</span>
          </h1>
          <p className="workspace-description">
            Holistic situational awareness across active highway corridors, urban junctions, and multi-class vision sensors.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => onSelectWorkspace('live-traffic')}
            className="btn btn-primary btn-sm"
          >
            <Activity size={14} />
            Live Observability
          </button>
          <button
            onClick={() => onSelectWorkspace('visual-search')}
            className="btn btn-secondary btn-sm"
          >
            <Search size={14} />
            DINOv2 / CLIP Search
          </button>
        </div>
      </div>

      {/* 6 Core KPI Cards */}
      <div className="grid-kpi">
        {/* Vehicles Detected */}
        <div className="kpi-card card-glow">
          <div className="kpi-header">
            <span className="kpi-title">Vehicles Counted</span>
            <div className="kpi-icon-wrapper" style={{ color: 'var(--accent-cyan)', background: 'rgba(54, 214, 231, 0.1)' }}>
              <Car size={16} />
            </div>
          </div>
          <div className="kpi-value">14,892</div>
          <div className="kpi-subtext" style={{ color: 'var(--status-success)' }}>
            <TrendingUp size={12} />
            <span>+12.4% vs corridor baseline</span>
          </div>
        </div>

        {/* Active Tracks */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active ByteTracks</span>
            <div className="kpi-icon-wrapper">
              <Activity size={16} />
            </div>
          </div>
          <div className="kpi-value">48</div>
          <div className="kpi-subtext">
            <span>Kalman filter Re-ID continuous</span>
          </div>
        </div>

        {/* Incidents Detected */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Active Incidents</span>
            <div className="kpi-icon-wrapper" style={{ color: 'var(--status-danger)', background: 'rgba(239, 68, 68, 0.1)' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#F87171' }}>
            {incidents.filter(i => i.status !== 'resolved').length}
          </div>
          <div className="kpi-subtext" style={{ color: '#FCA5A5' }}>
            <span>2 critical safety hazards</span>
          </div>
        </div>

        {/* Visual Search Matches */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">CLIP Embeddings</span>
            <div className="kpi-icon-wrapper" style={{ color: 'var(--accent-violet)', background: 'rgba(124, 92, 252, 0.1)' }}>
              <Search size={16} />
            </div>
          </div>
          <div className="kpi-value">1,420</div>
          <div className="kpi-subtext">
            <span>Indexed across 8 camera feeds</span>
          </div>
        </div>

        {/* Average Latency */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Inference Latency</span>
            <div className="kpi-icon-wrapper">
              <Zap size={16} />
            </div>
          </div>
          <div className="kpi-value">8.4 <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>ms</span></div>
          <div className="kpi-subtext" style={{ color: 'var(--status-success)' }}>
            <span>YOLOv8n TensorRT FP16</span>
          </div>
        </div>

        {/* Processing FPS */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Processing Speed</span>
            <div className="kpi-icon-wrapper" style={{ color: 'var(--accent-cyan)', background: 'rgba(54, 214, 231, 0.1)' }}>
              <Gauge size={16} />
            </div>
          </div>
          <div className="kpi-value">119 <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>FPS</span></div>
          <div className="kpi-subtext">
            <span>Sub-sampling stride: 1x</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Live Stream Visual Preview & Traffic Flow Telemetry */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        {/* Live Traffic Preview Panel */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-success)',
                  boxShadow: '0 0 8px var(--status-success)',
                }}
              />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFF' }}>
                {selectedDataset.title}
              </span>
              <span className="badge badge-neutral font-mono">{selectedDataset.resolution}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setShowOverlays(!showOverlays)}
                className={`btn btn-sm ${showOverlays ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Layers size={13} />
                {showOverlays ? 'Overlays On' : 'Overlays Off'}
              </button>
            </div>
          </div>

          {/* Video Preview Canvas with Deterministic Overlays */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              backgroundColor: '#000',
              border: '1px solid var(--surface-border)',
            }}
          >
            <img
              src="/samples/highway_frame.jpg"
              alt="Live Traffic Stream"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: isPlaying ? 1 : 0.85,
                filter: isPlaying ? 'none' : 'grayscale(30%)',
              }}
            />

            {/* Overlaid Detections and Tracks */}
            {showOverlays && (
              <svg
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
                viewBox="0 0 1920 1080"
              >
                {/* Virtual Counting Gate Line */}
                <line
                  x1="0"
                  y1="540"
                  x2="1920"
                  y2="540"
                  stroke="#36D6E7"
                  strokeWidth="3"
                  strokeDasharray="8 6"
                  opacity="0.8"
                />
                <text x="40" y="525" fill="#36D6E7" fontSize="24" fontFamily="JetBrains Mono" fontWeight="700">
                  VIRTUAL CALIBRATED GATE [LINE Y = 0.50]
                </text>

                {/* Real Car 1 */}
                <rect x="674" y="813" width="396" height="265" fill="rgba(124, 92, 252, 0.15)" stroke="#7C5CFC" strokeWidth="3" rx="6" />
                <rect x="674" y="775" width="220" height="38" fill="#7C5CFC" rx="4" />
                <text x="684" y="801" fill="#FFF" fontSize="20" fontFamily="JetBrains Mono" fontWeight="700">
                  CAR #108 [0.93] 75 km/h
                </text>
                {/* Trajectory trail */}
                <path d="M 670 810 L 740 850 L 820 890 L 910 940" fill="none" stroke="#7C5CFC" strokeWidth="4" strokeLinecap="round" />

                {/* Real Car 2 */}
                <rect x="1270" y="656" width="304" height="266" fill="rgba(54, 214, 231, 0.15)" stroke="#36D6E7" strokeWidth="3" rx="6" />
                <rect x="1270" y="618" width="230" height="38" fill="#36D6E7" rx="4" />
                <text x="1280" y="644" fill="#0B1020" fontSize="20" fontFamily="JetBrains Mono" fontWeight="800">
                  CAR #104 [0.92] 68 km/h
                </text>

                {/* Real Car 3 */}
                <rect x="579" y="380" width="199" height="208" fill="rgba(16, 185, 129, 0.15)" stroke="#10B981" strokeWidth="3" rx="6" />
                <rect x="579" y="342" width="200" height="38" fill="#10B981" rx="4" />
                <text x="589" y="368" fill="#FFF" fontSize="20" fontFamily="JetBrains Mono" fontWeight="700">
                  CAR #101 [0.86] 70 km/h
                </text>

                {/* Incident Warning Box on Shoulder */}
                <rect x="1717" y="597" width="203" height="260" fill="rgba(239, 68, 68, 0.2)" stroke="#EF4444" strokeWidth="4" strokeDasharray="6 4" rx="6" />
                <rect x="1680" y="555" width="240" height="42" fill="#EF4444" rx="4" />
                <text x="1690" y="583" fill="#FFF" fontSize="18" fontFamily="JetBrains Mono" fontWeight="800">
                  ⚠️ STATIONARY SHOULDER
                </text>
              </svg>
            )}

            {/* Bottom Stream Status Strip */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                padding: '8px 14px',
                background: 'rgba(11, 16, 32, 0.85)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--surface-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="btn btn-ghost btn-sm"
                  style={{ width: '24px', height: '24px', padding: 0 }}
                >
                  {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                </button>
                <button
                  onClick={() => alert('Stepping frame (+1 frame: 33ms)')}
                  className="btn btn-ghost btn-sm"
                  style={{ width: '24px', height: '24px', padding: 0 }}
                  title="Step forward 1 frame"
                >
                  <SkipForward size={13} />
                </button>
                <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>
                  STREAM #01 · FRAME 342 / 900
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: 'var(--text-secondary)' }}>
                <span>Avg Speed: <strong style={{ color: '#FFF' }}>68.4 km/h</strong></span>
                <span>Density: <strong style={{ color: 'var(--status-success)' }}>Free Flow</strong></span>
                <span className="badge badge-real">YOLOv8n Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Traffic Telemetry & Breakdown Charts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Class Distribution Chart */}
          <div className="card" style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '14px', color: '#FFF' }}>
              Detected Vehicle Class Distribution
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'Passenger Cars (Sedan/SUV)', count: 9840, pct: 66, color: '#7C5CFC' },
                { name: 'Commercial Freight Trucks', count: 2380, pct: 16, color: '#36D6E7' },
                { name: 'Transit & Charter Buses', count: 1190, pct: 8, color: '#10B981' },
                { name: 'Motorcycles & Scooters', count: 1042, pct: 7, color: '#F59E0B' },
                { name: 'Bicycles & Pedestrians', count: 440, pct: 3, color: '#EC4899' },
              ].map(cls => (
                <div key={cls.name} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{cls.name}</span>
                    <span className="font-mono" style={{ fontWeight: 600, color: '#FFF' }}>
                      {cls.count.toLocaleString()} ({cls.pct}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor: 'rgba(255, 255, 255, 0.06)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${cls.pct}%`,
                        height: '100%',
                        backgroundColor: cls.color,
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly Congestion Trend */}
          <div className="card" style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px', color: '#FFF' }}>
              Corridor Density (Level of Service Index)
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '80px', gap: '8px', padding: '10px 0' }}>
              {[
                { time: '08:00', val: 78, status: 'heavy' },
                { time: '10:00', val: 45, status: 'free' },
                { time: '12:00', val: 62, status: 'mod' },
                { time: '14:00', val: 50, status: 'free' },
                { time: '16:00', val: 88, status: 'heavy' },
                { time: '18:00', val: 92, status: 'heavy' },
                { time: '20:00', val: 38, status: 'free' },
              ].map(bar => (
                <div key={bar.time} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '100%',
                      height: `${bar.val}%`,
                      backgroundColor:
                        bar.status === 'heavy'
                          ? '#EF4444'
                          : bar.status === 'mod'
                          ? '#F59E0B'
                          : '#10B981',
                      borderRadius: '4px',
                      opacity: 0.85,
                    }}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{bar.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Incidents Section with Filters and Modals */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFF' }}>
              Discovered Safety & Flow Incidents
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Real-time perception triggers based on stopping time, TTC near-miss vectors, and wrong-way trajectories.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Filter:</span>
            {(['all', 'critical', 'high', 'investigating'] as const).map(f => (
              <button
                key={f}
                onClick={() => setIncidentFilter(f)}
                className={`btn btn-sm ${incidentFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Incident Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredIncidents.map(inc => (
            <div
              key={inc.id}
              onClick={() => onSelectIncident(inc)}
              style={{
                backgroundColor: 'var(--surface-elevated)',
                border: '1px solid var(--surface-border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent-violet)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--surface-border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ height: '140px', position: 'relative', backgroundColor: '#000' }}>
                <img
                  src={inc.thumbnail}
                  alt={inc.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  className={`badge ${
                    inc.severity === 'critical'
                      ? 'badge-danger'
                      : inc.severity === 'high'
                      ? 'badge-simulated'
                      : 'badge-neutral'
                  }`}
                  style={{ position: 'absolute', top: '10px', right: '10px' }}
                >
                  {inc.severity.toUpperCase()}
                </span>
                <span
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '10px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    color: '#FFF',
                  }}
                >
                  {inc.camera}
                </span>
              </div>

              <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                    {inc.id} · {inc.timestamp}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFF', marginBottom: '6px', lineHeight: 1.3 }}>
                    {inc.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                    {inc.location}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--surface-border-subtle)', paddingTop: '10px' }}>
                  <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                    {inc.status}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--accent-violet)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    Inspect Dossier <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
