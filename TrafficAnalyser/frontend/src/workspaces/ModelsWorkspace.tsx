import React, { useState } from 'react';
import {
  Boxes,
  Cpu,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  Download,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  HardDrive,
  Sliders,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { initialModels } from '../data/mockData';
import { ModelEntry } from '../types';
import { exportToJSON } from '../services/api';

export const ModelsWorkspace: React.FC = () => {
  const [models, setModels] = useState<ModelEntry[]>(initialModels);
  const [filterTask, setFilterTask] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<ModelEntry>(initialModels[0]);
  const [benchmarkingId, setBenchmarkingId] = useState<string | null>(null);
  const [benchmarkLog, setBenchmarkLog] = useState<string[]>([]);
  const [quantizationOverrides, setQuantizationOverrides] = useState<Record<string, 'FP32' | 'FP16' | 'INT8'>>({});

  const filteredModels = models.filter(m => {
    if (filterTask === 'all') return true;
    if (filterTask === 'detection') return m.task.toLowerCase().includes('detection');
    if (filterTask === 'foundation') return m.family.toLowerCase().includes('transformer') || m.task.toLowerCase().includes('zero-shot');
    if (filterTask === 'segmentation') return m.task.toLowerCase().includes('segmentation');
    if (filterTask === 'restoration') return m.task.toLowerCase().includes('restoration');
    if (filterTask === 'tracking') return m.task.toLowerCase().includes('tracking');
    return true;
  });

  const handleRunBenchmark = (modelId: string) => {
    setBenchmarkingId(modelId);
    setBenchmarkLog([`Initializing CUDA device context for ${modelId}...`]);

    setTimeout(() => {
      setBenchmarkLog(prev => [...prev, 'Warming up runtime cache (5 dry runs)...']);
    }, 400);

    setTimeout(() => {
      setBenchmarkLog(prev => [...prev, 'Executing 50 batch iterations with synthetic tensors...']);
    }, 900);

    setTimeout(() => {
      const model = models.find(m => m.id === modelId);
      const currentLatency = model ? model.latencyMs : 10;
      const variation = (Math.random() * 0.8 - 0.4);
      const newLatency = Math.max(1.2, Math.round((currentLatency + variation) * 10) / 10);
      const fps = Math.round(1000 / newLatency);

      setModels(prev =>
        prev.map(m => (m.id === modelId ? { ...m, latencyMs: newLatency } : m))
      );

      setBenchmarkLog(prev => [
        ...prev,
        `✓ Benchmark completed successfully: Avg Latency = ${newLatency}ms | Throughput = ${fps} FPS | Jitter < 0.2ms`,
      ]);
      setBenchmarkingId(null);
    }, 1600);
  };

  const handleMakePrimary = (modelId: string) => {
    setModels(prev =>
      prev.map(m => {
        if (m.id === modelId) {
          return { ...m, status: 'Active (Primary)' };
        }
        if (m.status === 'Active (Primary)') {
          return { ...m, status: 'Ready' };
        }
        return m;
      })
    );
  };

  const handleQuantizationChange = (modelId: string, precision: 'FP32' | 'FP16' | 'INT8') => {
    setQuantizationOverrides(prev => ({ ...prev, [modelId]: precision }));
    setModels(prev =>
      prev.map(m => {
        if (m.id === modelId) {
          let factor = 1.0;
          if (precision === 'FP16') factor = 0.65;
          if (precision === 'INT8') factor = 0.42;
          return {
            ...m,
            quantized: precision,
            latencyMs: Math.round(m.latencyMs * factor * 10) / 10,
          };
        }
        return m;
      })
    );
  };

  const handleExportRegistry = () => {
    exportToJSON('aethervision_model_registry', {
      exportedAt: new Date().toISOString(),
      platform: 'AetherVision AI Platform 2.0',
      totalModels: models.length,
      models,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Workspace Header */}
      <div className="workspace-header">
        <div className="workspace-title-group">
          <h1>
            <span>Model Registry</span> & Edge Deployment
          </h1>
          <p>
            Unified enterprise portfolio orchestrating real-time YOLOv8 detectors, foundation transformers, promptable SAM 2, and latent restoration models.
          </p>
        </div>

        <div className="workspace-actions">
          <button
            onClick={() => handleRunBenchmark(selectedModel.id)}
            className="btn btn-secondary"
            disabled={benchmarkingId !== null}
          >
            {benchmarkingId ? <RotateCcw size={16} className="spin" /> : <Play size={16} />}
            <span>Micro-Benchmark</span>
          </button>

          <button onClick={handleExportRegistry} className="btn btn-primary">
            <Download size={16} />
            <span>Export Manifest</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid-stats">
        <div className="stat-card">
          <div className="stat-label">
            <span>Registered Models</span>
            <Boxes size={16} color="var(--accent-violet)" />
          </div>
          <div className="stat-value">{models.length}</div>
          <div className="stat-trend trend-positive">
            <CheckCircle2 size={13} />
            <span>All 6 ready for edge dispatch</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Primary Detector</span>
            <Activity size={16} color="var(--accent-cyan)" />
          </div>
          <div className="stat-value font-mono">8.4 ms</div>
          <div className="stat-trend trend-positive">
            <span>119 FPS · TensorRT FP16</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Total Parameters</span>
            <Cpu size={16} color="#A78BFA" />
          </div>
          <div className="stat-value font-mono">1.06 B</div>
          <div className="stat-trend">
            <span>Spanning 6 multi-modal checkpoints</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Deployment Readiness</span>
            <ShieldCheck size={16} color="var(--status-success)" />
          </div>
          <div className="stat-value" style={{ color: 'var(--status-success)' }}>
            91.8%
          </div>
          <div className="stat-trend trend-positive">
            <span>Production Grade Certification</span>
          </div>
        </div>
      </div>

      {/* Benchmark Log Banner if Active */}
      {benchmarkLog.length > 0 && (
        <div
          className="card"
          style={{
            backgroundColor: 'rgba(124, 92, 252, 0.08)',
            borderColor: 'var(--surface-border-accent)',
            padding: '16px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
              <Cpu size={16} color="var(--accent-violet)" />
              <span>Real-Time Inference Telemetry Console</span>
              {benchmarkingId && <span className="badge badge-simulated">Benchmarking In-Flight</span>}
            </div>
            <button
              onClick={() => setBenchmarkLog([])}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '11px', padding: '2px 8px' }}
            >
              Clear Log
            </button>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--accent-cyan)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            {benchmarkLog.map((log, idx) => (
              <div key={idx} style={{ opacity: idx === benchmarkLog.length - 1 ? 1 : 0.75 }}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'All Architectures (6)' },
          { id: 'detection', label: 'Object Detectors' },
          { id: 'foundation', label: 'Foundation & Zero-Shot' },
          { id: 'segmentation', label: 'Interactive SAM 2' },
          { id: 'restoration', label: 'Adverse Restoration' },
          { id: 'tracking', label: 'Multi-Object Trackers' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterTask(tab.id)}
            className={`btn btn-sm ${filterTask === tab.id ? 'btn-primary' : 'btn-secondary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Models List & Detail Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Left: Model Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredModels.map(model => {
            const isSelected = selectedModel.id === model.id;
            const currentPrecision = quantizationOverrides[model.id] || model.quantized;

            return (
              <div
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={`card ${isSelected ? 'card-glow' : ''}`}
                style={{
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--accent-violet)' : 'var(--surface-border)',
                  backgroundColor: isSelected ? 'rgba(23, 34, 56, 0.95)' : 'var(--surface-card)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '16px', color: '#FFF' }}>{model.name}</h3>
                      <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                        {model.version}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                      {model.family} · {model.task}
                    </div>
                  </div>

                  <span
                    className={`badge ${
                      model.status === 'Active (Primary)'
                        ? 'badge-real'
                        : model.status === 'Ready'
                        ? 'badge-simulated'
                        : 'badge-neutral'
                    }`}
                  >
                    {model.status}
                  </span>
                </div>

                {/* Specs row */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '10px',
                    padding: '12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--surface-border-subtle)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Latency
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                      {model.latencyMs} ms
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Params
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>
                      {model.paramsMillion} M
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Precision
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#A78BFA' }}>
                      {currentPrecision}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Throughput
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--status-success)', fontFamily: 'var(--font-mono)' }}>
                      {Math.round(1000 / model.latencyMs)} FPS
                    </div>
                  </div>
                </div>

                {/* Readiness Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Production Readiness Score</span>
                    <span style={{ fontWeight: 700, color: '#FFF' }}>{model.deploymentReadiness}%</span>
                  </div>
                  <div style={{ height: '5px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${model.deploymentReadiness}%`,
                        background:
                          model.deploymentReadiness > 90
                            ? 'linear-gradient(90deg, #10B981, #34D399)'
                            : 'linear-gradient(90deg, #7C5CFC, #36D6E7)',
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                </div>

                {/* Actions bottom row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {(['FP32', 'FP16', 'INT8'] as const).map(p => (
                      <button
                        key={p}
                        onClick={e => {
                          e.stopPropagation();
                          handleQuantizationChange(model.id, p);
                        }}
                        className="btn btn-ghost btn-sm"
                        style={{
                          fontSize: '10px',
                          padding: '2px 8px',
                          backgroundColor: currentPrecision === p ? 'var(--surface-hover)' : 'transparent',
                          borderColor: currentPrecision === p ? 'var(--accent-violet)' : 'transparent',
                          color: currentPrecision === p ? '#FFF' : 'var(--text-muted)',
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {model.status !== 'Active (Primary)' && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleMakePrimary(model.id);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '11px' }}
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleRunBenchmark(model.id);
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '11px' }}
                      disabled={benchmarkingId === model.id}
                    >
                      {benchmarkingId === model.id ? 'Benchmarking...' : 'Test Speed'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Model Inspector & Architecture Topology */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Detailed Inspector Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--surface-border)', paddingBottom: '14px' }}>
              <div>
                <h2 style={{ fontSize: '18px', color: '#FFF' }}>{selectedModel.name}</h2>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Architecture Deep Dive & Hardware Binding
                </div>
              </div>
              <span className="badge badge-real">{selectedModel.quantized} Optimized</span>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {selectedModel.description}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid var(--surface-border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target Hardware</span>
                <span style={{ color: '#FFF', fontWeight: 600 }}>{selectedModel.hardware}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid var(--surface-border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Runtime Engine</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{selectedModel.runtime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid var(--surface-border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>Input Tensor Shape</span>
                <span style={{ color: '#FFF', fontFamily: 'var(--font-mono)' }}>{selectedModel.inputShape}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid var(--surface-border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>API REST / gRPC Route</span>
                <span style={{ color: 'var(--accent-violet-light)', fontFamily: 'var(--font-mono)' }}>{selectedModel.endpoint}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid var(--surface-border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)' }}>ONNX Export Ready</span>
                <span style={{ color: selectedModel.onnxReady ? 'var(--status-success)' : '#F59E0B', fontWeight: 600 }}>
                  {selectedModel.onnxReady ? '✓ Verified ONNX 1.15' : 'Experimental / PyTorch Native'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', padding: '6px 0' }}>
                <span style={{ color: 'var(--text-muted)' }}>Knowledge Distillation</span>
                <span style={{ color: selectedModel.distilReady ? 'var(--status-success)' : 'var(--text-muted)' }}>
                  {selectedModel.distilReady ? 'Teacher-Student Distill Supported' : 'Monolithic Weight'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => handleRunBenchmark(selectedModel.id)}
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={benchmarkingId === selectedModel.id}
              >
                <Zap size={15} />
                <span>Benchmark {selectedModel.name}</span>
              </button>
              <button
                onClick={() =>
                  exportToJSON(`${selectedModel.id}_spec`, selectedModel)
                }
                className="btn btn-secondary"
              >
                <Download size={15} />
              </button>
            </div>
          </div>

          {/* Unified Vision Pipeline Topology Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={16} color="var(--accent-violet)" />
              <h3 style={{ fontSize: '14px', color: '#FFF' }}>End-to-End Visual Intelligence Pipeline</h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              How AetherVision chains multiple models seamlessly in real-time edge execution:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(54, 214, 231, 0.08)',
                  border: '1px solid rgba(54, 214, 231, 0.2)',
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>Stage 1</span>
                <span>Camera Stream ➔ <strong>AetherDiff Restorer</strong> (Rain & Low-Light Enhancement)</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(124, 92, 252, 0.08)',
                  border: '1px solid rgba(124, 92, 252, 0.2)',
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--accent-violet)' }}>Stage 2</span>
                <span>Restored Frame ➔ <strong>YOLOv8n + ByteTrack</strong> (Bounding Boxes & Velocity Vectors)</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                <span style={{ fontWeight: 700, color: '#34D399' }}>Stage 3</span>
                <span>Detected Crops ➔ <strong>CLIP & DINOv2</strong> (Zero-Shot & Semantic Embeddings)</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                }}
              >
                <span style={{ fontWeight: 700, color: '#FBBF24' }}>Stage 4</span>
                <span>Operator Prompts ➔ <strong>SAM 2</strong> (Promptable Pixel Segmentation Masks)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
