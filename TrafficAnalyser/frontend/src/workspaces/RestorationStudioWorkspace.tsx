import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  Sun,
  CloudRain,
  Eye,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  Cpu,
} from 'lucide-react';

export const RestorationStudioWorkspace: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<'low-light' | 'rain' | 'blur' | 'inpainting'>('low-light');
  const [splitPos, setSplitPos] = useState<number>(50);
  const [strength, setStrength] = useState<number>(85);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const tasks = [
    {
      id: 'low-light',
      title: 'Low-Light & Shadow Enhancement',
      desc: 'Retinex-Diffusion curve optimization for night-time corridor surveillance.',
      degradedImg: '/samples/highway_lowlight.jpg',
      restoredImg: '/samples/highway_restored.jpg',
      psnr: '28.4 dB',
      ssim: '0.942',
      lpips: '0.068',
      latency: '142 ms',
    },
    {
      id: 'rain',
      title: 'Heavy Rain Streak Removal & Dehazing',
      desc: 'Latent inpainting of high-speed rain streak occlusions & atmospheric scatter.',
      degradedImg: '/samples/highway_rain.jpg',
      restoredImg: '/samples/highway_frame.jpg',
      psnr: '31.2 dB',
      ssim: '0.961',
      lpips: '0.045',
      latency: '168 ms',
    },
    {
      id: 'blur',
      title: 'High-Speed Motion Deblurring',
      desc: 'Wiener-deconvolution & SwinIR restoring license plates & vehicle boundaries.',
      degradedImg: '/samples/highway_blurred.jpg',
      restoredImg: '/samples/highway_frame.jpg',
      psnr: '29.8 dB',
      ssim: '0.954',
      lpips: '0.052',
      latency: '124 ms',
    },
    {
      id: 'inpainting',
      title: 'Structural Obstruction Inpainting',
      desc: 'Fills occluded bridge piers and sensor dead-zones with generative context.',
      degradedImg: '/samples/highway_occluded.jpg',
      restoredImg: '/samples/highway_frame.jpg',
      psnr: '27.6 dB',
      ssim: '0.928',
      lpips: '0.081',
      latency: '194 ms',
    },
  ];

  const currentTask = tasks.find(t => t.id === selectedTask) || tasks[0];

  const handleApplyRestoration = async () => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 600));
    setIsProcessing(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="workspace-header">
        <div className="workspace-title-group">
          <h1>
            <span>Adverse Weather & Image Restoration Studio</span>
            <span className="badge badge-simulated">Latent Diffusion / Restormer (Simulated)</span>
          </h1>
          <p className="workspace-description">
            Generative diffusion and transformer-based image restoration for low-light noise, rain streaks, motion blur, and sensor occlusions.
          </p>
        </div>
      </div>

      {/* Pipeline Diagram Strip */}
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
          <span className="badge badge-cyan font-mono">Input Frame</span>
          <span>Adverse Weather Stream</span>
        </div>
        <span style={{ color: 'var(--text-muted)' }}>➔</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#FFF' }}>
          <span className="badge badge-violet font-mono">Diffusion Restorer</span>
          <span>Latent Denoising (UNet / SwinIR)</span>
        </div>
        <span style={{ color: 'var(--text-muted)' }}>➔</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#FFF' }}>
          <span className="badge badge-real font-mono">Enhanced Output</span>
          <span>Restored for YOLO Detection</span>
        </div>
      </div>

      {/* Main Grid: Interactive Split Slider on Left, Controls on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' }}>
        {/* Left: Interactive Split Comparison Slider */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>
              Interactive Split Slider: Raw Degraded vs Restored Output
            </div>
            <div style={{ fontSize: '11px', color: 'var(--accent-cyan)' }}>
              Drag cursor across frame to compare
            </div>
          </div>

          <div
            className="split-slider-container"
            style={{ width: '100%', aspectRatio: '16/9' }}
            onMouseMove={e => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              setSplitPos(Math.max(5, Math.min(95, x)));
            }}
          >
            {/* Base: Degraded Frame */}
            <img
              src={currentTask.degradedImg}
              alt="Degraded"
              className="split-slider-image"
              style={{ height: '100%' }}
            />

            {/* Overlay: Restored Frame */}
            <div
              className="split-slider-overlay"
              style={{ clipPath: `polygon(${splitPos}% 0, 100% 0, 100% 100%, ${splitPos}% 100%)` }}
            >
              <img
                src={currentTask.restoredImg}
                alt="Restored"
                className="split-slider-image"
                style={{ height: '100%' }}
              />
            </div>

            {/* Draggable Divider Handle */}
            <div className="split-slider-handle" style={{ left: `${splitPos}%` }}>
              <div className="split-slider-knob">⇄</div>
            </div>

            {/* Labels */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                padding: '4px 10px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#F87171',
              }}
            >
              Degraded Input ({splitPos.toFixed(0)}%)
            </div>
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                padding: '4px 10px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--accent-cyan)',
              }}
            >
              Diffusion Restored Output
            </div>
          </div>
        </div>

        {/* Right: Task Selection & Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Preset Task Selector */}
          <div className="card">
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#FFF' }}>
              Restoration Model Scenario
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tasks.map(t => {
                const isSelected = selectedTask === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTask(t.id as any)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--surface-hover)' : 'var(--surface-elevated)',
                      border: isSelected ? '1px solid var(--accent-violet)' : '1px solid var(--surface-border)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 600, color: isSelected ? '#FFF' : 'var(--text-secondary)' }}>
                      {t.title}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{t.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Restoration Strength Slider */}
          <div className="card">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <div className="form-label">
                <span>Denoising Strength</span>
                <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>{strength}%</span>
              </div>
              <input
                type="range"
                className="form-range"
                min="10"
                max="100"
                value={strength}
                onChange={e => setStrength(parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Image Quality Metrics */}
          <div className="card">
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#FFF' }}>
              Image Reconstruction Quality Metrics
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ backgroundColor: 'var(--surface-elevated)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PSNR Metric</div>
                <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--status-success)' }}>
                  {currentTask.psnr}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Peak Signal-to-Noise</div>
              </div>

              <div style={{ backgroundColor: 'var(--surface-elevated)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SSIM Index</div>
                <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                  {currentTask.ssim}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Structural Similarity</div>
              </div>

              <div style={{ backgroundColor: 'var(--surface-elevated)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>LPIPS Perceptual</div>
                <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--accent-violet-light)' }}>
                  {currentTask.lpips}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Lower is better</div>
              </div>

              <div style={{ backgroundColor: 'var(--surface-elevated)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Inference Latency</div>
                <div className="font-mono" style={{ fontSize: '18px', fontWeight: 700, color: '#FFF' }}>
                  {currentTask.latency}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>NVIDIA TensorRT</div>
              </div>
            </div>

            <button
              onClick={handleApplyRestoration}
              disabled={isProcessing}
              className="btn btn-primary btn-sm"
              style={{ width: '100%' }}
            >
              {isProcessing ? 'Restoring Latent Passes...' : '⚡ Re-Run Latent Restoration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
