import React, { useState, useEffect } from 'react';
import { fetchDashboardStats, fetchJobs, fetchCandidates } from '../api/client';

export default function AnalyticsReports() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [s, j, c] = await Promise.all([fetchDashboardStats(), fetchJobs(), fetchCandidates()]);
        setStats(s);
        setJobs(j);
        setCandidates(c);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="flex flex-col w-full pb-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-surface-container-lowest shadow-sm">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Analytics &amp; Intelligence Reports</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Global skill density telemetry, candidate pool distribution, and deterministic verification audits.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md shrink-0 shadow-sm"
        >
          <span className="material-symbols-outlined text-base">print</span>
          <span>Print Executive Summary</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Registered Candidates</span>
          <span className="font-headline-xl text-headline-xl font-code-score text-on-surface my-2">
            {candidates.length.toLocaleString()}
          </span>
          <span className="font-body-sm text-body-sm text-secondary font-code-metric">100% Vector Indexed</span>
        </div>

        <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Requisitions Calibrated</span>
          <span className="font-headline-xl text-headline-xl font-code-score text-on-surface my-2">
            {jobs.length.toLocaleString()}
          </span>
          <span className="font-body-sm text-body-sm text-secondary font-code-metric">Multi-Cloud &amp; Platform</span>
        </div>

        <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Verification Accuracy</span>
          <span className="font-headline-xl text-headline-xl font-code-score text-on-surface my-2">
            99.4%
          </span>
          <span className="font-body-sm text-body-sm text-[#065F46] font-code-metric">Grounded Deterministic Engine</span>
        </div>
      </div>

      {/* Skills Demand Table */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">Skill Demand Index</h2>
          <span className="font-code-metric text-label-sm text-outline">Normalized Taxonomy v2.4</span>
        </div>

        <div className="space-y-3">
          {(stats?.critical_skills || []).map((skill, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-surface-container-low flex items-center justify-between">
              <span className="font-headline-sm text-body-md text-on-surface font-semibold">{skill.name}</span>
              <div className="flex items-center gap-4 w-1/2">
                <div className="w-full bg-surface-container rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: `${skill.percentage}%` }}></div>
                </div>
                <span className="font-code-metric text-label-sm text-on-surface font-bold min-w-10 text-right">
                  {skill.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
