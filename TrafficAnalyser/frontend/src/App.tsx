import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { IncidentDetailModal } from './components/IncidentDetailModal';

// Workspaces
import { OverviewWorkspace } from './workspaces/OverviewWorkspace';
import { LiveTrafficWorkspace } from './workspaces/LiveTrafficWorkspace';
import { ObjectDetectionWorkspace } from './workspaces/ObjectDetectionWorkspace';
import { VisualSearchWorkspace } from './workspaces/VisualSearchWorkspace';
import { SegmentationLabWorkspace } from './workspaces/SegmentationLabWorkspace';
import { TrackingStudioWorkspace } from './workspaces/TrackingStudioWorkspace';
import { RestorationStudioWorkspace } from './workspaces/RestorationStudioWorkspace';
import { RobustnessLabWorkspace } from './workspaces/RobustnessLabWorkspace';
import { ModelEvaluationWorkspace } from './workspaces/ModelEvaluationWorkspace';
import { ExperimentsWorkspace } from './workspaces/ExperimentsWorkspace';
import { ModelsWorkspace } from './workspaces/ModelsWorkspace';
import { SettingsWorkspace } from './workspaces/SettingsWorkspace';

// Types & Data
import { WorkspaceId, DatasetVideo, Incident, NotificationItem } from './types';
import { initialDatasets, initialIncidents, initialNotifications } from './data/mockData';
import { checkBackendHealth, fetchDatasetVideos } from './services/api';

export function App() {
  const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceId>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Global Datasets & Feeds
  const [datasets, setDatasets] = useState<DatasetVideo[]>(initialDatasets);
  const [selectedDataset, setSelectedDataset] = useState<DatasetVideo>(initialDatasets[0]);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Incidents & Notifications
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  // Initial Backend Health & Dataset Ingestion Check
  const refreshBackendStatus = async () => {
    try {
      const health = await checkBackendHealth();
      setBackendOnline(health.online);
      const remoteVideos = await fetchDatasetVideos();
      if (remoteVideos && remoteVideos.length > 0) {
        setDatasets(remoteVideos);
      }
    } catch {
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    refreshBackendStatus();

    // Global keyboard shortcut: Ctrl+K or Cmd+K opens Quick Search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectWorkspace = (id: WorkspaceId) => {
    setCurrentWorkspace(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectIncident = (inc: Incident) => {
    setSelectedIncident(inc);
  };

  const handleUpdateIncidentStatus = (id: string, status: 'investigating' | 'confirmed' | 'resolved') => {
    setIncidents(prev =>
      prev.map(i => (i.id === id ? { ...i, status } : i))
    );
    if (selectedIncident && selectedIncident.id === id) {
      setSelectedIncident(prev => (prev ? { ...prev, status } : null));
    }
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="app-container">
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar
        currentWorkspace={currentWorkspace}
        onSelectWorkspace={handleSelectWorkspace}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        backendOnline={backendOnline}
      />

      {/* Main Content Layout */}
      <div className={`main-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Sticky Top Header Navigation */}
        <TopNav
          onOpenSearch={() => setIsSearchOpen(true)}
          datasets={datasets}
          selectedDataset={selectedDataset}
          onSelectDataset={setSelectedDataset}
          isDemoMode={isDemoMode}
          onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onSelectWorkspace={handleSelectWorkspace}
          backendOnline={backendOnline}
        />

        {/* Dynamic Workspace Container */}
        <main className="workspace-content">
          {currentWorkspace === 'overview' && (
            <OverviewWorkspace
              onSelectWorkspace={handleSelectWorkspace}
              onSelectIncident={handleSelectIncident}
              incidents={incidents}
              selectedDataset={selectedDataset}
            />
          )}

          {currentWorkspace === 'live-traffic' && (
            <LiveTrafficWorkspace
              datasets={datasets}
              selectedDataset={selectedDataset}
              onSelectDataset={setSelectedDataset}
              backendOnline={backendOnline}
            />
          )}

          {currentWorkspace === 'detection' && <ObjectDetectionWorkspace />}

          {currentWorkspace === 'visual-search' && <VisualSearchWorkspace />}

          {currentWorkspace === 'segmentation' && <SegmentationLabWorkspace />}

          {currentWorkspace === 'tracking' && <TrackingStudioWorkspace />}

          {currentWorkspace === 'restoration' && <RestorationStudioWorkspace />}

          {currentWorkspace === 'robustness' && <RobustnessLabWorkspace />}

          {currentWorkspace === 'evaluation' && <ModelEvaluationWorkspace />}

          {currentWorkspace === 'experiments' && <ExperimentsWorkspace />}

          {currentWorkspace === 'models' && <ModelsWorkspace />}

          {currentWorkspace === 'settings' && (
            <SettingsWorkspace
              backendOnline={backendOnline}
              onRefreshBackend={refreshBackendStatus}
            />
          )}
        </main>
      </div>

      {/* Global Command Palette / Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectWorkspace={handleSelectWorkspace}
        onSelectIncident={handleSelectIncident}
        incidents={incidents}
      />

      {/* Incident Detail Modal */}
      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onNavigateToWorkspace={handleSelectWorkspace}
        onUpdateStatus={handleUpdateIncidentStatus}
      />
    </div>
  );
}

export default App;
