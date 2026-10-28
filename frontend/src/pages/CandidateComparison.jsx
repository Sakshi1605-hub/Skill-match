import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCandidates, fetchJobs, calculateMatch } from '../api/client';
import ScoreRing from '../components/common/ScoreRing';

export default function CandidateComparison() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');

  const [compareCandA, setCompareCandA] = useState('');
  const [compareCandB, setCompareCandB] = useState('');

  const [matchA, setMatchA] = useState(null);
  const [matchB, setMatchB] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [cList, jList] = await Promise.all([fetchCandidates(), fetchJobs()]);
        setCandidates(cList);
        setJobs(jList);

        if (jList.length > 0) setSelectedJobId(jList[0].id);
        if (cList.length >= 2) {
          setCompareCandA(cList[0].id);
          setCompareCandB(cList[1].id);
        } else if (cList.length === 1) {
          setCompareCandA(cList[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!selectedJobId || !compareCandA) return;

    async function runComp() {
      try {
        setLoading(true);
        const [resA, resB] = await Promise.all([
          calculateMatch(compareCandA, selectedJobId),
          compareCandB ? calculateMatch(compareCandB, selectedJobId) : null,
        ]);
        setMatchA(resA);
        setMatchB(resB);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    runComp();
  }, [selectedJobId, compareCandA, compareCandB]);

  const targetJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="flex flex-col w-full pb-16 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-surface-container-lowest shadow-sm">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Candidate Comparison Workbench</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Side-by-side deterministic telemetry, skill gap variance, and candidate calibration.
          </p>
        </div>
      </div>

      {/* Target Job Selector */}
      <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex items-center gap-3">
        <span className="font-label-sm text-label-sm uppercase text-outline">Target Job Requisition:</span>
        <select
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
          className="bg-surface-container-low px-3 py-1.5 rounded-lg font-headline-sm text-body-md text-on-surface focus:outline-none"
        >
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title} ({j.company} · {j.department})
            </option>
          ))}
        </select>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Candidate A */}
        <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-container">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                Candidate Profile A
              </span>
              <select
                value={compareCandA}
                onChange={(e) => setCompareCandA(e.target.value)}
                className="bg-surface-container-low px-2.5 py-1 rounded font-body-sm text-on-surface focus:outline-none"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name}
                  </option>
                ))}
              </select>
            </div>

            {matchA && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <ScoreRing score={matchA.overall_score} size="lg" label={matchA.fit_level} />
                  <div className="flex flex-col">
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                      {matchA.candidate_name}
                    </h3>
                    <span className="font-code-metric text-label-sm text-outline">
                      ID: {matchA.candidate_code}
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary font-semibold mt-1">
                      {matchA.fit_tier}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-surface-container-low">
                  <div>
                    <span className="font-label-sm text-label-sm text-outline block">Required Match</span>
                    <span className="font-code-score text-headline-sm text-on-surface">
                      {matchA.required_score.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="font-label-sm text-label-sm text-outline block">Preferred Match</span>
                    <span className="font-code-score text-headline-sm text-on-surface">
                      {matchA.preferred_score.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-label-sm text-label-sm uppercase text-outline block mb-2">
                    Matched Skills ({matchA.matched_skills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchA.matched_skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-full bg-surface-container-highest text-secondary font-label-sm font-semibold"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-label-sm text-label-sm uppercase text-outline block mb-2">
                    Missing Gaps ({matchA.missing_skills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchA.missing_skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm font-semibold"
                      >
                        ✕ {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {matchA && (
            <button
              onClick={() => navigate(`/skillsight-ai?candidate_id=${matchA.candidate_id}&job_id=${selectedJobId}`)}
              className="w-full py-2 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container transition-colors font-label-md text-label-md shadow-sm"
            >
              Open Full Matrix for {matchA.candidate_name}
            </button>
          )}
        </div>

        {/* Candidate B */}
        <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-container">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                Candidate Profile B
              </span>
              <select
                value={compareCandB}
                onChange={(e) => setCompareCandB(e.target.value)}
                className="bg-surface-container-low px-2.5 py-1 rounded font-body-sm text-on-surface focus:outline-none"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name}
                  </option>
                ))}
              </select>
            </div>

            {matchB && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <ScoreRing score={matchB.overall_score} size="lg" label={matchB.fit_level} />
                  <div className="flex flex-col">
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                      {matchB.candidate_name}
                    </h3>
                    <span className="font-code-metric text-label-sm text-outline">
                      ID: {matchB.candidate_code}
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary font-semibold mt-1">
                      {matchB.fit_tier}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-surface-container-low">
                  <div>
                    <span className="font-label-sm text-label-sm text-outline block">Required Match</span>
                    <span className="font-code-score text-headline-sm text-on-surface">
                      {matchB.required_score.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="font-label-sm text-label-sm text-outline block">Preferred Match</span>
                    <span className="font-code-score text-headline-sm text-on-surface">
                      {matchB.preferred_score.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-label-sm text-label-sm uppercase text-outline block mb-2">
                    Matched Skills ({matchB.matched_skills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchB.matched_skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-full bg-surface-container-highest text-secondary font-label-sm font-semibold"
                      >
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-label-sm text-label-sm uppercase text-outline block mb-2">
                    Missing Gaps ({matchB.missing_skills.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchB.missing_skills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm font-semibold"
                      >
                        ✕ {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {matchB && (
            <button
              onClick={() => navigate(`/skillsight-ai?candidate_id=${matchB.candidate_id}&job_id=${selectedJobId}`)}
              className="w-full py-2 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container transition-colors font-label-md text-label-md shadow-sm"
            >
              Open Full Matrix for {matchB.candidate_name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
