import React, { useState } from 'react';
import {
  ShieldAlert,
  Sliders,
  Eye,
  Layers,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Info,
  Flame,
} from 'lucide-react';

export const RobustnessLabWorkspace: React.FC = () => {
  const [selectedPerturbation, setSelectedPerturbation] = useState<string>('rain');
  const [showGradCam, setShowGradCam] = useState<boolean>(false);
  const [showSaliency, setShowSaliency] = useState<boolean>(false);

  const perturbations = [
    {
      id: 'rain',
      name: 'Adverse Heavy Rain & Streak Noise',
      img: '/samples/highway_rain.jpg',
      baselineDets: 10,
      perturbedDets: 7,
      falsePositives: 1,
      falseNegatives: 3,
      robustnessScore: '74.2%',
      confidenceDrop: '-14.8%',
      riskLevel: 'Moderate Hazard',
    },
    {
      id: 'lowlight',
      name: 'Low Lighting & Night Darkness',
      img: '/samples/highway_lowlight.jpg',
      baselineDets: 10,
      perturbedDets: 6,
      falsePositives: 0,
      falseNegatives: 4,
      robustnessScore: '68.5%',
      confidenceDrop: '-22.4%',
      riskLevel: 'High Vulnerability',
    },
    {
      id: 'blur',
      name: 'High-Speed Motion Blur',
      img: '/samples/highway_blurred.jpg',
      baselineDets: 10,
      perturbedDets: 8,
      falsePositives: 1,
      falseNegatives: 2,
      robustnessScore: '81.0%',
      confidenceDrop: '-8.2%',
      riskLevel: 'Acceptable',
    },
    {
      id: 'occlusion',
      name: 'Infrastructure Barrier Occlusion',
      img: '/samples/highway_occluded.jpg',
      baselineDets: 10,
      perturbedDets: 7,
      falsePositives: 0,
      falseNegatives: 3,
      robustnessScore: '70.0%',
      confidenceDrop: '-16.1%',
      riskLevel: 'Moderate Hazard',
    },
  ];

  const currentPerturbation = perturbations.find(p => p.id === selectedPerturbation) || perturbations[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="workspace-header">
        <div className="workspace-title-group">
          <h1>
            <span>Robustness & Explainability Lab</span>
            <span className="badge badge-simulated">Stress Testing & Grad-CAM (Simulated)</span>
          </h1>
          <p className="workspace-description">
            Evaluate object detector resilience against environmental perturbations and inspect neural attention with Grad-CAM and saliency maps.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              setShowGradCam(!showGradCam);
              setShowSaliency(false);
            }}
            className={`btn btn-sm ${showGradCam ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Flame size={14} />
            {showGradCam ? 'Hide Grad-CAM' : 'Show Grad-CAM Heatmap'}
          </button>
          <button
            onClick={() => {
              setShowSaliency(!showSaliency);
              setShowGradCam(false);
            }}
            className={`btn btn-sm ${showSaliency ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Eye size={14} />
            {showSaliency ? 'Hide Saliency' : 'Show Saliency Map'}
          </button>
        </div>
      </div>

      {/* Perturbation Conditions Chips */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {perturbations.map(p => {
          const isSelected = selectedPerturbation === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPerturbation(p.id)}
              className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
            >
              {p.name}
            </button>
          );
        })}
      </div>

      {/* Side-by-Side Comparison: Baseline Clean vs Perturbed Input */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Baseline Clean */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>Baseline Input (Optimal Conditions)</span>
            <span className="badge badge-real font-mono">10 / 10 Detections (100%)</span>
          </div>

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
            <img src="/samples/highway_frame.jpg" alt="Baseline" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1920 1080">
              <rect x="674" y="813" width="396" height="265" fill="none" stroke="#10B981" strokeWidth="3" rx="6" />
              <rect x="1270" y="656" width="304" height="266" fill="none" stroke="#10B981" strokeWidth="3" rx="6" />
              <rect x="579" y="380" width="199" height="208" fill="none" stroke="#10B981" strokeWidth="3" rx="6" />
              <rect x="1717" y="597" width="203" height="260" fill="none" stroke="#10B981" strokeWidth="3" rx="6" />
            </svg>
          </div>
        </div>

        {/* Perturbed Condition */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>
              Perturbed Stress Test: {currentPerturbation.name}
            </span>
            <span className="badge badge-danger font-mono">
              {currentPerturbation.perturbedDets} / 10 Detections
            </span>
          </div>

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
              src={currentPerturbation.img}
              alt="Perturbed"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: showSaliency ? 'grayscale(100%) invert(80%)' : 'none',
              }}
            />

            {/* Grad-CAM Heatmap Simulation Overlay */}
            {showGradCam && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(circle at 45% 75%, rgba(239,68,68,0.7) 0%, rgba(245,158,11,0.5) 30%, rgba(56,189,248,0.2) 60%, transparent 80%), radial-gradient(circle at 75% 65%, rgba(239,68,68,0.6) 0%, rgba(245,158,11,0.4) 35%, transparent 70%)',
                  mixBlendMode: 'color-burn',
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* Overlaid Detection Misses & Hits */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1920 1080">
              {/* Maintained detections */}
              <rect x="674" y="813" width="396" height="265" fill="none" stroke="#10B981" strokeWidth="3" rx="6" />
              <rect x="1270" y="656" width="304" height="266" fill="none" stroke="#10B981" strokeWidth="3" rx="6" />

              {/* Missed / False Negative (Red Dashed) */}
              <rect x="579" y="380" width="199" height="208" fill="rgba(239,68,68,0.15)" stroke="#EF4444" strokeWidth="3" strokeDasharray="8 6" rx="6" />
              <rect x="579" y="340" width="220" height="36" fill="#EF4444" rx="4" />
              <text x="589" y="364" fill="#FFF" fontSize="18" fontFamily="JetBrains Mono" fontWeight="700">
                MISSED [FALSE NEGATIVE]
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Robustness Metrics Grid & Human Review Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div className="card">
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Robustness Score</div>
          <div className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '4px' }}>
            {currentPerturbation.robustnessScore}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Resilience Retention Ratio</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Confidence Degradation</div>
          <div className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: '#F87171', marginTop: '4px' }}>
            {currentPerturbation.confidenceDrop}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Avg Confidence Drop</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Missed Detections (FN)</div>
          <div className="font-mono" style={{ fontSize: '26px', fontWeight: 800, color: '#F59E0B', marginTop: '4px' }}>
            {currentPerturbation.falseNegatives} Objects
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Distant Small Vehicles</div>
        </div>

        <div className="card">
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Operational Risk Level</div>
          <div className="font-mono" style={{ fontSize: '20px', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>
            {currentPerturbation.riskLevel}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--accent-violet-light)' }}>Automatic Pre-Filter Recommended</div>
        </div>
      </div>

      {/* Human Review & Fail-Safe Strategy Card */}
      <div className="card">
        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: '#FFF' }}>
          Explainability Insight & Operational Fail-Safe Policy
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Grad-CAM feature maps reveal that during heavy precipitation and night conditions, the network's spatial attention shifts from structural vehicle silhouettes toward specular reflections and headlamp flares.
          <strong> Automated Mitigation:</strong> The pipeline automatically engages the <em>AetherDiff Latent Restorer</em> when camera luminance falls below 35 lux or rain noise variance exceeds 18.0.
        </p>
      </div>
    </div>
  );
};
