import React, { useState, useRef } from 'react';
import {
  Scissors,
  PlusCircle,
  MinusCircle,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  Sliders,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { SAMPoint } from '../types';

export const SegmentationLabWorkspace: React.FC = () => {
  const [promptMode, setPromptMode] = useState<'positive' | 'negative' | 'box'>('positive');
  const [points, setPoints] = useState<SAMPoint[]>([
    { x: 440, y: 520, type: 'positive' },
    { x: 490, y: 540, type: 'positive' },
    { x: 380, y: 610, type: 'negative' },
  ]);
  const [maskOpacity, setMaskOpacity] = useState<number>(0.65);
  const [selectedPreset, setSelectedPreset] = useState<'car1' | 'truck' | 'pedestrian'>('car1');
  const [splitPosition, setSplitPosition] = useState<number>(50); // for before/after comparison
  const [isComparing, setIsComparing] = useState<boolean>(false);

  // Handle click on canvas to add interactive SAM 2 point prompts
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isComparing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1920);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1080);

    if (promptMode === 'positive' || promptMode === 'negative') {
      setPoints([...points, { x, y, type: promptMode }]);
    }
  };

  const handleClearPoints = () => {
    setPoints([]);
  };

  // Preset polygon masks corresponding to highway_frame.jpg objects
  const getMaskSvgPath = () => {
    if (selectedPreset === 'car1') {
      // Car #108 mask
      return 'M 674 920 C 700 840, 780 813, 890 813 C 1000 813, 1070 850, 1070 950 C 1070 1020, 1030 1078, 870 1078 C 730 1078, 674 1030, 674 920 Z';
    } else if (selectedPreset === 'truck') {
      // Truck mask
      return 'M 1270 700 L 1480 656 L 1574 720 L 1574 922 L 1270 922 Z';
    } else {
      // Small vehicle
      return 'M 579 450 C 600 380, 720 380, 778 450 C 778 520, 750 588, 670 588 C 600 588, 579 530, 579 450 Z';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="workspace-header">
        <div className="workspace-title-group">
          <h1>
            <span>Segmentation Lab — SAM 2 (Segment Anything 2)</span>
            <span className="badge badge-simulated">Promptable Mask Decoder (Simulated)</span>
          </h1>
          <p className="workspace-description">
            Interactive zero-shot instance mask extraction via positive/negative point prompts and bounding-box spatial attention.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsComparing(!isComparing)}
            className={`btn btn-sm ${isComparing ? 'btn-primary' : 'btn-secondary'}`}
          >
            <Sliders size={14} />
            {isComparing ? 'Exit Split View' : 'Compare Split Slider'}
          </button>
          <button onClick={handleClearPoints} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} />
            Clear Prompts
          </button>
        </div>
      </div>

      {/* Model Workflow Diagram Strip */}
      <div
        className="card"
        style={{
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          backgroundColor: 'var(--surface-elevated)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#FFF' }}>
          <span className="badge badge-cyan font-mono">1. Image Encoder</span>
          <span>Hiera ViT-Large (1024x1024)</span>
        </div>
        <span style={{ color: 'var(--text-muted)' }}>➔</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#FFF' }}>
          <span className="badge badge-violet font-mono">2. Prompt Encoder</span>
          <span>{points.length} Points + Positional Embeddings</span>
        </div>
        <span style={{ color: 'var(--text-muted)' }}>➔</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#FFF' }}>
          <span className="badge badge-real font-mono">3. Two-Way Transformer</span>
          <span>Lightweight Mask Decoder</span>
        </div>
      </div>

      {/* Main Studio View */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' }}>
        {/* Left: Canvas with Interactive Clicks */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Prompt Mode Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Prompt Tool:
              </span>
              <button
                onClick={() => setPromptMode('positive')}
                className={`btn btn-sm ${promptMode === 'positive' ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  backgroundColor: promptMode === 'positive' ? '#10B981' : undefined,
                  borderColor: promptMode === 'positive' ? '#10B981' : undefined,
                }}
              >
                <PlusCircle size={13} />
                + Positive Foreground
              </button>
              <button
                onClick={() => setPromptMode('negative')}
                className={`btn btn-sm ${promptMode === 'negative' ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  backgroundColor: promptMode === 'negative' ? '#EF4444' : undefined,
                  borderColor: promptMode === 'negative' ? '#EF4444' : undefined,
                }}
              >
                <MinusCircle size={13} />
                - Negative Background
              </button>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Click directly on the image to add prompt anchors.
            </div>
          </div>

          {/* Canvas or Split Slider */}
          {!isComparing ? (
            <div
              onClick={handleCanvasClick}
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: '#000',
                cursor: 'crosshair',
                border: '1px solid var(--surface-border)',
              }}
            >
              <img
                src="/samples/highway_frame.jpg"
                alt="SAM Target"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Render Mask Polygon */}
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
                {/* Generated Zero-Shot SAM 2 Mask */}
                <path
                  d={getMaskSvgPath()}
                  fill="#7C5CFC"
                  fillOpacity={maskOpacity}
                  stroke="#36D6E7"
                  strokeWidth="3.5"
                />

                {/* Render Prompt Points */}
                {points.map((pt, i) => (
                  <g key={i}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="10"
                      fill={pt.type === 'positive' ? '#10B981' : '#EF4444'}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                    <text
                      x={pt.x + 14}
                      y={pt.y + 5}
                      fill="#FFFFFF"
                      fontSize="14"
                      fontFamily="JetBrains Mono"
                      fontWeight="700"
                    >
                      {pt.type === 'positive' ? `+P${i + 1}` : `-N${i + 1}`}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Canvas Floating Info */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  padding: '6px 12px',
                  backgroundColor: 'rgba(11, 16, 32, 0.85)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  color: '#FFF',
                  fontFamily: 'var(--font-mono)',
                  border: '1px solid var(--surface-border)',
                }}
              >
                SAM 2 Output · {points.length} Prompt Points
              </div>
            </div>
          ) : (
            /* Before/After Split Comparison Slider */
            <div
              className="split-slider-container"
              style={{ width: '100%', aspectRatio: '16/9' }}
              onMouseMove={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                setSplitPosition(Math.max(5, Math.min(95, x)));
              }}
            >
              {/* Before: Raw Image */}
              <img
                src="/samples/highway_frame.jpg"
                alt="Raw"
                className="split-slider-image"
                style={{ height: '100%' }}
              />

              {/* After: Mask Overlay */}
              <div
                className="split-slider-overlay"
                style={{ clipPath: `polygon(${splitPosition}% 0, 100% 0, 100% 100%, ${splitPosition}% 100%)` }}
              >
                <img
                  src="/samples/highway_frame.jpg"
                  alt="Segmented"
                  className="split-slider-image"
                  style={{ height: '100%', filter: 'contrast(110%)' }}
                />
                <svg
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                  viewBox="0 0 1920 1080"
                >
                  <path d={getMaskSvgPath()} fill="#7C5CFC" fillOpacity={maskOpacity} stroke="#36D6E7" strokeWidth="4" />
                </svg>
              </div>

              {/* Slider Handle */}
              <div className="split-slider-handle" style={{ left: `${splitPosition}%` }}>
                <div className="split-slider-knob">⇄</div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Controls & Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Target Instance Preset */}
          <div className="card">
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#FFF' }}>
              Instance Target Preset
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'car1', name: 'Primary Sedan #108 (Fast Lane)', tag: 'High Confidence' },
                { id: 'truck', name: 'Heavy Commercial Freight #104', tag: 'Boundary Occlusion' },
                { id: 'pedestrian', name: 'Distal Passenger Car #101', tag: 'Small Object Challenge' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedPreset(opt.id as any)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: selectedPreset === opt.id ? '1px solid var(--accent-violet)' : '1px solid var(--surface-border)',
                    backgroundColor: selectedPreset === opt.id ? 'var(--surface-hover)' : 'var(--surface-elevated)',
                    color: selectedPreset === opt.id ? '#FFF' : 'var(--text-secondary)',
                    textAlign: 'left',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{opt.name}</div>
                    <div style={{ fontSize: '10px', color: 'var(--accent-cyan)' }}>{opt.tag}</div>
                  </div>
                  {selectedPreset === opt.id && <CheckCircle2 size={15} color="var(--accent-cyan)" />}
                </button>
              ))}
            </div>
          </div>

          {/* Mask Opacity Slider */}
          <div className="card">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <div className="form-label">
                <span>Mask Overlay Opacity</span>
                <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>
                  {Math.round(maskOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                className="form-range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={maskOpacity}
                onChange={e => setMaskOpacity(parseFloat(e.target.value))}
              />
            </div>
          </div>

          {/* Mask Metrics & Geometric Telemetry */}
          <div className="card">
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '14px', color: '#FFF' }}>
              Segment Mask Geometry & Quality Metrics
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ backgroundColor: 'var(--surface-elevated)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Surface Area</div>
                <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: '#FFF' }}>
                  104,940 <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>px²</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--accent-cyan)' }}>≈ 8.42 m² (Calibrated)</div>
              </div>

              <div style={{ backgroundColor: 'var(--surface-elevated)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Mask IoU Quality</div>
                <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-success)' }}>
                  0.924
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Illustrative metric</div>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              SAM 2 multi-mask ambiguity resolution automatically returns the highest stability score mask predicted by the decoder MLP head.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
