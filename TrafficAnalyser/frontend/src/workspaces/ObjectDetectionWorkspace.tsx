import React, { useState, useEffect } from 'react';
import {
  Upload,
  Scan,
  Download,
  Filter,
  Eye,
  Sliders,
  CheckCircle2,
  Clock,
  Zap,
  Layers,
} from 'lucide-react';
import { DetectionBox } from '../types';
import { runDetection, exportToCSV, exportToJSON } from '../services/api';

export const ObjectDetectionWorkspace: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string>('highway_frame.jpg');
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
  const [selectedDetector, setSelectedDetector] = useState<string>('yolov8n-traffic');
  const [confThresh, setConfThresh] = useState<number>(0.25);
  const [showDetections, setShowDetections] = useState<boolean>(true);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<{
    detections: DetectionBox[];
    latencyMs: number;
    imageWidth: number;
    imageHeight: number;
    isSimulated: boolean;
  }>({
    detections: [],
    latencyMs: 8.4,
    imageWidth: 1920,
    imageHeight: 1080,
    isSimulated: false,
  });

  const availableClasses = ['car', 'truck', 'bus', 'motorcycle', 'bicycle', 'pedestrian'];

  const sampleImages = [
    { id: 'highway_frame.jpg', label: 'Highway Corridor (1080p)', src: '/samples/highway_frame.jpg' },
    { id: 'junction_frame.jpg', label: 'Metropolitan Junction (1080p)', src: '/samples/junction_frame.jpg' },
    { id: 'traffic_frame.jpg', label: 'Arterial Interchange (720p)', src: '/samples/traffic_frame.jpg' },
  ];

  const handleRunInference = async () => {
    setLoading(true);
    const res = await runDetection(selectedImage, confThresh, selectedClasses);
    setResults(res);
    setLoading(false);
  };

  useEffect(() => {
    handleRunInference();
  }, [selectedImage, confThresh, selectedDetector, selectedClasses]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setCustomImageSrc(ev.target.result as string);
          setSelectedImage('custom_upload');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const currentImageSrc =
    selectedImage === 'custom_upload' && customImageSrc
      ? customImageSrc
      : sampleImages.find(s => s.id === selectedImage)?.src || '/samples/highway_frame.jpg';

  // Count by class
  const classCounts = results.detections.reduce((acc, d) => {
    acc[d.class_name] = (acc[d.class_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="workspace-header">
        <div className="workspace-title-group">
          <h1>
            <span>Object Detection Studio</span>
            <span className={`badge ${results.isSimulated ? 'badge-simulated' : 'badge-real'}`}>
              {results.isSimulated ? 'Simulated Model' : 'Real Model Weights (best.pt)'}
            </span>
          </h1>
          <p className="workspace-description">
            Multi-class vehicle & road user bounding box localization with confidence thresholding, NMS suppression, and export.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => exportToCSV('detections_export', results.detections)}
            className="btn btn-secondary btn-sm"
          >
            <Download size={14} />
            Export CSV
          </button>
          <button
            onClick={() => exportToJSON('detections_export', results)}
            className="btn btn-secondary btn-sm"
          >
            <Download size={14} />
            Export JSON
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' }}>
        {/* Left: Interactive Canvas & Viewer */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Top Bar inside Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFF' }}>
                Frame Visualization
              </span>
              <span className="badge badge-neutral">
                {results.detections.length} objects detected
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setShowDetections(!showDetections)}
                className={`btn btn-sm ${showDetections ? 'btn-primary' : 'btn-secondary'}`}
              >
                <Eye size={13} />
                {showDetections ? 'Hide BBoxes' : 'Show BBoxes'}
              </button>
            </div>
          </div>

          {/* Canvas Box */}
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
              src={currentImageSrc}
              alt="Detection Target"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {/* Render Bounding Boxes */}
            {showDetections && (
              <svg
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
                viewBox={`0 0 ${results.imageWidth} ${results.imageHeight}`}
              >
                {results.detections.map((det, idx) => {
                  const [x1, y1, x2, y2] = det.bbox;
                  const w = x2 - x1;
                  const h = y2 - y1;
                  const color =
                    det.class_name === 'car'
                      ? '#7C5CFC'
                      : det.class_name === 'truck'
                      ? '#36D6E7'
                      : det.class_name === 'bus'
                      ? '#10B981'
                      : det.class_name === 'motorcycle'
                      ? '#F59E0B'
                      : '#EC4899';

                  return (
                    <g key={idx}>
                      <rect
                        x={x1}
                        y={y1}
                        width={w}
                        height={h}
                        fill={`${color}22`}
                        stroke={color}
                        strokeWidth="3.5"
                        rx="5"
                      />
                      <rect
                        x={x1}
                        y={Math.max(0, y1 - 32)}
                        width={Math.max(120, det.class_name.length * 14 + 75)}
                        height="32"
                        fill={color}
                        rx="4"
                      />
                      <text
                        x={x1 + 8}
                        y={Math.max(0, y1 - 32) + 21}
                        fill="#FFFFFF"
                        fontSize="18"
                        fontFamily="JetBrains Mono"
                        fontWeight="700"
                      >
                        {det.class_name.toUpperCase()} {Math.round(det.confidence * 100)}%
                      </text>
                    </g>
                  );
                })}
              </svg>
            )}

            {/* Inference Telemetry Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                padding: '6px 12px',
                background: 'rgba(11, 16, 32, 0.85)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--surface-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <Zap size={13} color="var(--accent-cyan)" />
              <span style={{ color: '#FFF' }}>Inference: {results.latencyMs} ms</span>
              <span style={{ color: 'var(--text-muted)' }}>·</span>
              <span style={{ color: 'var(--text-secondary)' }}>
                Resolution: {results.imageWidth}x{results.imageHeight}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls & Class Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Source Image Selector & Upload */}
          <div className="card">
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#FFF' }}>
              Input Source Frame
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
              {sampleImages.map(img => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border:
                      selectedImage === img.id
                        ? '1px solid var(--accent-violet)'
                        : '1px solid var(--surface-border)',
                    backgroundColor:
                      selectedImage === img.id ? 'var(--surface-hover)' : 'var(--surface-elevated)',
                    color: selectedImage === img.id ? '#FFF' : 'var(--text-secondary)',
                    textAlign: 'left',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{img.label}</span>
                  {selectedImage === img.id && <CheckCircle2 size={14} color="var(--accent-cyan)" />}
                </button>
              ))}
            </div>

            {/* Upload Custom File */}
            <label
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', cursor: 'pointer', justifyContent: 'center' }}
            >
              <Upload size={14} />
              Upload Custom Image
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Detector Model Selector */}
          <div className="card">
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px', color: '#FFF' }}>
              Detector Architecture
            </div>
            <select
              value={selectedDetector}
              onChange={e => setSelectedDetector(e.target.value)}
              className="form-select"
            >
              <option value="yolov8n-traffic">YOLOv8n-Traffic Core (8.4ms · Real Weights)</option>
              <option value="yolo11x">YOLO11x High-Accuracy Ensemble (32ms · Simulated)</option>
              <option value="vit-det">ViT-Det Vision Transformer (44ms · Simulated)</option>
            </select>
          </div>

          {/* Calibration Slider */}
          <div className="card">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <div className="form-label">
                <span>Confidence Threshold</span>
                <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>
                  {confThresh.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                className="form-range"
                min="0.10"
                max="0.90"
                step="0.05"
                value={confThresh}
                onChange={e => setConfThresh(parseFloat(e.target.value))}
              />
            </div>
          </div>

          {/* Detected Objects Count by Class */}
          <div className="card">
            <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px', color: '#FFF' }}>
              Class Counts in Current Frame
            </div>
            {Object.keys(classCounts).length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                No objects above current confidence threshold.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(classCounts).map(([cls, cnt]) => (
                  <div
                    key={cls}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--surface-elevated)',
                      fontSize: '12px',
                    }}
                  >
                    <span style={{ textTransform: 'capitalize', color: '#FFF' }}>{cls}</span>
                    <span className="badge badge-violet font-mono">{cnt} detected</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
