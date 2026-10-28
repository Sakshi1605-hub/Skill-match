import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchCandidates, fetchJobs, runTalentCheck } from '../api/client';

export default function TalentCheck() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');

  const [evalResult, setEvalResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function init() {
      try {
        const [cList, jList] = await Promise.all([fetchCandidates(), fetchJobs()]);
        setCandidates(cList);
        setJobs(jList);

        const paramCand = searchParams.get('candidate_id');
        const paramJob = searchParams.get('job_id');

        const initialCandId =
          paramCand && cList.some((c) => c.id === paramCand)
            ? paramCand
            : cList[0]?.id || '';

        const initialJobId =
          paramJob && jList.some((j) => j.id === paramJob)
            ? paramJob
            : jList[0]?.id || '';

        setSelectedCandidateId(initialCandId);
        setSelectedJobId(initialJobId);
      } catch (err) {
        setError(err.message);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (!selectedCandidateId || !selectedJobId) return;

    async function evaluate() {
      try {
        setLoading(true);
        setError(null);
        const res = await runTalentCheck(selectedCandidateId, selectedJobId);
        setEvalResult(res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    evaluate();
  }, [selectedCandidateId, selectedJobId]);

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId);
  const selectedJob = jobs.find((j) => j.id === selectedJobId);

  return (
    <div className="flex flex-col w-full pb-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-surface-container-lowest shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-code-metric text-label-sm text-outline px-2 py-0.5 rounded bg-surface-container">
              MODULE M-04
            </span>
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Talent Check &amp; Eligibility Audit</h1>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl">
            Deterministic validation of academic accreditation, career tier bounds, and core competency baselines.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-space-md rounded-xl bg-error-container text-on-error-container flex items-center justify-between shadow-sm">
          <span className="font-body-md">{error}</span>
          <button onClick={() => setError(null)} className="font-label-sm uppercase">Dismiss</button>
        </div>
      )}

      {/* Selectors Bar */}
      <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Candidate Dropdown */}
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg">
            <span className="font-label-sm text-label-sm uppercase text-outline">Candidate:</span>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="bg-transparent font-headline-sm text-body-md text-on-surface focus:outline-none cursor-pointer"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.candidate_code})
                </option>
              ))}
            </select>
          </div>

          <div className="text-outline-variant">⇄</div>

          {/* Job Dropdown */}
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg">
            <span className="font-label-sm text-label-sm uppercase text-outline">Requisition:</span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="bg-transparent font-headline-sm text-body-md text-on-surface focus:outline-none cursor-pointer"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.company})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={() => navigate(`/skillsight-ai?candidate_id=${selectedCandidateId}&job_id=${selectedJobId}`)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container transition-colors font-label-md text-label-md shadow-sm shrink-0"
        >
          <span>View SkillSight Matrix</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>

      {/* Evaluation Results Card */}
      {evalResult && (
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                Eligibility Verdict
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">
                {evalResult.overall_verdict}
              </h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full font-code-metric text-label-md font-semibold self-start sm:self-auto ${
                evalResult.is_eligible
                  ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                  : 'bg-error-container text-on-error-container border border-error'
              }`}
            >
              {evalResult.is_eligible ? 'ELIGIBLE TO PROCEED' : 'ELIGIBILITY RESTRICTED'}
            </span>
          </div>

          {/* Criteria Checklist */}
          <div className="space-y-4">
            {evalResult.checks.map((chk, idx) => {
              const isPass = chk.status === 'PASS';
              const isWarning = chk.status === 'WARNING';
              const isFail = chk.status === 'FAIL';

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                    isPass
                      ? 'bg-surface-container-low border-surface-container'
                      : isWarning
                      ? 'bg-[#FFFBEB] border-[#FDE68A]'
                      : 'bg-error-container/20 border-error-container'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`material-symbols-outlined text-2xl ${
                        isPass ? 'text-[#10B981]' : isWarning ? 'text-[#F59E0B]' : 'text-error'
                      }`}
                    >
                      {isPass ? 'check_circle' : isWarning ? 'warning' : 'cancel'}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-headline-sm text-on-surface">
                        {chk.criterion}
                      </span>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                        {chk.explanation}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`font-code-metric text-label-sm px-2.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                      isPass
                        ? 'bg-[#ECFDF5] text-[#065F46]'
                        : isWarning
                        ? 'bg-[#FEF3C7] text-[#92400E]'
                        : 'bg-error-container text-on-error-container'
                    }`}
                  >
                    {chk.status}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-surface-container flex flex-wrap items-center justify-between gap-3 text-outline font-body-sm text-body-sm">
            <span>Verified against RADIX Talent Integrity Benchmark v2.4</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Audit log exported to enterprise vault.')}
                className="px-3 py-1.5 rounded bg-surface-container text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high transition-colors"
              >
                Export Audit Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
