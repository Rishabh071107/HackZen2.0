export type WorkspaceId =
  | 'overview'
  | 'live-traffic'
  | 'detection'
  | 'visual-search'
  | 'segmentation'
  | 'tracking'
  | 'restoration'
  | 'robustness'
  | 'evaluation'
  | 'experiments'
  | 'models'
  | 'settings';

export interface DatasetVideo {
  id: string;
  title: string;
  filename: string;
  resolution: string;
  duration_seconds: number;
  formatted_duration: string;
  size_mb: number;
  thumbnail_path: string;
  video_url: string;
}

export interface DetectionBox {
  bbox: [number, number, number, number]; // [x1, y1, x2, y2]
  confidence: number;
  class_id: number;
  class_name: string;
}

export interface Incident {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  location: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  confidence: number;
  status: 'investigating' | 'confirmed' | 'resolved';
  thumbnail: string;
  description: string;
  tags: string[];
  camera: string;
  speedEstimateKmh?: number;
  lane?: string;
}

export interface SAMPoint {
  x: number;
  y: number;
  type: 'positive' | 'negative';
}

export interface SAMBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface VisualSearchItem {
  id: string;
  title: string;
  similarity: number;
  thumbnail: string;
  description: string;
  timestamp: string;
  camera: string;
  tags: string[];
  matchReason: string;
  cluster: string;
  embeddingCoords: [number, number]; // 2D projection for UMAP/t-SNE
}

export interface TrajectoryPoint {
  frame: number;
  x: number;
  y: number;
  speedKmh: number;
}

export interface TrackItem {
  id: number;
  className: string;
  color: string;
  trajectory: TrajectoryPoint[];
  status: 'active' | 'exited';
  avgSpeed: number;
  entryTime: string;
  durationSeconds: number;
  idSwitches: number;
}

export interface ExperimentRecord {
  id: string;
  name: string;
  modelFamily: string;
  dataset: string;
  primaryMetric: string;
  score: number;
  status: 'completed' | 'running' | 'queued';
  date: string;
  parameters: Record<string, string | number>;
  insights: string;
  lossHistory: number[];
}

export interface ModelEntry {
  id: string;
  name: string;
  family: string;
  version: string;
  task: string;
  runtime: string;
  status: 'Active (Primary)' | 'Ready' | 'Evaluation' | 'Staged';
  hardware: string;
  latencyMs: number;
  paramsMillion: number;
  onnxReady: boolean;
  quantized: 'FP32' | 'FP16' | 'INT8';
  distilReady: boolean;
  endpoint: string;
  inputShape: string;
  deploymentReadiness: number; // 0 to 100%
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'success';
  timestamp: string;
  read: boolean;
}
