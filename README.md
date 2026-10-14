# HackZen 2.0 — Intelligent Traffic Analysis & Visual Intelligence Platform

An end-to-end intelligent traffic monitoring, vehicle tracking, incident detection, and multi-workspace visual AI platform.

## Architecture & Subsystems
- **TrafficAnalyser**: Core computer vision, tracking, and video processing engine.
  - **Computer Vision Core**: YOLO11 object detection, DeepSORT multi-object tracking, speed estimation, congestion analysis.
  - **Interactive Labs**: Robustness Lab, Tracking Studio, Segmentation Lab, Visual Search, and Detection Workspace.
  - **Frontend UI**: High-performance dashboard built with Vite, React, TypeScript, and modern data visualization.
  - **Backend API**: Flask / Python backend powering video inference, telemetry, and analytics.

## Quick Start

### 1. Backend / Video Processing
```bash
cd TrafficAnalyser
pip install -r requirements.txt
python run_app.py
```

### 2. Frontend Dashboard
```bash
cd TrafficAnalyser/frontend
npm install
npm run dev
```
