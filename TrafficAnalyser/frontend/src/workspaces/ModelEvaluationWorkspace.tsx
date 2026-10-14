import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  Sliders,
  HelpCircle,
  Clock,
  Zap,
} from 'lucide-react';

export const ModelEvaluationWorkspace: React.FC = () => {
  const [selectedSplit, setSelectedSplit] = useState<'val' | 'test' | 'train'>('val');
  const [selectedClassRow, setSelectedClassRow] = useState<string | null>(null);

  const classes = ['Car', 'Truck', 'Bus', 'Motorcycle', 'Bicycle', 'Pedestrian'];

  // Normalized 6x6 Confusion Matrix
  const confusionMatrix = [
    [0.94, 0.02, 0.01, 0.01, 0.01, 0.01], // Car
    [0.03, 0.91, 0.04, 0.01, 0.00, 0.01], // Truck
    [0.02, 0.03, 0.93, 0.01, 0.00, 0.01], // Bus
    [0.04, 0.01, 0.00, 0.89, 0.04, 0.02], // Motorcycle
    [0.02, 0.00, 0.00, 0.05, 0.86, 0.07], // Bicycle
    [0.03, 0.00, 0.01, 0.03, 0.05, 0.88], // Pedestrian
  ];

  const perClassMetrics = [
    { className: 'Car (Sedan/SUV)', ap50: 0.962, ap5095: 0.814, precision: 0.948, recall: 0.932, f1: 0.940, samples: 6420 },
    { className: 'Commercial Truck', ap50: 0.924, ap5095: 0.748, precision: 0.912, recall: 0.894, f1: 0.903, samples: 1840 },
    { className: 'Transit Bus', ap50: 0.938, ap5095: 0.762, precision: 0.928, recall: 0.912, f1: 0.920, samples: 940 },
    { className: 'Motorcycle', ap50: 0.894, ap5095: 0.702, precision: 0.884, recall: 0.868, f1: 0.876, samples: 1220 },
    { className: 'Bicycle', ap50: 0.865, ap5095: 0.648, precision: 0.852, recall: 0.834, f1: 0.843, samples: 580 },
    { className: 'Pedestrian', ap50: 0.882, ap5095: 0.674, precision: 0.871, recall: 0.856, f1: 0.863, samples: 820 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="workspace-header">
        <div className="workspace-title-group">
          <h1>
            <span>Model Evaluation & Benchmark Center</span>
            <span className="badge badge-real">COCO mAP & MOTA Protocol</span>
          </h1>
          <p className="workspace-description">
            Quantitative technical validation metrics: mAP@0.5:0.95, normalized confusion matrix, precision-recall trade-offs, and tracking continuity.
          </p>
        </div>

        {/* Dataset Split Selector */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['val', 'test', 'train'] as const).map(split => (
            <button
              key={split}
              onClick={() => setSelectedSplit(split)}
              className={`btn btn-sm ${selectedSplit === split ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textTransform: 'uppercase' }}
            >
              {split} Set
            </button>
          ))}
        </div>
      </div>

      {/* KPI Metric Summary Strip */}
      <div className="grid-kpi">
        <div className="kpi-card card-glow">
          <div className="kpi-header">
            <span className="kpi-title">mAP @ 0.50</span>
            <BarChart3 size={16} color="var(--accent-cyan)" />
          </div>
          <div className="kpi-value">92.3%</div>
          <div className="kpi-subtext" style={{ color: 'var(--status-success)' }}>
            <span>Intersection-over-Union 0.50</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">mAP @ 0.50:0.95</span>
            <TrendingUp size={16} color="var(--accent-violet)" />
          </div>
          <div className="kpi-value">74.8%</div>
          <div className="kpi-subtext">
            <span>Primary COCO benchmark</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Precision / Recall</span>
            <CheckCircle2 size={16} color="var(--status-success)" />
          </div>
          <div className="kpi-value">91.4% / 88.7%</div>
          <div className="kpi-subtext">
            <span>Harmonic F1: 90.0%</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Tracking MOTA</span>
            <Layers size={16} color="var(--status-info)" />
          </div>
          <div className="kpi-value">87.4%</div>
          <div className="kpi-subtext">
            <span>IDF1 Score: 89.1%</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">Inference Speed</span>
            <Zap size={16} color="var(--accent-cyan)" />
          </div>
          <div className="kpi-value">8.4 ms <span style={{ fontSize: '12px' }}>GPU</span></div>
          <div className="kpi-subtext">
            <span>CPU Runtime: 42.1 ms</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-title">VRAM Footprint</span>
            <Cpu size={16} color="var(--text-secondary)" />
          </div>
          <div className="kpi-value">1.84 <span style={{ fontSize: '13px' }}>GB</span></div>
          <div className="kpi-subtext">
            <span>TensorRT FP16 Engine</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Confusion Matrix & PR Curve */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Normalized Confusion Matrix */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFF' }}>
                Normalized Confusion Matrix (Validation Set)
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Rows: Ground Truth Class | Columns: Model Predicted Class
              </div>
            </div>
            <span className="badge badge-neutral">Diagonal = Accuracy</span>
          </div>

          <div className="data-table-container">
            <table className="data-table" style={{ textAlign: 'center' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>True \ Pred</th>
                  {classes.map(c => (
                    <th key={c}>{c.substring(0, 4)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classes.map((c, rIdx) => (
                  <tr key={c}>
                    <td style={{ fontWeight: 600, color: '#FFF', textAlign: 'left' }}>{c}</td>
                    {confusionMatrix[rIdx].map((val, cIdx) => {
                      const isDiagonal = rIdx === cIdx;
                      const opacity = isDiagonal ? val : Math.min(1, val * 5);
                      const bg = isDiagonal
                        ? `rgba(124, 92, 252, ${opacity * 0.7})`
                        : val > 0.03
                        ? `rgba(239, 68, 68, ${opacity * 0.4})`
                        : 'transparent';

                      return (
                        <td
                          key={cIdx}
                          style={{
                            backgroundColor: bg,
                            fontWeight: isDiagonal ? 700 : 400,
                            color: isDiagonal ? '#FFF' : 'var(--text-secondary)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                          }}
                        >
                          {(val * 100).toFixed(0)}%
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Precision-Recall Curve Representation */}
        <div className="card">
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#FFF' }}>
            Multi-Class Precision-Recall Curve
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Interpolated 101-point COCO PR curves for vehicle classes.
          </div>

          {/* SVG PR Curve */}
          <div
            style={{
              height: '240px',
              backgroundColor: '#070C18',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--surface-border)',
              position: 'relative',
              padding: '12px',
            }}
          >
            <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%' }}>
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="380" y2="20" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="40" y1="65" x2="380" y2="65" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="40" y1="110" x2="380" y2="110" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="40" y1="155" x2="380" y2="155" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="40" y1="175" x2="380" y2="175" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              <line x1="40" y1="20" x2="40" y2="175" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />

              {/* Axis Labels */}
              <text x="10" y="25" fill="#64748B" fontSize="10" fontFamily="JetBrains Mono">1.0</text>
              <text x="10" y="100" fill="#64748B" fontSize="10" fontFamily="JetBrains Mono">0.5</text>
              <text x="10" y="175" fill="#64748B" fontSize="10" fontFamily="JetBrains Mono">0.0</text>
              <text x="350" y="195" fill="#64748B" fontSize="10" fontFamily="JetBrains Mono">Recall</text>

              {/* Curves */}
              {/* Car Curve (Violet) */}
              <path
                d="M 40 25 C 200 26, 320 35, 360 175"
                fill="none"
                stroke="#7C5CFC"
                strokeWidth="2.5"
              />
              {/* Truck Curve (Cyan) */}
              <path
                d="M 40 30 C 180 32, 290 48, 340 175"
                fill="none"
                stroke="#36D6E7"
                strokeWidth="2.5"
              />
              {/* Motorcycle Curve (Amber) */}
              <path
                d="M 40 35 C 160 40, 260 65, 310 175"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div style={{ display: 'flex', gap: '14px', marginTop: '12px', fontSize: '11px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#7C5CFC' }}>
              ● Car (AP: 0.962)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#36D6E7' }}>
              ● Truck (AP: 0.924)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B' }}>
              ● Motorcycle (AP: 0.894)
            </span>
          </div>
        </div>
      </div>

      {/* Per-Class Performance Table */}
      <div className="card">
        <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: '#FFF' }}>
          Per-Class Detailed Evaluation Breakdown
        </div>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle Class</th>
                <th>Validation Samples</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1-Score</th>
                <th>mAP @ 0.50</th>
                <th>mAP @ 0.50:0.95</th>
              </tr>
            </thead>
            <tbody>
              {perClassMetrics.map(item => (
                <tr key={item.className}>
                  <td style={{ fontWeight: 600, color: '#FFF' }}>{item.className}</td>
                  <td className="font-mono">{item.samples.toLocaleString()}</td>
                  <td className="font-mono" style={{ color: 'var(--status-success)' }}>
                    {(item.precision * 100).toFixed(1)}%
                  </td>
                  <td className="font-mono">{(item.recall * 100).toFixed(1)}%</td>
                  <td className="font-mono">{(item.f1 * 100).toFixed(1)}%</td>
                  <td className="font-mono" style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    {(item.ap50 * 100).toFixed(1)}%
                  </td>
                  <td className="font-mono" style={{ color: 'var(--accent-violet-light)' }}>
                    {(item.ap5095 * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
