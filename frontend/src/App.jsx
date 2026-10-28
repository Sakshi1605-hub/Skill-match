import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Module Pages
import Dashboard from './pages/Dashboard';
import JDAnalytics from './pages/JDAnalytics';
import ResumeParsing from './pages/ResumeParsing';
import ProfileBuilder from './pages/ProfileBuilder';
import TalentCheck from './pages/TalentCheck';
import SkillSightAI from './pages/SkillSightAI';
import JobDirectory from './pages/JobDirectory';
import CandidateComparison from './pages/CandidateComparison';
import AnalyticsReports from './pages/AnalyticsReports';

function SettingsPage() {
  return (
    <div className="flex flex-col w-full pb-16 space-y-6">
      <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Platform Settings &amp; Weights</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Configure engine parameters, default scoring coefficient ratios, and database connections.
        </p>
      </div>
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm space-y-4 max-w-xl">
        <h2 className="font-headline-md text-headline-md text-on-surface">Default Scoring Weights</h2>
        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
          <span className="font-label-md font-semibold text-on-surface">Required Skills Weight:</span>
          <span className="font-code-metric text-secondary font-bold">70% (0.70)</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
          <span className="font-label-md font-semibold text-on-surface">Preferred Skills Weight:</span>
          <span className="font-code-metric text-secondary font-bold">30% (0.30)</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
          <span className="font-label-md font-semibold text-on-surface">Database Layer:</span>
          <span className="font-code-metric text-on-surface font-semibold">SQLite (Modular / Supabase Ready)</span>
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low">
          <span className="font-label-md font-semibold text-on-surface">Deterministic Engine:</span>
          <span className="font-code-metric text-[#065F46] font-semibold">SkillSight M-05 Verified</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <Router>
      <Layout onSearch={(q) => setGlobalSearch(q)} currentSearch={globalSearch}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jd-analytics" element={<JDAnalytics />} />
          <Route path="/resume-parsing" element={<ResumeParsing />} />
          <Route path="/profile-builder" element={<ProfileBuilder />} />
          <Route path="/talent-check" element={<TalentCheck />} />
          <Route path="/skillsight-ai" element={<SkillSightAI />} />
          <Route path="/jobs" element={<JobDirectory />} />
          <Route path="/candidate-comparison" element={<CandidateComparison />} />
          <Route path="/analytics" element={<AnalyticsReports />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
