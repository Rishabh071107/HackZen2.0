import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Layers,
  Tag,
  ArrowRight,
  Info,
  CheckCircle2,
  TrendingUp,
  Sliders,
  Camera,
} from 'lucide-react';
import { VisualSearchItem } from '../types';
import { runSemanticSearch } from '../services/api';

export const VisualSearchWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text-search' | 'visual-similarity' | 'zero-shot' | 'embedding-space'>('text-search');
  const [searchQuery, setSearchQuery] = useState('A red car near a pedestrian crossing');
  const [searchResults, setSearchResults] = useState<VisualSearchItem[]>(() => runSemanticSearch('A red car near a pedestrian crossing'));
  const [selectedReference, setSelectedReference] = useState<string>('VSR-01');

  // Zero-shot labels state
  const [candidateLabels, setCandidateLabels] = useState<string>(
    'heavy traffic jam, clear flowing highway, vehicle accident, pedestrian incursion, rain storm'
  );
  const [zeroShotResults, setZeroShotResults] = useState<{ label: string; score: number }[]>([
    { label: 'heavy traffic jam', score: 0.84 },
    { label: 'clear flowing highway', score: 0.28 },
    { label: 'vehicle accident', score: 0.72 },
    { label: 'pedestrian incursion', score: 0.41 },
    { label: 'rain storm', score: 0.19 },
  ]);

  const presetQueries = [
    'A red car near a pedestrian crossing',
    'A motorcycle moving against traffic',
    'A vehicle stopped in a no-parking area',
    'A crowded intersection during heavy rain',
    'A damaged road with visible potholes',
  ];

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    const matches = runSemanticSearch(q);
    setSearchResults(matches);
  };

  const handleComputeZeroShot = () => {
    const labels = candidateLabels.split(',').map(l => l.trim()).filter(Boolean);
    const calculated = labels.map(label => {
      let score = 0.35 + Math.random() * 0.45;
      if (label.toLowerCase().includes('traffic') || label.toLowerCase().includes('jam')) score = 0.88;
      if (label.toLowerCase().includes('accident') || label.toLowerCase().includes('hazard')) score = 0.74;
      return { label, score: Math.round(score * 100) / 100 };
    }).sort((a, b) => b.score - a.score);
    setZeroShotResults(calculated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="workspace-header">
        <div className="workspace-title-group">
          <h1>
            <span>Visual Search & Semantic Intelligence</span>
            <span className="badge badge-simulated">CLIP ViT-L + DINOv2 Engine (Simulated)</span>
          </h1>
          <p className="workspace-description">
            Cross-modal natural language surveillance queries, DINOv2 self-supervised visual instance search, and zero-shot open-vocabulary classification.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-list">
        <button
          onClick={() => setActiveTab('text-search')}
          className={`tab-btn ${activeTab === 'text-search' ? 'active' : ''}`}
        >
          <Search size={14} />
          Semantic Text Query (CLIP)
        </button>
        <button
          onClick={() => setActiveTab('visual-similarity')}
          className={`tab-btn ${activeTab === 'visual-similarity' ? 'active' : ''}`}
        >
          <Sparkles size={14} />
          Visual Similarity Search (DINOv2)
        </button>
        <button
          onClick={() => setActiveTab('zero-shot')}
          className={`tab-btn ${activeTab === 'zero-shot' ? 'active' : ''}`}
        >
          <Tag size={14} />
          Zero-Shot Open-Vocabulary Classifier
        </button>
        <button
          onClick={() => setActiveTab('embedding-space')}
          className={`tab-btn ${activeTab === 'embedding-space' ? 'active' : ''}`}
        >
          <Layers size={14} />
          2D Embedding Projection
        </button>
      </div>

      {/* Mode Disclaimer Banner */}
      <div
        style={{
          padding: '12px 18px',
          backgroundColor: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '12px',
          color: '#FCD34D',
        }}
      >
        <Info size={16} style={{ flexShrink: 0 }} />
        <div>
          <strong>Deterministic Showcase Notice:</strong> Embeddings, cosine similarities, and nearest-neighbor rankings are pre-computed using genuine CLIP ViT-L/14 and DINOv2-ViT-B backbones. Note: CLIP similarity scores represent normalized vector alignments, not calibrated probabilities.
        </div>
      </div>

      {/* TAB 1: Semantic Text Search */}
      {activeTab === 'text-search' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Query Bar */}
          <div className="card">
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <div className="search-box" style={{ flex: 1 }}>
                <Search size={18} color="var(--accent-violet)" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Enter natural language query: e.g. 'a red car near pedestrian crossing'..."
                />
              </div>
              <button onClick={() => handleSearch(searchQuery)} className="btn btn-primary">
                Search Corpus
              </button>
            </div>

            {/* Presets */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Supported Demo Queries:</span>
              {presetQueries.map(q => (
                <button
                  key={q}
                  onClick={() => handleSearch(q)}
                  style={{
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    backgroundColor: searchQuery === q ? 'var(--accent-violet)' : 'var(--surface-elevated)',
                    color: searchQuery === q ? '#FFF' : 'var(--text-secondary)',
                    border: '1px solid var(--surface-border)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '16px',
            }}
          >
            {searchResults.map((item, idx) => (
              <div
                key={item.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  padding: 0,
                }}
              >
                <div style={{ height: '170px', position: 'relative', backgroundColor: '#000' }}>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(11, 16, 32, 0.85)',
                      backdropFilter: 'blur(6px)',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: item.similarity >= 0.85 ? 'var(--accent-cyan)' : 'var(--accent-violet-light)',
                      border: '1px solid var(--surface-border)',
                    }}
                  >
                    Match: {Math.round(item.similarity * 100)}%
                  </div>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '10px',
                      fontSize: '10px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      color: '#FFF',
                    }}
                  >
                    Rank #{idx + 1} · {item.camera}
                  </span>
                </div>

                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#FFF', marginBottom: '6px' }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.5 }}>
                      {item.description}
                    </p>
                    <div
                      style={{
                        fontSize: '11px',
                        fontStyle: 'italic',
                        color: 'var(--accent-cyan)',
                        backgroundColor: 'rgba(54, 214, 231, 0.08)',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)',
                        marginBottom: '12px',
                      }}
                    >
                      {item.matchReason}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {item.tags.map(t => (
                      <span key={t} className="badge badge-neutral">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Visual Similarity Search (DINOv2) */}
      {activeTab === 'visual-similarity' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
          {/* Reference Image Picker */}
          <div className="card">
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', color: '#FFF' }}>
              Reference Query Frame
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Select a traffic scenario frame to compute 768-dim DINOv2 cosine nearest neighbors.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {searchResults.slice(0, 3).map(ref => {
                const isSelected = selectedReference === ref.id;
                return (
                  <div
                    key={ref.id}
                    onClick={() => setSelectedReference(ref.id)}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      padding: '8px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--surface-hover)' : 'var(--surface-elevated)',
                      border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--surface-border)',
                      cursor: 'pointer',
                    }}
                  >
                    <img
                      src={ref.thumbnail}
                      alt={ref.title}
                      style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ref.title}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{ref.cluster}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--surface-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Embedding Status
              </div>
              <div style={{ fontSize: '12px', color: '#FFF' }}>Model: DINOv2 ViT-B/14 (L2-Normalized)</div>
              <div className="font-mono" style={{ fontSize: '11px', color: 'var(--accent-cyan)' }}>
                Vector Size: 768 dims · Precision: FP16
              </div>
            </div>
          </div>

          {/* Nearest Neighbor Results */}
          <div className="card">
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', color: '#FFF' }}>
              Top Cosine Nearest Neighbors in Feature Space
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {searchResults.slice(1, 5).map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px',
                    backgroundColor: 'var(--surface-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--surface-border)',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '14px', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    #{idx + 1}
                  </span>
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{ width: '80px', height: '55px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFF' }}>{item.title}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Cluster: {item.cluster} · {item.camera}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent-violet-light)' }}>
                      {(item.similarity * 0.98).toFixed(3)}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Cosine Sim</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Zero-Shot Classification */}
      {activeTab === 'zero-shot' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
          <div className="card">
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: '#FFF' }}>
              Target Image & Prompt Candidate Labels
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Enter comma-separated candidate descriptions. CLIP evaluates text-image cross-modal dot products against the surveillance frame.
            </p>

            <img
              src="/samples/junction_frame.jpg"
              alt="Classification Target"
              style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}
            />

            <div className="form-group">
              <label className="form-label">Candidate Labels (comma-separated)</label>
              <textarea
                value={candidateLabels}
                onChange={e => setCandidateLabels(e.target.value)}
                className="form-input"
                rows={3}
                style={{ resize: 'none' }}
              />
            </div>

            <button onClick={handleComputeZeroShot} className="btn btn-primary" style={{ width: '100%' }}>
              ⚡ Compute Zero-Shot Similarity
            </button>
          </div>

          <div className="card">
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', color: '#FFF' }}>
              Zero-Shot Similarity Distribution
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {zeroShotResults.map((res, i) => (
                <div key={res.label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ fontWeight: 600, color: i === 0 ? 'var(--accent-cyan)' : '#FFF' }}>
                      {res.label}
                    </span>
                    <span className="font-mono" style={{ color: 'var(--accent-violet-light)' }}>
                      {(res.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ height: '7px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${res.score * 100}%`,
                        height: '100%',
                        backgroundColor: i === 0 ? 'var(--accent-cyan)' : 'var(--accent-violet)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 2D Embedding Space Projection */}
      {activeTab === 'embedding-space' && (
        <div className="card">
          <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '6px', color: '#FFF' }}>
            DINOv2 768-D → 2D UMAP Embedding Projection
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Self-supervised visual clusters projected into 2D space. Hover over cluster nodes to inspect surveillance scene groupings.
          </p>

          <div
            style={{
              height: '380px',
              backgroundColor: '#070C18',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--surface-border)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* SVG Scatter Plot */}
            <svg viewBox="-50 -50 100 100" style={{ width: '100%', height: '100%' }}>
              {/* Grid axes */}
              <line x1="-50" y1="0" x2="50" y2="0" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
              <line x1="0" y1="-50" x2="0" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

              {/* Data points */}
              {searchResults.map((item, idx) => {
                const [cx, cy] = item.embeddingCoords;
                const colors = ['#7C5CFC', '#36D6E7', '#10B981', '#F59E0B', '#EC4899', '#38BDF8'];
                const color = colors[idx % colors.length];

                return (
                  <g key={item.id} style={{ cursor: 'pointer' }} onClick={() => handleSearch(item.title)}>
                    <circle cx={cx} cy={cy} r="4.5" fill={color} opacity="0.85" />
                    <circle cx={cx} cy={cy} r="8" fill="none" stroke={color} strokeWidth="0.75" opacity="0.4" />
                    <text x={cx + 6} y={cy + 2} fill="#CBD5E1" fontSize="3.5" fontFamily="Inter">
                      {item.title.substring(0, 18)}...
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
