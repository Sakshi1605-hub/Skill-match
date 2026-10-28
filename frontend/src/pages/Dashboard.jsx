import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardStats } from '../api/client';
import ScoreRing from '../components/common/ScoreRing';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stackFilter, setStackFilter] = useState('all');

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Command Hub Header */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-margin shadow-sm mb-space-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-lg">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm flex-wrap">
              <span className="font-label-sm text-label-sm tracking-wider uppercase px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-code-metric">
                SYS-TELEMETRY
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-code-metric text-label-sm">
                  {stats?.active_model_version || 'SkillSight Model v4.2 Active'}
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-outline">
                Cluster US-EAST • Latency {stats?.system_latency_ms || 38}ms
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">
              Talent Intelligence Hub — Enterprise Overview
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Deterministic semantic matching, automated job description extraction, and high-fidelity workforce calibration across active requisitions.
            </p>
          </div>
          <div className="flex items-center gap-space-sm flex-wrap">
            <button
              onClick={() => navigate('/skillsight-ai')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md"
              type="button"
            >
              <span className="material-symbols-outlined text-base">layers</span>
              <span>Batch Run Matches</span>
            </button>
            <button
              onClick={() => navigate('/jd-analytics')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md"
              type="button"
            >
              <span className="material-symbols-outlined text-base">upload_file</span>
              <span>Upload JD</span>
            </button>
            <button
              onClick={() => navigate('/profile-builder')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-inverse-surface transition-colors font-label-md text-label-md shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              <span>+ Add Candidate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Backend Status Alert if offline */}
      {error && (
        <div className="mb-space-xl p-space-md rounded-xl bg-error-container text-on-error-container flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">warning</span>
            <span className="font-body-md font-medium">{error}</span>
          </div>
          <button
            onClick={loadStats}
            className="px-3 py-1 rounded bg-error text-on-error font-label-sm"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Metric KPI Cards (4 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-space-xl">
        {/* Card 1 */}
        <div className="flex flex-col justify-between p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
              Total JDs Analyzed
            </span>
            <span className="material-symbols-outlined text-outline text-lg">description</span>
          </div>
          <div className="my-space-md flex items-baseline justify-between">
            <span className="font-headline-xl text-headline-xl text-on-surface font-code-score tracking-tight">
              {stats?.total_jds_analyzed?.toLocaleString() || '1,248'}
            </span>
            <div className="flex items-center gap-1 text-tertiary-container bg-surface-container-highest px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              <span className="font-code-metric text-label-sm">+18.4%</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-outline font-body-sm text-body-sm">
            <span>MoM pipeline depth</span>
            <svg className="w-20 h-5 text-secondary" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 100 24">
              <path d="M0,18 Q15,20 30,12 T60,10 T80,4 T100,2"></path>
            </svg>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col justify-between p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
              Resumes Processed
            </span>
            <span className="material-symbols-outlined text-outline text-lg">document_scanner</span>
          </div>
          <div className="my-space-md flex items-baseline justify-between">
            <span className="font-headline-xl text-headline-xl text-on-surface font-code-score tracking-tight">
              {stats?.resumes_processed?.toLocaleString() || '14,890'}
            </span>
            <span className="font-code-metric text-label-sm text-on-surface bg-surface-container px-2 py-0.5 rounded">
              99.2% Conf.
            </span>
          </div>
          <div className="flex items-center justify-between text-outline font-body-sm text-body-sm">
            <span>Parsing error rate &lt; 0.1%</span>
            <svg className="w-20 h-5 text-secondary" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 100 24">
              <path d="M0,20 Q20,15 40,16 T70,8 T100,5"></path>
            </svg>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col justify-between p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
              Candidates Evaluated
            </span>
            <span className="material-symbols-outlined text-outline text-lg">analytics</span>
          </div>
          <div className="my-space-md flex items-baseline justify-between">
            <span className="font-headline-xl text-headline-xl text-on-surface font-code-score tracking-tight">
              {stats?.candidates_evaluated?.toLocaleString() || '8,420'}
            </span>
            <span className="font-code-metric text-label-sm text-secondary bg-surface-container px-2 py-0.5 rounded">
              Avg 68.4%
            </span>
          </div>
          <div className="flex items-center justify-between text-outline font-body-sm text-body-sm">
            <span>Active candidate registry</span>
            <svg className="w-20 h-5 text-secondary" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 100 24">
              <path d="M0,14 Q25,22 50,11 T75,9 T100,3"></path>
            </svg>
          </div>
        </div>

        {/* Card 4 */}
        <div className="flex flex-col justify-between p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
              High-Fit Shortlists
            </span>
            <span className="material-symbols-outlined text-outline text-lg">verified</span>
          </div>
          <div className="my-space-md flex items-baseline justify-between">
            <span className="font-headline-xl text-headline-xl text-on-surface font-code-score tracking-tight">
              {stats?.high_fit_shortlists?.toLocaleString() || '612'}
            </span>
            <div className="flex items-center gap-1 text-tertiary-container bg-surface-container-highest px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-xs">thumb_up</span>
              <span className="font-code-metric text-label-sm">94% Rec. Rate</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-outline font-body-sm text-body-sm">
            <span>Interview conversion 71%</span>
            <svg className="w-20 h-5 text-secondary" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 100 24">
              <path d="M0,16 Q20,10 45,14 T80,4 T100,1"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Module Pipeline Status Cards (5 Horizontal Module Trackers) */}
      <div className="flex flex-col gap-space-sm mb-space-xl">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-space-xs">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Engine Telemetry</span>
            <span className="font-code-metric text-label-sm text-on-surface-variant font-semibold">• Modules M01 - M05</span>
          </div>
          <span 
            onClick={() => navigate('/skillsight-ai')}
            className="font-label-sm text-label-sm text-secondary hover:underline cursor-pointer"
          >
            Re-calibrate Weights
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
          {/* M1 Card */}
          <div 
            onClick={() => navigate('/jd-analytics')}
            className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-code-metric text-label-sm text-outline">M-01</span>
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
            </div>
            <div className="font-headline-sm text-headline-sm text-on-surface">JD Analytics</div>
            <div className="mt-space-md flex flex-col gap-0.5">
              <span className="font-code-score text-body-md text-on-surface font-semibold">1,248 analyzed</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">98.4% skill extraction</span>
            </div>
          </div>

          {/* M2 Card */}
          <div 
            onClick={() => navigate('/resume-parsing')}
            className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-code-metric text-label-sm text-outline">M-02</span>
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
            </div>
            <div className="font-headline-sm text-headline-sm text-on-surface">Resume Parsing</div>
            <div className="mt-space-md flex flex-col gap-0.5">
              <span className="font-code-score text-body-md text-on-surface font-semibold">Live Parser</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Avg 1.2s parse speed</span>
            </div>
          </div>

          {/* M3 Card */}
          <div 
            onClick={() => navigate('/profile-builder')}
            className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-code-metric text-label-sm text-outline">M-03</span>
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
            </div>
            <div className="font-headline-sm text-headline-sm text-on-surface">Profile Builder</div>
            <div className="mt-space-md flex flex-col gap-0.5">
              <span className="font-code-score text-body-md text-on-surface font-semibold">Candidate Hub</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">100% vector indexed</span>
            </div>
          </div>

          {/* M4 Card */}
          <div 
            onClick={() => navigate('/talent-check')}
            className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-code-metric text-label-sm text-outline">M-04</span>
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
            </div>
            <div className="font-headline-sm text-headline-sm text-on-surface">Talent Check</div>
            <div className="mt-space-md flex flex-col gap-0.5">
              <span className="font-code-score text-body-md text-on-surface font-semibold">94.2% pass rate</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Eligibility &amp; background</span>
            </div>
          </div>

          {/* M5 Flagship Card */}
          <div 
            onClick={() => navigate('/skillsight-ai')}
            className="relative p-space-md rounded-xl bg-primary-container text-on-secondary shadow-md flex flex-col justify-between overflow-hidden cursor-pointer"
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-secondary/30 blur-xl pointer-events-none"></div>
            <div className="flex items-center justify-between mb-space-xs relative z-10">
              <span className="font-code-metric text-label-sm text-tertiary-fixed-dim">M-05 • FLAGSHIP</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
            </div>
            <div className="font-headline-sm text-headline-sm text-surface relative z-10">SkillSight AI</div>
            <div className="mt-space-md flex flex-col gap-0.5 relative z-10">
              <span className="font-code-score text-body-md text-surface font-semibold">312 simulations</span>
              <span className="font-label-sm text-label-sm text-primary-fixed-dim">Deterministic engine active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Analytics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg">
        {/* Left Column: 8 Cols */}
        <div className="lg:col-span-8 flex flex-col gap-gutter-lg">
          {/* Match Overview & Skill Distribution Visual Card */}
          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-space-md gap-space-sm">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Candidate Match Overview &amp; Skill Distribution</h2>
                <p className="font-body-sm text-body-sm text-outline">Semantic vector proximity across target skill clusters</p>
              </div>
              <div className="flex items-center gap-space-xs bg-surface-container p-1 rounded-lg">
                <button
                  onClick={() => setStackFilter('all')}
                  className={`px-2.5 py-1 text-label-sm font-label-sm rounded transition-colors ${
                    stackFilter === 'all'
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  All Stacks
                </button>
                <button
                  onClick={() => setStackFilter('senior')}
                  className={`px-2.5 py-1 text-label-sm font-label-sm rounded transition-colors ${
                    stackFilter === 'senior'
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  Senior (L5+)
                </button>
                <button
                  onClick={() => setStackFilter('mid')}
                  className={`px-2.5 py-1 text-label-sm font-label-sm rounded transition-colors ${
                    stackFilter === 'mid'
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                      : 'text-outline hover:text-on-surface'
                  }`}
                >
                  Mid (L3-L4)
                </button>
              </div>
            </div>

            {/* Tech Stack Bars & Heat Visual */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md py-space-md">
              {(stats?.tech_stacks || [
                { name: 'Python / Data', count: 3420, affinity: 82 },
                { name: 'Cloud / Infra', count: 2110, affinity: 74 },
                { name: 'Frontend / UI', count: 1890, affinity: 68 },
                { name: 'AI / ML Eng', count: 980, affinity: 91 },
              ]).map((stack, i) => (
                <div key={i} className="p-space-md rounded-lg bg-surface-container-low flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md font-semibold text-on-surface">{stack.name}</span>
                    <span className="font-code-metric text-label-sm text-secondary">{stack.count}</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-1.5 my-space-sm">
                    <div className="bg-secondary h-1.5 rounded-full" style={{ width: `${stack.affinity}%` }}></div>
                  </div>
                  <span className="font-label-sm text-label-sm text-outline">{stack.affinity}% Match Affinity</span>
                </div>
              ))}
            </div>

            {/* SVG Distribution Area / Line Graph */}
            <div className="mt-space-md pt-space-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                  Cluster Variance Calibration
                </span>
                <span className="font-code-metric text-label-sm text-on-surface-variant">p95 fit confidence: 0.892</span>
              </div>
              <svg className="w-full h-28" preserveAspectRatio="none" viewBox="0 0 600 110">
                <line className="text-surface-container" stroke="currentColor" strokeDasharray="4 4" x1="0" x2="600" y1="20" y2="20"></line>
                <line className="text-surface-container" stroke="currentColor" strokeDasharray="4 4" x1="0" x2="600" y1="55" y2="55"></line>
                <line className="text-surface-container" stroke="currentColor" strokeDasharray="4 4" x1="0" x2="600" y1="90" y2="90"></line>
                <path className="text-secondary/10" d="M0,85 C60,80 120,40 180,45 C240,50 300,20 360,25 C420,30 480,10 540,15 L600,10 L600,110 L0,110 Z" fill="currentColor"></path>
                <path className="text-secondary" d="M0,85 C60,80 120,40 180,45 C240,50 300,20 360,25 C420,30 480,10 540,15 L600,10" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                <circle className="text-secondary" cx="180" cy="45" fill="currentColor" r="4"></circle>
                <circle className="text-secondary" cx="360" cy="25" fill="currentColor" r="4"></circle>
                <circle className="text-secondary" cx="540" cy="15" fill="currentColor" r="4"></circle>
              </svg>
              <div className="flex justify-between font-code-metric text-label-sm text-outline mt-1 px-1">
                <span>Jan 01</span>
                <span>Jan 10</span>
                <span>Jan 20</span>
                <span>Feb 01</span>
                <span>Feb 15</span>
                <span>Current Cycle</span>
              </div>
            </div>
          </div>

          {/* Recent High-Fit Matches Table Card */}
          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-space-md">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Recent High-Fit Matches</h2>
                <p className="font-body-sm text-body-sm text-outline">Real-time inference rankings generated by SkillSight M-05</p>
              </div>
              <button
                onClick={() => navigate('/skillsight-ai')}
                className="flex items-center gap-1 font-label-md text-label-md text-secondary hover:underline"
              >
                <span>View All Evaluated</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
                    <th className="py-2.5 px-3 rounded-l-lg">Candidate Name</th>
                    <th className="py-2.5 px-3">Target Role</th>
                    <th className="py-2.5 px-3">Required Score</th>
                    <th className="py-2.5 px-3">Preferred Score</th>
                    <th className="py-2.5 px-3">SkillSight Fit</th>
                    <th className="py-2.5 px-3 rounded-r-lg text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {(stats?.recent_matches?.length ? stats.recent_matches : [
                    {
                      candidate_id: 'cand-ananya-sharma',
                      candidate_name: 'Ananya Sharma',
                      candidate_code: 'CAN-8902',
                      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDihFpA361XF54IfBM32YvGWE1klLnbmPhQKwjuDx9ySLcZLxNbA7dT4NjwxC7XMLWHMYXqC8Uz0dEdAEOEqm6WAaJyACXy4c1_vmWap7boMDgFm9Z8-XiPrhjgeaansACf_I9hvVsOIaf4K6wlTcrAoQo6HtBnRCOjhx8DajsNQjTaQHIhefBXfrXeg3FPeWdWlqYbbTeoENN9f_o1rTXQRBk93sQD9LYwwlBcW5PzCEQohdg6VLY2',
                      job_id: 'job-python-dev-01',
                      job_title: 'Python Developer',
                      company: 'Google',
                      required_score: 75,
                      preferred_score: 25,
                      overall_score: 60,
                      fit_tier: 'Tier 2 Match'
                    },
                    {
                      candidate_id: 'cand-marcus-vance',
                      candidate_name: 'Marcus Vance',
                      candidate_code: 'CAN-8914',
                      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyKYKBFyn2jsKarArYRJyLK5jFgC0T7pxGMD1QN4niO2nEnolu6gZfIjyel68sqP4UF7mdHynwy1lHHzfipogyZyQ41wbrTzUH_HLSxgBnODlej6wKDJyB4EJEoMLHzH_5_kvzxhEhWA65vmx0K_UklwVD6m3V3vhosiOjMJ0ZuePevrpRMn98oQQyOfnYiIc2tO_6XSwZl-jZtSmn5WBzxv-dMBT-tsGsj587epmoAkfWbkHHHJ_D',
                      job_id: 'job-staff-cloud-architect',
                      job_title: 'Principal Cloud Architect',
                      company: 'Google Cloud',
                      required_score: 82,
                      preferred_score: 89,
                      overall_score: 86,
                      fit_tier: 'High Fit'
                    },
                    {
                      candidate_id: 'cand-elena-rostova',
                      candidate_name: 'Elena Rostova',
                      candidate_code: 'CAN-8931',
                      avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBv2j8S-_1Fy3P4EnnKfokCI81BJ2JnspHE_2w9y6BwZ0PchVcgbE5An6Ye08bSSpy6M05kuWqUahnNsD0itoojY3cVgKQbhY81aotzCyYSoUaXluAus6OdqdNvfKpUs1BQo4EuY0SN3UEwY0K-suvicv1Poc6dsNx1R-ZSkAkiICkW8Y5Q6wrVlpvlAOOQ1YsB7Y7ufw_GwNMix4auy-Xt5CpnxYHlwqvOOSGsjDxnV7cSdUeotcVD',
                      job_id: 'job-python-dev-01',
                      job_title: 'ML Research Scientist',
                      company: 'Applied Vision',
                      required_score: 91,
                      preferred_score: 95,
                      overall_score: 94,
                      fit_tier: 'Top 1%'
                    },
                    {
                      candidate_id: 'cand-devon-kim',
                      candidate_name: 'Devon Kim',
                      candidate_code: 'CAN-8955',
                      avatar_url: null,
                      job_id: 'job-jr-backend-meta',
                      job_title: 'Senior Fullstack Lead',
                      company: 'Commerce Core',
                      required_score: 76,
                      preferred_score: 81,
                      overall_score: 78,
                      fit_tier: 'Viable'
                    }
                  ]).map((match, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low transition-colors group">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          {match.avatar_url ? (
                            <img
                              className="w-7 h-7 rounded-full object-cover"
                              src={match.avatar_url}
                              alt={match.candidate_name}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-code-score text-label-sm font-semibold">
                              {match.candidate_name?.split(' ').map((n) => n[0]).join('') || 'CA'}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-headline-sm text-body-md text-on-surface font-semibold">
                              {match.candidate_name}
                            </span>
                            <span className="font-label-sm text-label-sm text-outline">
                              ID: {match.candidate_code || 'CAN-XXXX'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-body-md text-body-md text-on-surface">{match.job_title}</span>
                          <span className="font-label-sm text-label-sm text-outline">{match.company}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-code-score text-body-md text-on-surface">
                        {match.required_score}
                        <span className="text-outline text-label-sm">/100</span>
                      </td>
                      <td className="py-3 px-3 font-code-score text-body-md text-on-surface">
                        {match.preferred_score}
                        <span className="text-outline text-label-sm">/100</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <ScoreRing score={match.overall_score} size="sm" />
                          <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-tertiary-container font-label-sm text-label-sm">
                            {match.overall_score >= 80 ? 'High Fit' : match.overall_score >= 60 ? 'Moderate' : 'Review'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => navigate(`/skillsight-ai?candidate_id=${match.candidate_id}&job_id=${match.job_id}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-secondary text-on-secondary hover:bg-secondary-container transition-colors font-label-sm text-label-sm"
                          type="button"
                        >
                          <span>Inspect</span>
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Cols */}
        <div className="lg:col-span-4 flex flex-col gap-gutter-lg">
          {/* Live Platform Activities Feed */}
          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Recent Platform Activities</h2>
              </div>
              <span className="font-code-metric text-label-sm text-outline">Realtime</span>
            </div>
            <div className="flex flex-col divide-y divide-surface-container mt-space-xs">
              {(stats?.recent_activities || []).map((act, idx) => (
                <div key={idx} className="py-space-md flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-surface-container-low text-secondary font-code-metric">
                      {act.tag}
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">{act.time}</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface">{act.text}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-code-metric text-label-sm text-secondary">{act.metric}</span>
                    <span className="text-outline-variant">•</span>
                    <span className="font-label-sm text-label-sm text-outline">{act.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top In-Demand Critical Skills */}
          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-space-sm">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Critical Skill Demand</h2>
              <span className="font-label-sm text-label-sm text-outline">Global JDs</span>
            </div>
            <p className="font-body-sm text-body-sm text-outline mb-space-md">
              Aggregated frequency across all parsed job requisitions
            </p>
            <div className="flex flex-col gap-space-md">
              {(stats?.critical_skills || []).map((skill, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between font-label-md text-label-md">
                    <span className="text-on-surface">{skill.name}</span>
                    <span className="font-code-metric text-on-surface font-semibold">{skill.percentage}%</span>
                  </div>
                  <div className="w-full bg-surface-container rounded-full h-1.5">
                    <div className="bg-secondary h-1.5 rounded-full" style={{ width: `${skill.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts & API Latency Widget */}
          <div className="p-space-lg rounded-xl bg-surface-container-low shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between pb-space-sm">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                Shortcuts &amp; Diagnostics
              </span>
              <span className="font-code-metric text-label-sm text-tertiary-container bg-surface-container-highest px-1.5 py-0.5 rounded">
                All Healthy
              </span>
            </div>
            <div className="grid grid-cols-2 gap-space-sm my-space-sm">
              <button
                onClick={() => {
                  alert('Generating verified talent audit export CSV...');
                }}
                className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors text-left"
              >
                <span className="material-symbols-outlined text-secondary text-base">download</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md">Export CSV</span>
                  <span className="font-label-sm text-label-sm text-outline">Matches report</span>
                </div>
              </button>
              <button
                onClick={() => navigate('/skillsight-ai')}
                className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors text-left"
              >
                <span className="material-symbols-outlined text-secondary text-base">tune</span>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md">Taxonomy</span>
                  <span className="font-label-sm text-label-sm text-outline">SkillSight AI</span>
                </div>
              </button>
            </div>
            <div className="pt-space-sm flex items-center justify-between text-outline font-code-metric text-label-sm">
              <span>Inference API: {stats?.system_latency_ms || 38}ms</span>
              <span>Vector Index: 12ms</span>
              <span>Sync: 100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
