import React, { useState } from 'react';
import {
  FlaskConical,
  Plus,
  GitCompare,
  TrendingDown,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Sliders,
  Filter,
} from 'lucide-react';
import { initialExperiments } from '../data/mockData';
import { ExperimentRecord } from '../types';

export const ExperimentsWorkspace: React.FC = () => {
  const [experiments, setExperiments] = useState<ExperimentRecord[]>(initialExperiments);
  const [selectedExp, setSelectedExp] = useState<ExperimentRecord>(initialExperiments[0]);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);

  // New Experiment Form State
  const [newName, setNewName] = useState('');
  const [newModel, setNewModel] = useState('YOLOv8n + SAM 2 Hybrid');
  const [newDataset, setNewDataset] = useState('Highway & Arterial Multi-Class 10k');
  const [newMetric, setNewMetric] = useState('mAP@0.5:0.95');

  const handleCreateExperiment = () => {
    if (!newName) return;
    const exp: ExperimentRecord = {
      id: `EXP-${Math.floor(100 + Math.random() * 900)}`,
      name: newName,
      modelFamily: newModel,
      dataset: newDataset,
      primaryMetric: newMetric,
      score: 0.812,
      status: 'completed',
      date: new Date().toISOString().split('T')[0],
      parameters: {
        'Learning Rate': '0.001',
        'Optimizer': 'AdamW',
        'Epochs': '100',
        'Batch Size': '32',
      },
      insights: 'Ablation study completed with validation plateau reached at epoch 74.',
      lossHistory: [2.9, 2.2, 1.7, 1.3, 1.05, 0.84, 0.71, 0.61, 0.53, 0.49],
    };
    setExperiments([exp, ...experiments]);
    setSelectedExp(exp);
    setShowNewModal(false);
    setNewName('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="workspace-header">
        <div className="workspace-title-group">
          <h1>
            <span>Experiments & Architecture Ablation Studies</span>
            <span className="badge badge-simulated">MLOps Tracking & Benchmarking</span>
          </h1>
          <p className="workspace-description">
            Hypothesis testing, head-to-head architectural comparisons (CNN vs ViT, Pure YOLO vs YOLO+ByteTrack), and training loss convergence tracking.
          </p>
        </div>

        <button onClick={() => setShowNewModal(true)} className="btn btn-primary btn-sm">
          <Plus size={14} />
          Create New Experiment
        </button>
      </div>

      {/* Main Grid: Experiment List on Left, Comparative Deep Dive on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.6fr', gap: '20px' }}>
        {/* Experiment Roster */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', color: '#FFF' }}>
            Experiment Runs Archive ({experiments.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {experiments.map(exp => {
              const isSelected = selectedExp.id === exp.id;
              return (
                <div
                  key={exp.id}
                  onClick={() => setSelectedExp(exp)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--surface-hover)' : 'var(--surface-elevated)',
                    border: isSelected ? '1px solid var(--accent-violet)' : '1px solid var(--surface-border)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="font-mono" style={{ fontSize: '11px', color: 'var(--accent-cyan)' }}>
                      {exp.id} · {exp.date}
                    </span>
                    <span className="badge badge-real font-mono">Score: {exp.score}</span>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF', lineHeight: 1.3 }}>
                    {exp.name}
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {exp.modelFamily} · {exp.dataset}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Experiment Deep Dive */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="badge badge-violet">{selectedExp.modelFamily}</span>
              <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Target: {selectedExp.primaryMetric}
              </span>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>
              {selectedExp.name}
            </h2>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              {selectedExp.insights}
            </p>

            {/* Hyperparameters / Comparison Parameters */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                padding: '14px',
                backgroundColor: 'var(--surface-elevated)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '16px',
              }}
            >
              {Object.entries(selectedExp.parameters).map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{k}</div>
                  <div className="font-mono" style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>

            {/* Convergence Loss History Curve */}
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#FFF' }}>
                Evaluation Loss Convergence Curve (10 Checkpoints)
              </div>
              <div
                style={{
                  height: '140px',
                  backgroundColor: '#070C18',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--surface-border)',
                  padding: '10px',
                }}
              >
                <svg viewBox="0 0 300 100" style={{ width: '100%', height: '100%' }}>
                  <path
                    d={`M 10 ${selectedExp.lossHistory[0] * 25} ${selectedExp.lossHistory
                      .map((val, idx) => `L ${10 + idx * 30} ${val * 25}`)
                      .join(' ')}`}
                    fill="none"
                    stroke="#7C5CFC"
                    strokeWidth="2.5"
                  />
                  {selectedExp.lossHistory.map((val, idx) => (
                    <circle
                      key={idx}
                      cx={10 + idx * 30}
                      cy={val * 25}
                      r="3.5"
                      fill="#36D6E7"
                      stroke="#0B1020"
                      strokeWidth="1.5"
                    />
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Experiment Modal */}
      {showNewModal && (
        <div className="modal-overlay" onClick={() => setShowNewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <span style={{ fontSize: '15px', fontWeight: 700 }}>Initialize Ablation Experiment</span>
              <button onClick={() => setShowNewModal(false)} className="btn btn-ghost btn-sm">✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Experiment Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. YOLOv8n vs SAM 2 Hybrid Mask Verification"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Model Architecture Pair</label>
                <select value={newModel} onChange={e => setNewModel(e.target.value)} className="form-select">
                  <option value="YOLOv8n vs ViT-Det-B">YOLOv8n vs ViT-Det-B</option>
                  <option value="CLIP-ViT-L vs DINOv2-ViT-B">CLIP-ViT-L vs DINOv2-ViT-B</option>
                  <option value="Raw Footage vs AetherDiff Restored">Raw Footage vs AetherDiff Restored</option>
                  <option value="FP16 vs INT8 Quantized">FP16 vs INT8 Quantized</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Evaluation Metric</label>
                <select value={newMetric} onChange={e => setNewMetric(e.target.value)} className="form-select">
                  <option value="mAP@0.5:0.95">mAP@0.5:0.95</option>
                  <option value="Tracking MOTA">Tracking MOTA</option>
                  <option value="Latency (ms)">Latency (ms)</option>
                  <option value="Recall@5">Recall@5</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowNewModal(false)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button onClick={handleCreateExperiment} className="btn btn-primary btn-sm">
                Launch Evaluation Run
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
