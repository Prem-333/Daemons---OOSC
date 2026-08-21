import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardView } from './views/DashboardView';
import { RegistryView } from './views/RegistryView';
import { ScenarioGeneratorView } from './views/ScenarioGeneratorView';
import { FailureTaxonomyView } from './views/FailureTaxonomyView';
import { GuardrailTesterView } from './views/GuardrailTesterView';
import { RegressionTrackerView } from './views/RegressionTrackerView';
import { SettingsView } from './views/SettingsView';
import { ReplayViewerView } from './views/ReplayViewerView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardView />} />
        <Route path="/registry" element={<RegistryView />} />
        <Route path="/scenario-generator" element={<ScenarioGeneratorView />} />
        <Route path="/replay-viewer" element={<ReplayViewerView />} />
        <Route path="/failure-taxonomy" element={<FailureTaxonomyView />} />
        <Route path="/guardrail-tester" element={<GuardrailTesterView />} />
        <Route path="/regression-tracker" element={<RegressionTrackerView />} />
        <Route path="/settings" element={<SettingsView />} />
      </Routes>
    </Router>
  );
}

export default App;
