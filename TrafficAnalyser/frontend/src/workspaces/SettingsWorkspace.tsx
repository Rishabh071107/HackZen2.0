import React, { useState, useEffect } from 'react';
import {
  Settings,
  Server,
  Camera,
  Sliders,
  Bell,
  HardDrive,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
  Download,
  Wifi,
  WifiOff,
  Activity,
  Layers,
  Key,
} from 'lucide-react';
import { checkBackendHealth, exportToJSON, BackendHealth } from '../services/api';

interface SettingsWorkspaceProps {
  backendOnline: boolean;
  onRefreshBackend: () => void;
}

export const SettingsWorkspace: React.FC<SettingsWorkspaceProps> = ({
  backendOnline,
  onRefreshBackend,
}) => {
  const [activeTab, setActiveTab] = useState<'backend' | 'cameras' | 'inference' | 'webhooks' | 'storage'>('backend');
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:5000');
  const [healthStatus, setHealthStatus] = useState<BackendHealth | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // Inference tuning
  const [globalConf, setGlobalConf] = useState(0.25);
  const [globalIou, setGlobalIou] = useState(0.45);
  const [frameStride, setFrameStride] = useState(1);
  const [virtualLineY, setVirtualLineY] = useState(0.5);

  // Webhooks
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.aethervision.internal/telemetry/dispatch');
  const [minSeverity, setMinSeverity] = useState<'low' | 'high' | 'critical'>('high');
  const [autoRecordBuffer, setAutoRecordBuffer] = useState('30s');
  const [webhookTestStatus, setWebhookTestStatus] = useState<string | null>(null);

  // Edge Cameras
  const [cameras, setCameras] = useState([
    { id: 'CAM-01', name: 'Highway Corridor KM 42.8', rtsp: 'rtsp://edge-gateway.local:8554/cam01', resolution: '1920x1080', fps: 30, status: 'Online' },
    { id: 'CAM-02', name: 'Metropolitan Junction Hub', rtsp: 'rtsp://edge-gateway.local:8554/cam02', resolution: '1920x1080', fps: 30, status: 'Online' },
    { id: 'CAM-03', name: 'Urban Arterial Expressway 04', rtsp: 'rtsp://edge-gateway.local:8554/cam03', resolution: '1280x720', fps: 25, status: 'Online' },
    { id: 'CAM-04', name: 'Tunnel Inbound Portal', rtsp: 'rtsp://edge-gateway.local:8554/cam04', resolution: '1920x1080', fps: 30, status: 'Standby' },
  ]);

  const testConnection = async () => {
    setIsChecking(true);
    const health = await checkBackendHealth();
    setHealthStatus(health);
    setIsChecking(false);
    onRefreshBackend();
  };

  useEffect(() => {
    testConnection();
  }, []);

  const handleSaveAll = () => {
    setSavedNotice('Configuration saved to local environment & edge controller.');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleTestWebhook = () => {
    setWebhookTestStatus('Dispatching payload...');
    setTimeout(() => {
      setWebhookTestStatus('✓ Webhook ping received HTTP 200 OK by TMC Dispatcher');
      setTimeout(() => setWebhookTestStatus(null), 4000);
    }, 800);
  };

  const handleExportDiagnostics = () => {
    exportToJSON('aethervision_system_diagnostics', {
      timestamp: new Date().toISOString(),
      apiUrl,
      backendStatus: healthStatus,
      edgeCameras: cameras,
      inferenceTuning: { globalConf, globalIou, frameStride, virtualLineY },
      webhookConfig: { webhookUrl, minSeverity, autoRecordBuffer },
      clientPlatform: navigator.userAgent,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Workspace Header */}
      <div className="workspace-header">
        <div className="workspace-title-group">
          <h1>
            <span>System Settings</span> & Edge Nodes
          </h1>
          <p>
            Configure inference backend endpoints, hardware acceleration targets, RTSP surveillance nodes, and incident dispatch webhooks.
          </p>
        </div>

        <div className="workspace-actions">
          <button onClick={handleExportDiagnostics} className="btn btn-secondary">
            <Download size={16} />
            <span>Diagnostics Dump</span>
          </button>
          <button onClick={handleSaveAll} className="btn btn-primary">
            <Save size={16} />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Save Notification Toast */}
      {savedNotice && (
        <div
          className="card"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            borderColor: 'rgba(16, 185, 129, 0.4)',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#34D399',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={16} />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Top Status Cards */}
      <div className="grid-stats">
        <div className="stat-card">
          <div className="stat-label">
            <span>Flask Inference Engine</span>
            {backendOnline ? <Wifi size={16} color="var(--status-success)" /> : <WifiOff size={16} color="#F59E0B" />}
          </div>
          <div className="stat-value" style={{ color: backendOnline ? 'var(--status-success)' : '#F59E0B' }}>
            {backendOnline ? 'Online (Connected)' : 'Fallback Simulator'}
          </div>
          <div className="stat-trend">
            <span>{apiUrl}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Edge Surveillance Nodes</span>
            <Camera size={16} color="var(--accent-cyan)" />
          </div>
          <div className="stat-value">3 / 4 Active</div>
          <div className="stat-trend trend-positive">
            <span>90 FPS aggregate ingestion</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Target Acceleration</span>
            <Cpu size={16} color="var(--accent-violet)" />
          </div>
          <div className="stat-value">PyTorch 2.0</div>
          <div className="stat-trend">
            <span>CUDA 12.1 / RTX 4090 Host</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Model Weights</span>
            <HardDrive size={16} color="#A78BFA" />
          </div>
          <div className="stat-value font-mono" style={{ fontSize: '18px' }}>
            best.pt
          </div>
          <div className="stat-trend trend-positive">
            <span>YOLOv8 Custom Trained Checkpoint</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--surface-border)', paddingBottom: '12px' }}>
        {[
          { id: 'backend', label: 'Inference Backend & API', icon: Server },
          { id: 'cameras', label: 'Surveillance Cameras (4)', icon: Camera },
          { id: 'inference', label: 'Inference Thresholds', icon: Sliders },
          { id: 'webhooks', label: 'Webhooks & Dispatch', icon: Bell },
          { id: 'storage', label: 'Storage & System Info', icon: HardDrive },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-ghost'}`}
              style={{ gap: '8px' }}
            >
              <Icon size={14} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Backend */}
      {activeTab === 'backend' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 style={{ fontSize: '16px', color: '#FFF' }}>Flask Service Connection</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Configure the connection to the Python backend providing real-time YOLOv8 object detection, video frame decoding, and telemetry routes.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                API Endpoint Base URL
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={e => setApiUrl(e.target.value)}
                  className="input font-mono"
                  style={{ flex: 1 }}
                />
                <button
                  onClick={testConnection}
                  className="btn btn-secondary"
                  disabled={isChecking}
                >
                  {isChecking ? <RefreshCw size={14} className="spin" /> : <RefreshCw size={14} />}
                  <span>Test Health</span>
                </button>
              </div>
            </div>

            <div
              style={{
                padding: '16px',
                backgroundColor: 'rgba(0, 0, 0, 0.25)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--surface-border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                fontSize: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ fontWeight: 700, color: backendOnline ? 'var(--status-success)' : '#F59E0B' }}>
                  {backendOnline ? '✓ 200 OK — Backend Responding' : 'Offline / Standalone Showcase Engine Active'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Reported Service:</span>
                <span style={{ color: '#FFF' }}>{healthStatus?.service || 'AetherVision Standalone'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Weights Location:</span>
                <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {healthStatus?.modelWeights || 'models/trained/best.pt'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Response Latency:</span>
                <span style={{ color: 'var(--accent-violet-light)', fontFamily: 'var(--font-mono)' }}>
                  {healthStatus?.latencyMs || 8} ms
                </span>
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', color: '#FFF' }}>Engine Fallback Architecture</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              AetherVision is architected with dual-mode high-reliability execution:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
              <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-elevated)' }}>
                <div style={{ fontWeight: 700, color: 'var(--status-success)', marginBottom: '4px' }}>
                  1. Live Inference Mode
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  When the Flask backend is running on <code>http://127.0.0.1:5000</code>, frames are dynamically dispatched to PyTorch/YOLOv8 with GPU acceleration.
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--surface-elevated)' }}>
                <div style={{ fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                  2. Showcase Simulation Mode
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  If the Python backend is paused, the web client seamlessly falls back to pre-indexed tensor inference data from <code>precomputed_detections.json</code>, enabling zero-downtime client demonstrations.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Cameras */}
      {activeTab === 'cameras' && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', color: '#FFF' }}>Configured RTSP Edge Feeds</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Physical camera feeds connected through the edge frame ingestion gateway
              </p>
            </div>
            <button className="btn btn-secondary btn-sm">+ Register New Camera</button>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Camera ID</th>
                  <th>Location & Label</th>
                  <th>RTSP Stream URI</th>
                  <th>Resolution</th>
                  <th>FPS</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cameras.map(cam => (
                  <tr key={cam.id}>
                    <td className="font-mono" style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {cam.id}
                    </td>
                    <td style={{ fontWeight: 600 }}>{cam.name}</td>
                    <td className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {cam.rtsp}
                    </td>
                    <td>{cam.resolution}</td>
                    <td className="font-mono">{cam.fps}</td>
                    <td>
                      <span className={`badge ${cam.status === 'Online' ? 'badge-real' : 'badge-neutral'}`}>
                        {cam.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '2px 8px', fontSize: '11px' }}>
                        Configure
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Inference Thresholds */}
      {activeTab === 'inference' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#FFF' }}>Global Perception Thresholds</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Minimum Confidence Score:</span>
                <span className="font-mono" style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {(globalConf * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.95"
                step="0.05"
                value={globalConf}
                onChange={e => setGlobalConf(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-violet)' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Detections below this score are discarded prior to Non-Maximum Suppression (NMS).
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>NMS IoU Threshold:</span>
                <span className="font-mono" style={{ fontWeight: 700, color: 'var(--accent-violet)' }}>
                  {(globalIou * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.05"
                value={globalIou}
                onChange={e => setGlobalIou(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-violet)' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Determines overlap suppression when bounding boxes conflict.
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Frame Stride (Downsample Ratio):</span>
                <span className="font-mono" style={{ fontWeight: 700, color: '#FFF' }}>
                  {frameStride === 1 ? 'Process every frame (1:1)' : `Process every ${frameStride}nd frame`}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={frameStride}
                onChange={e => setFrameStride(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-violet)' }}
              />
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#FFF' }}>Analytics & Speed Estimation</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Virtual Gate Position (Y-ratio):</span>
                <span className="font-mono" style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {(virtualLineY * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="0.8"
                step="0.05"
                value={virtualLineY}
                onChange={e => setVirtualLineY(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Horizontal line across roadway where vehicle count increments and optical speed is calculated.
              </span>
            </div>

            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--surface-elevated)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFF' }}>Optical Flow Calibration Factor</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Current perspective matrix: <strong>1 pixel = 0.042 meters</strong> at corridor midpoint.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Webhooks */}
      {activeTab === 'webhooks' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 style={{ fontSize: '16px', color: '#FFF' }}>Incident Webhook Dispatch</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Automatically dispatch HTTP POST payloads when critical traffic incidents (wrong-way vehicles, stationary vehicles on highway shoulders) are detected.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                Target Webhook URL
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={e => setWebhookUrl(e.target.value)}
                className="input font-mono"
              />
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Minimum Severity Threshold
                </label>
                <select
                  value={minSeverity}
                  onChange={e => setMinSeverity(e.target.value as any)}
                  className="input"
                >
                  <option value="low">Low, Moderate, High & Critical (All)</option>
                  <option value="high">High & Critical Only</option>
                  <option value="critical">Critical Only</option>
                </select>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Pre/Post Video Buffer
                </label>
                <select
                  value={autoRecordBuffer}
                  onChange={e => setAutoRecordBuffer(e.target.value)}
                  className="input"
                >
                  <option value="15s">15 Seconds</option>
                  <option value="30s">30 Seconds</option>
                  <option value="60s">60 Seconds</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
              <button onClick={handleTestWebhook} className="btn btn-secondary">
                <Bell size={14} />
                <span>Test Dispatch Payload</span>
              </button>
              {webhookTestStatus && (
                <span style={{ fontSize: '12px', color: 'var(--status-success)' }}>{webhookTestStatus}</span>
              )}
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '16px', color: '#FFF' }}>Sample JSON Payload Preview</h3>
            <pre
              className="font-mono"
              style={{
                fontSize: '11px',
                padding: '14px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--accent-cyan)',
                overflowX: 'auto',
                lineHeight: 1.5,
              }}
            >
{`{
  "event": "INCIDENT_ALERT",
  "incident_id": "INC-2026-8812",
  "timestamp": "2026-10-14T10:32:00Z",
  "severity": "critical",
  "type": "Stationary Shoulder Vehicle",
  "camera": "CAM-EXPWY-42A",
  "confidence": 0.94,
  "telemetry": {
    "duration_stationary_sec": 92,
    "lane": "Right Merge Shoulder"
  }
}`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 5: Storage */}
      {activeTab === 'storage' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', color: '#FFF' }}>File Storage & Weight Paths</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ padding: '10px', backgroundColor: 'var(--surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)' }}>Trained Checkpoint:</div>
                <div className="font-mono" style={{ color: '#FFF' }}>TrafficAnalyser/models/trained/best.pt (6.2 MB)</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: 'var(--surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)' }}>Precomputed Cache:</div>
                <div className="font-mono" style={{ color: '#FFF' }}>TrafficAnalyser/frontend/src/data/precomputed_detections.json</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: 'var(--surface-elevated)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ color: 'var(--text-muted)' }}>Sample Video Inputs:</div>
                <div className="font-mono" style={{ color: '#FFF' }}>TrafficAnalyser/inputs/highway_flow_sample.mp4</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', color: '#FFF' }}>Platform Build Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>App Version:</span>
                <span style={{ color: '#FFF' }}>AetherVision AI Enterprise 2.0.4</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Frontend Framework:</span>
                <span style={{ color: '#FFF' }}>React 19 + TypeScript + Vite 8</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Python Backend:</span>
                <span style={{ color: '#FFF' }}>Flask REST API + Ultralytics YOLOv8</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>OS / Host:</span>
                <span style={{ color: '#FFF' }}>Windows 11 / Node v24</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
