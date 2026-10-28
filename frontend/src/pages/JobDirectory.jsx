import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchJobs } from '../api/client';

export default function JobDirectory() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const list = await fetchJobs();
        setJobs(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredJobs = jobs.filter((j) => {
    const q = search.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.department.toLowerCase().includes(q) ||
      j.required_skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col w-full pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-surface-container-lowest shadow-sm">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Requisition Directory</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Browse and manage all enterprise job descriptions indexed for SkillSight AI calibration.
          </p>
        </div>
        <button
          onClick={() => navigate('/jd-analytics')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-inverse-surface transition-colors font-label-md text-label-md shadow-sm shrink-0"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>+ Ingest New JD</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between">
        <div className="relative flex items-center w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 text-outline text-base pointer-events-none">
            search
          </span>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-surface-container text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary"
            placeholder="Search by role, company, skill (e.g. Python, AWS)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="font-code-metric text-label-sm text-outline">
          Showing {filteredJobs.length} of {jobs.length} requisitions
        </span>
      </div>

      {/* Grid of Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="p-6 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-secondary font-code-metric">
                  {job.experience_level || 'Mid-Level'}
                </span>
                <span className="font-code-metric text-label-sm text-outline">
                  {job.min_years_experience}y+ exp
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mt-1">
                {job.title}
              </h3>
              <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
                {job.company} · {job.department}
              </span>
              <p className="font-body-sm text-body-sm text-outline mt-3 line-clamp-2">
                {job.description || 'Enterprise role specification.'}
              </p>

              {/* Required Skills */}
              <div className="mt-4">
                <span className="font-label-sm text-label-sm text-outline uppercase block mb-1.5">
                  Required Skills:
                </span>
                <div className="flex flex-wrap gap-1">
                  {job.required_skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded bg-surface-container-highest text-on-surface font-code-metric text-label-sm"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferred Skills */}
              {job.preferred_skills?.length > 0 && (
                <div className="mt-3">
                  <span className="font-label-sm text-label-sm text-outline uppercase block mb-1.5">
                    Preferred Skills:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {job.preferred_skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded bg-surface-container-low text-outline font-code-metric text-label-sm"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-surface-container flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-outline">{job.location}</span>
              <button
                onClick={() => navigate(`/skillsight-ai?job_id=${job.id}`)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-secondary text-on-secondary hover:bg-secondary-container transition-colors font-label-sm text-label-sm shadow-sm"
              >
                <span>Evaluate</span>
                <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
