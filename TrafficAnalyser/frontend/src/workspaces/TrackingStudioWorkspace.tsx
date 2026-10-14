import React, { useState } from 'react';
import {
  Route,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { initialTracks } from '../data/mockData';
import { TrackItem } from '../types';

export const TrackingStudioWorkspace: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentFrame, setCurrentFrame] = useState<number>(45);
  const [selectedScenario, setSelectedScenario] = useState<string>('normal');
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(101);

  const scenarios = [
    { id: 'normal', name: 'Scenario A: Multi-Lane Free Flow', desc: 'Standard corridor velocities with distinct lane assignments.' },
    { id: 'congestion', name: 'Scenario B: Severe Bottleneck Incursion', desc: 'Stop-and-go propagation with tight headways.' },
    { id: 'pedestrian', name: 'Scenario C: Pedestrian Roadway Crossing', desc: 'Vulnerable road user trajectory crossing fast freight lane.' },
    { id: 'motorcycle', name: 'Scenario D: Two-Wheeler Lane Splitting', desc: 'Rapid weaving between passenger vehicles.' },
    { id: 'occlusion', name: 'Scenario E: Heavy Barrier Occlusion & Re-ID', desc: 'Preserves track ID when vehicle emerges behind highway sign gantry.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="workspace-header">
        <div className="workspace-title-group">
          <h1>
            <span>Multi-Object Tracking Studio (ByteTrack)</span>
            <span className="badge badge-real">Kalman Filter + Low-Conf Association</span>
          </h1>
          <p className="workspace-description">
            Trajectory persistence, identity-switch mitigation, temporal speed vectors, and occlusion recovery analytics.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="badge badge-neutral font-mono">
            ID Switch Metric: 0.04% (Robust Re-ID)
          </span>
        </div>
      </div>

      {/* Scenario Selector Chips */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {scenarios.map(s => {
          const isSelected = selectedScenario === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedScenario(s.id)}
              className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textAlign: 'left' }}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Player Canvas on Left, Trajectory Telemetry & Track List on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' }}>
        {/* Canvas Player */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
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
              alt="Tracking Scene"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Overlaid Trajectory Vectors */}
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
              {initialTracks.map(track => {
                const isFocused = selectedTrackId === track.id;
                const strokeColor = track.color;
                const pathData = track.trajectory
                  .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                  .join(' ');

                const lastPoint = track.trajectory[track.trajectory.length - 1];

                return (
                  <g key={track.id} opacity={isFocused || selectedTrackId === null ? 1 : 0.35}>
                    {/* Path Trail */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isFocused ? 6 : 3.5}
                      strokeLinecap="round"
                      strokeDasharray={track.status === 'exited' ? '8 6' : undefined}
                    />

                    {/* Historical dots */}
                    {track.trajectory.map((p, idx) => (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={p.y}
                        r={isFocused ? 5 : 3.5}
                        fill={strokeColor}
                        stroke="#FFF"
                        strokeWidth="1.5"
                      />
                    ))}

                    {/* Leading Box & Tag */}
                    <rect
                      x={lastPoint.x - 45}
                      y={lastPoint.y - 45}
                      width="90"
                      height="90"
                      fill={`${strokeColor}22`}
                      stroke={strokeColor}
                      strokeWidth={isFocused ? 3 : 2}
                      rx="6"
                    />
                    <rect
                      x={lastPoint.x - 45}
                      y={lastPoint.y - 78}
                      width="160"
                      height="30"
                      fill={strokeColor}
                      rx="4"
                    />
                    <text
                      x={lastPoint.x - 38}
                      y={lastPoint.y - 58}
                      fill="#FFFFFF"
                      fontSize="16"
                      fontFamily="JetBrains Mono"
                      fontWeight="700"
                    >
                      ID #{track.id} · {track.avgSpeed}k
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Bottom Scrubber Bar */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                padding: '8px 14px',
                backgroundColor: 'rgba(11, 16, 32, 0.9)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--surface-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="btn btn-ghost btn-sm"
                style={{ width: '28px', height: '28px', padding: 0 }}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>

              <button
                onClick={() => setCurrentFrame(1)}
                className="btn btn-ghost btn-sm"
                style={{ width: '28px', height: '28px', padding: 0 }}
                title="Restart Timeline"
              >
                <RotateCcw size={14} />
              </button>

              {/* Slider for frame scrub */}
              <input
                type="range"
                className="form-range"
                min="1"
                max="90"
                value={currentFrame}
                onChange={e => setCurrentFrame(parseInt(e.target.value))}
                style={{ flex: 1 }}
              />

              <span className="font-mono" style={{ fontSize: '11px', color: 'var(--accent-cyan)' }}>
                Frame {currentFrame} / 90
              </span>
            </div>
          </div>
        </div>

        {/* Right: Active Tracks Dossier */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#FFF' }}>
              Track Identity Roster ({initialTracks.length} Active Tracks)
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Click any tracked vehicle to highlight its spatial trajectory vector. Speed estimates are pixel-calibrated demo estimates.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {initialTracks.map(track => {
                const isSelected = selectedTrackId === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => setSelectedTrackId(isSelected ? null : track.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--surface-hover)' : 'var(--surface-elevated)',
                      border: isSelected ? `1px solid ${track.color}` : '1px solid var(--surface-border)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: track.color,
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>
                          Track #{track.id} ({track.className})
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                          Entry: {track.entryTime} · Duration: {track.durationSeconds}s
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div className="font-mono" style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>
                        {track.avgSpeed} km/h
                      </div>
                      <div style={{ fontSize: '10px', color: track.idSwitches === 0 ? 'var(--status-success)' : '#F59E0B' }}>
                        ID Switches: {track.idSwitches}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trajectory Quality Card */}
          <div className="card">
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px', color: '#FFF' }}>
              Data Association Telemetry
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Kalman Filter Covariance:</span>
                <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>0.014</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>ByteTrack Low-Conf Matching:</span>
                <span className="font-mono" style={{ color: 'var(--status-success)' }}>Active (0.10 - 0.25)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Camera Calibration Matrix:</span>
                <span className="font-mono" style={{ color: '#FFF' }}>Homography Calibrated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
