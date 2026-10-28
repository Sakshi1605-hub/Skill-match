import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  fetchCandidates,
  fetchJobs,
  calculateMatch,
  runSimulation,
  fetchRecommendations,
} from '../api/client';
import ScoreRing from '../components/common/ScoreRing';

export default function SkillSightAI() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');

  const [matchData, setMatchData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // What-If Simulator state
  const [simulatedSkills, setSimulatedSkills] = useState([]);
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  // Load initial candidate & job lists
  useEffect(() => {
    async function init() {
      try {
        setLoading(true);
        const [cList, jList] = await Promise.all([fetchCandidates(), fetchJobs()]);
        setCandidates(cList);
        setJobs(jList);

        // Determine active candidate and job from URL params or default to Ananya & Python Dev
        const paramCand = searchParams.get('candidate_id');
        const paramJob = searchParams.get('job_id');

        const initialCandId =
          paramCand && cList.some((c) => c.id === paramCand)
            ? paramCand
            : cList.find((c) => c.id === 'cand-ananya-sharma')?.id || cList[0]?.id || '';

        const initialJobId =
          paramJob && jList.some((j) => j.id === paramJob)
            ? paramJob
            : jList.find((j) => j.id === 'job-python-dev-01')?.id || jList[0]?.id || '';

        setSelectedCandidateId(initialCandId);
        setSelectedJobId(initialJobId);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Recalculate match whenever active candidate or job changes
  useEffect(() => {
    if (!selectedCandidateId || !selectedJobId) return;

    let isCancelled = false;
    async function loadMatchAndRecs() {
      try {
        setLoading(true);
        setError(null);
        setSimulatedSkills([]);
        setSimResult(null);

        // Update URL search params
        setSearchParams({ candidate_id: selectedCandidateId, job_id: selectedJobId });

        const [matchRes, recsRes] = await Promise.all([
          calculateMatch(selectedCandidateId, selectedJobId),
          fetchRecommendations(selectedCandidateId, selectedJobId),
        ]);

        if (!isCancelled) {
          setMatchData(matchRes);
          setRecommendations(recsRes);
        }
      } catch (err) {
        if (!isCancelled) setError(err.message);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadMatchAndRecs();
    return () => {
      isCancelled = true;
    };
  }, [selectedCandidateId, selectedJobId]);

  // Handle What-If Simulator toggle
  const handleToggleSimulationSkill = async (skillName) => {
    const updated = simulatedSkills.includes(skillName)
      ? simulatedSkills.filter((s) => s !== skillName)
      : [...simulatedSkills, skillName];

    setSimulatedSkills(updated);

    if (updated.length === 0) {
      setSimResult(null);
      return;
    }

    try {
      setSimLoading(true);
      const res = await runSimulation(selectedCandidateId, selectedJobId, updated);
      setSimResult(res);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimLoading(false);
    }
  };

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || null;
  const selectedJob = jobs.find((j) => j.id === selectedJobId) || null;

  // Active matrix (simulated if running, otherwise baseline)
  const displayMatrix = simResult?.projected_matrix || matchData?.matrix || [];
  const currentOverallScore = simResult ? simResult.simulated_score : matchData?.overall_score ?? 60.0;
  const currentTier = simResult ? simResult.tier_label : matchData?.fit_tier ?? 'Tier 2 Progressive Candidate';

  return (
    <div className="flex flex-col w-full pb-16 space-y-8">
      {/* Top Context Header Bar */}
      <section className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 p-6 rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Candidate Selector Badge */}
          <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2.5 rounded-lg">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest shrink-0">
              {selectedCandidate?.avatar_url ? (
                <img
                  className="w-full h-full object-cover"
                  src={selectedCandidate.avatar_url}
                  alt={selectedCandidate.full_name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-code-score text-label-sm font-semibold text-secondary">
                  {selectedCandidate?.full_name?.split(' ').map((n) => n[0]).join('') || 'CA'}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <select
                  value={selectedCandidateId}
                  onChange={(e) => setSelectedCandidateId(e.target.value)}
                  className="bg-transparent font-headline-sm text-headline-sm text-on-surface focus:outline-none cursor-pointer pr-2"
                >
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id} className="text-on-surface">
                      {c.full_name}
                    </option>
                  ))}
                </select>
                <span className="font-code-metric text-code-metric px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
                  {selectedCandidate?.experience_years === 0 ? 'FRESHER' : `${selectedCandidate?.experience_years} YRS EXP`}
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {selectedCandidate?.education || 'Candidate Profile'}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex text-outline-variant font-code-metric text-headline-sm">⇄</div>

          {/* Target Job Selector Badge */}
          <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2.5 rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary font-headline-sm shrink-0">
              <span className="material-symbols-outlined text-secondary text-2xl">terminal</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="bg-transparent font-headline-sm text-headline-sm text-on-surface focus:outline-none cursor-pointer pr-2"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id} className="text-on-surface">
                      {j.title}
                    </option>
                  ))}
                </select>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant">
                  {selectedJob?.location || 'Mountain View / Hybrid'}
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {selectedJob?.company || 'Google'} · {selectedJob?.department || 'Core Platform'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant">
            <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
            <span className="font-code-metric text-code-metric">Explainable Matrix v2.1</span>
          </div>
        </div>

        {/* Global CTAs */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-end">
          <button
            onClick={() => navigate('/resume-parsing')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md"
            type="button"
          >
            <span className="material-symbols-outlined text-base">file_open</span>
            <span>Original Resume</span>
          </button>
          <button
            onClick={() => navigate('/talent-check')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md"
            type="button"
          >
            <span className="material-symbols-outlined text-base">verified_user</span>
            <span>Talent Check</span>
          </button>
          <button
            onClick={() => {
              window.print();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container transition-colors shadow-sm font-label-md text-label-md"
            type="button"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export Talent Audit</span>
          </button>
        </div>
      </section>

      {/* Backend Error Banner */}
      {error && (
        <div className="p-space-md rounded-xl bg-error-container text-on-error-container flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            <span className="font-body-md font-medium">{error}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 rounded bg-error text-on-error font-label-sm"
          >
            Refresh
          </button>
        </div>
      )}

      {/* Top Score Hero Banner (3-Column Bento) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Box 1: Radial AI Engine Gauge */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                Telemetry Verdict
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface mt-0.5">
                Overall Fit Ratio
              </h2>
            </div>
            <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-high text-secondary font-code-metric font-semibold">
              {matchData?.fit_level || 'Tier 2 Match'}
            </span>
          </div>

          <div className="flex items-center justify-center my-4 relative">
            <ScoreRing
              score={currentOverallScore}
              size="lg"
              label={
                currentOverallScore >= 80 ? 'HIGH FIT' : currentOverallScore >= 60 ? 'MODERATE FIT' : 'LOWER ALIGNMENT'
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 bg-surface-container-low p-3 rounded-lg">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Required (70% Wt.)</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-code-score text-code-score text-on-surface">
                  {matchData?.required_score?.toFixed(1) || '75.0'}%
                </span>
                <span className="font-code-metric text-code-metric text-outline-variant font-normal">
                  {matchData?.required_hits_count ?? 3}/{matchData?.required_total_count ?? 4} hits
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Preferred (30% Wt.)</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-code-score text-code-score text-on-surface">
                  {matchData?.preferred_score?.toFixed(1) || '25.0'}%
                </span>
                <span className="font-code-metric text-code-metric text-outline-variant font-normal">
                  {matchData?.preferred_hits_count ?? 1}/{matchData?.preferred_total_count ?? 4} hits
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Box 2: Transparent Formula Explainer */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-xl">functions</span>
                <h2 className="font-headline-md text-headline-md text-on-surface">Mathematical Transparency</h2>
              </div>
              <span className="font-code-metric text-label-sm text-outline px-2 py-0.5 rounded bg-surface-container">
                Deterministic Audit
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Zero opaque heuristics. RADIX evaluates candidacy purely via strict linear coefficient weighting between mandatory qualifications and functional differentiators.
            </p>
          </div>

          {/* Formula breakdown visual card */}
          <div className="my-4 p-4 rounded-lg bg-surface-container-low space-y-3 font-code-metric">
            <div className="flex items-center justify-between text-body-sm text-on-surface-variant">
              <span>Formula:</span>
              <span className="text-on-surface font-semibold">
                (Req % × {matchData?.explainer?.required_weight?.toFixed(2) || '0.70'}) + (Pref % ×{' '}
                {matchData?.explainer?.preferred_weight?.toFixed(2) || '0.30'}) = Final
              </span>
            </div>
            <div className="p-3 rounded bg-surface-container-lowest shadow-sm flex flex-col gap-2">
              <div className="flex items-center justify-between font-label-md text-label-md">
                <span className="text-on-surface-variant">Required Weight (70%):</span>
                <span className="text-on-surface font-semibold">
                  {matchData?.explainer?.required_match_percentage?.toFixed(1) || '75.0'}% × 0.70 ={' '}
                  <strong className="text-secondary font-headline-sm">
                    {matchData?.explainer?.required_weighted_score?.toFixed(1) || '52.5'}%
                  </strong>
                </span>
              </div>
              <div className="flex items-center justify-between font-label-md text-label-md">
                <span className="text-on-surface-variant">Preferred Weight (30%):</span>
                <span className="text-on-surface font-semibold">
                  {matchData?.explainer?.preferred_match_percentage?.toFixed(1) || '25.0'}% × 0.30 ={' '}
                  <strong className="text-secondary font-headline-sm">
                    {matchData?.explainer?.preferred_weighted_score?.toFixed(1) || '7.5'}%
                  </strong>
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-body-sm text-body-sm text-on-surface font-semibold">Calculated Score:</span>
              <span className="font-code-score text-code-score text-secondary font-semibold">
                {matchData?.explainer?.required_weighted_score?.toFixed(1) || '52.5'}% +{' '}
                {matchData?.explainer?.preferred_weighted_score?.toFixed(1) || '7.5'}% ={' '}
                {matchData?.overall_score?.toFixed(1) || '60.0'}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-sm text-secondary">verified</span>
            <span>Confidence Margin: 99.4% · Grounded in verifiable resume text units</span>
          </div>
        </div>

        {/* Box 3: Candidate Summary & Fit Breakdown */}
        <div className="lg:col-span-3 bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
              Talent Persona
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface mt-0.5">
              {matchData?.summary_persona?.headline || 'High Upskill Potential'}
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
              Academic foundation in Core CS (Data Structures, OOP, SQL) demonstrates rapid acquisition velocity.
            </p>
          </div>

          <div className="space-y-3 my-4">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-base">school</span>
                <span className="font-label-md text-label-md text-on-surface">Academic Profile</span>
              </div>
              <span className="font-code-metric text-label-sm text-on-surface font-semibold">
                {matchData?.summary_persona?.academic_profile || 'CS Graduate'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-container text-base">trending_up</span>
                <span className="font-label-md text-label-md text-on-surface">Learning Velocity</span>
              </div>
              <span className="font-code-metric text-label-sm text-secondary font-semibold">
                {matchData?.summary_persona?.learning_velocity || 'Top 15th Pct.'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-base">report_problem</span>
                <span className="font-label-md text-label-md text-on-surface">Primary Blocker</span>
              </div>
              <span className="font-code-metric text-label-sm text-error font-semibold">
                {matchData?.summary_persona?.primary_blocker || 'Machine Learning'}
              </span>
            </div>
          </div>

          <div className="bg-surface-container p-3 rounded-lg">
            <span className="font-label-sm text-label-sm text-on-surface-variant block mb-1">Recommendation</span>
            <p className="font-body-sm text-body-sm text-on-surface">
              {matchData?.summary_persona?.recommendation ||
                'Fast-track to technical screening with junior onboarding support package.'}
            </p>
          </div>
        </div>
      </section>

      {/* Skill Comparison & Evidence Matrix (Table) */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">dataset</span>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Skill Comparison &amp; Evidence Matrix
              </h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Direct linguistic semantic mapping from {selectedCandidate?.full_name || "candidate"}'s parsed documentation.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-code-metric">
              Total: {displayMatrix.length} Skills
            </span>
            <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-surface-container-low text-secondary font-code-metric">
              {displayMatrix.filter((m) => m.status === 'MATCHED').length} Matched
            </span>
            <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-code-metric">
              {displayMatrix.filter((m) => m.status !== 'MATCHED').length} Missing
            </span>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-3 px-6">Skill Name</th>
                <th className="py-3 px-4">Classification</th>
                <th className="py-3 px-4">Engine Weight</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6">Extracted Resume Evidence</th>
                <th className="py-3 px-4">Gap Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container font-body-md text-body-md">
              {displayMatrix.map((row, idx) => {
                const isMatched = row.status === 'MATCHED';
                const isRequired = row.classification === 'Required';
                const rowBg = !isMatched && isRequired ? 'bg-error-container/20 hover:bg-error-container/30' : 'hover:bg-surface-container-low/60';

                return (
                  <tr key={idx} className={`${rowBg} transition-colors`}>
                    <td className={`py-3.5 px-6 font-semibold flex items-center gap-2 ${!isMatched && isRequired ? 'text-error' : 'text-on-surface'}`}>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isMatched ? 'bg-secondary' : isRequired ? 'bg-error' : 'bg-outline-variant'
                        }`}
                      ></span>
                      {row.skill_name}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-code-metric text-label-sm px-2 py-0.5 rounded ${
                          isRequired
                            ? 'bg-surface-container-high text-on-surface'
                            : 'bg-surface-container text-outline'
                        }`}
                      >
                        {row.classification}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-code-metric text-code-metric text-on-surface">
                      {row.engine_weight_display}
                    </td>

                    <td className="py-3.5 px-4">
                      {isMatched ? (
                        <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-lowest text-secondary font-semibold shadow-sm">
                          <span className="material-symbols-outlined text-xs">check_circle</span> MATCHED
                        </span>
                      ) : row.status === 'NOT DETECTED' ? (
                        <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container text-outline">
                          <span className="material-symbols-outlined text-xs">remove</span> NOT DETECTED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-semibold">
                          <span className="material-symbols-outlined text-xs">close</span> MISSING
                        </span>
                      )}
                    </td>

                    <td className={`py-3.5 px-6 italic text-body-sm ${isMatched ? 'text-on-surface-variant font-code-metric' : 'text-outline'}`}>
                      {row.evidence}
                    </td>

                    <td className="py-3.5 px-4">
                      {isMatched ? (
                        <span className="font-code-metric text-label-sm text-outline">None (Cleared)</span>
                      ) : row.gap_severity.includes('Critical') ? (
                        <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-error-container text-on-error-container font-semibold">
                          {row.gap_severity}
                        </span>
                      ) : (
                        <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-medium">
                          {row.gap_severity}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive "What-If Score Simulator" Sandbox */}
      <section className="bg-primary-container text-on-secondary-container p-6 rounded-xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-2xl">science</span>
              <h3 className="font-headline-lg text-headline-lg text-surface">Hypothetical Acquisition Sandbox</h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-primary-container mt-1">
              Simulate score uplift by modeling fast-track skill acquisition sprints for {selectedCandidate?.full_name || 'the candidate'}.
            </p>
          </div>
          <div className="px-3 py-1 rounded bg-inverse-surface font-code-metric text-label-sm text-tertiary-fixed-dim tracking-wider uppercase">
            HYPOTHETICAL SIMULATION
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          {/* Checkbox Controls for Missing Skills */}
          <div className="lg:col-span-7 space-y-3">
            {(matchData?.missing_skills || ['Machine Learning', 'AWS', 'Docker']).map((skill, index) => {
              const isChecked = simulatedSkills.includes(skill);
              const isReq = matchData?.matrix?.find((m) => m.skill_name === skill)?.classification === 'Required';
              const upliftPct = isReq ? '+17.5%' : '+7.5%';

              const descriptions = {
                'Machine Learning': 'Google ML Crash Course + Basic PyTorch Pipelines',
                AWS: 'Cloud Practitioner, EC2 compute & S3 storage architecture',
                Docker: 'Dockerfiles, Compose environments for Python Flask/FastAPI',
                'Communication Skills': 'Technical RFC writing and stakeholder presentations',
              };

              return (
                <label
                  key={index}
                  className={`flex items-center justify-between p-3.5 rounded-lg transition-colors cursor-pointer ${
                    isChecked ? 'bg-secondary/40 border border-secondary' : 'bg-inverse-surface/60 hover:bg-inverse-surface'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-secondary focus:ring-0 cursor-pointer"
                      checked={isChecked}
                      onChange={() => handleToggleSimulationSkill(skill)}
                    />
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-headline-sm text-surface">
                        Acquire {skill}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-primary-container">
                        {descriptions[skill] || `Complete intensive accelerated ${skill} certification sprint`}
                      </span>
                    </div>
                  </div>
                  <span className="font-code-score text-code-score text-tertiary-fixed-dim font-bold">
                    {upliftPct}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Realtime Simulated Output Gauge */}
          <div className="lg:col-span-5 bg-inverse-surface/80 p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-inner">
            <span className="font-label-sm text-label-sm text-on-primary-container uppercase tracking-wider">
              Projected Match Velocity
            </span>
            <div className="flex items-baseline gap-2 my-2">
              <span className="font-code-metric text-headline-lg text-outline-variant line-through">
                {matchData?.overall_score?.toFixed(1) || '60.0'}%
              </span>
              <span className="text-tertiary-fixed-dim font-headline-sm">→</span>
              <span className="font-headline-xl text-headline-xl text-surface font-bold text-tertiary-fixed">
                {currentOverallScore.toFixed(1)}%
              </span>
            </div>
            <div className="font-code-metric text-label-md px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
              {currentTier}
            </div>
            <p className="font-body-sm text-body-sm text-on-primary-container mt-4">
              {simResult?.narrative ||
                `Select learning pathways to project ${selectedCandidate?.full_name || "candidate"}'s placement readiness.`}
            </p>
          </div>
        </div>
      </section>

      {/* Skill Gap Analysis & Personalized Roadmap */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">conversion_path</span>
              <h3 className="font-headline-md text-headline-md text-on-surface">Targeted Upskill Acceleration Plan</h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Estimated time-to-clearance for {selectedJob?.company || 'Google'} {selectedJob?.title || 'Python Developer'} specifications.
            </p>
          </div>
          <span className="font-label-sm text-label-sm px-3 py-1 rounded bg-surface-container font-code-metric text-on-surface">
            {recommendations?.estimated_ramp || 'Estimated Ramp: 7-11 Weeks'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(recommendations?.learning_roadmap || [
            {
              skill_name: 'Machine Learning Foundations',
              priority: 'HIGH PRIORITY',
              duration_weeks: '4-6 weeks',
              description: 'Critical gap for AI Services team. Transition from theoretical CS math into applied inference scripting.',
              score_delta_display: '+17.5%',
              curated_materials: [
                { title: 'Google Machine Learning Crash Course', type: 'course' },
                { title: 'PyTorch Tensors & Basic Regression Labs', type: 'lab' }
              ]
            },
            {
              skill_name: 'AWS Cloud Architecture',
              priority: 'MEDIUM PRIORITY',
              duration_weeks: '2-3 weeks',
              description: 'Cloud infrastructure operationalization. Understand distributed deployment patterns and object storage.',
              score_delta_display: '+7.5%',
              curated_materials: [
                { title: 'AWS Certified Cloud Practitioner', type: 'course' },
                { title: 'EC2 Provisioning, IAM Roles & S3 CLI', type: 'lab' }
              ]
            },
            {
              skill_name: 'Containerization & Docker',
              priority: 'MEDIUM PRIORITY',
              duration_weeks: '1-2 weeks',
              description: 'Package Python runtime dependencies uniformly for staging and cluster deployment in production.',
              score_delta_display: '+7.5%',
              curated_materials: [
                { title: 'Containerizing Python Web Services', type: 'lab' },
                { title: 'Multi-stage Docker Builds', type: 'course' }
              ]
            }
          ]).map((item, idx) => {
            const isHigh = item.priority === 'HIGH PRIORITY';

            return (
              <div key={idx} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`font-label-sm text-label-sm px-2 py-0.5 rounded font-semibold ${
                        isHigh ? 'bg-error-container text-on-error-container' : 'bg-surface-container-high text-on-surface'
                      }`}
                    >
                      {item.priority}
                    </span>
                    <span className="font-code-metric text-label-sm text-outline">
                      Est. {item.duration_weeks}
                    </span>
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface">
                    {item.skill_name}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                    {item.description}
                  </p>

                  <div className="mt-4 p-3 bg-surface-container-low rounded-lg space-y-1.5">
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold block">
                      Curated Materials:
                    </span>
                    {(item.curated_materials || []).map((mat, mIdx) => (
                      <div key={mIdx} className="flex items-center gap-2 font-body-sm text-body-sm text-secondary">
                        <span className="material-symbols-outlined text-sm">
                          {mat.type === 'course' ? 'menu_book' : mat.type === 'lab' ? 'code' : 'cloud'}
                        </span>
                        {mat.title}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                  <span>Score Delta:</span>
                  <span className="font-code-score text-code-score text-secondary font-bold">
                    {item.score_delta_display}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Best-Fit Alternative Job Recommendations */}
      <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-xl">swap_calls</span>
              <h3 className="font-headline-md text-headline-md text-on-surface">Best-Fit Alternative Openings</h3>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Cross-referencing {selectedCandidate?.full_name || 'candidate'}'s matched profile against parallel enterprise job descriptions.
            </p>
          </div>
          <button
            onClick={() => navigate('/jobs')}
            className="px-3 py-1.5 rounded bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"
            type="button"
          >
            View All Saved JDs
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(recommendations?.best_fit_openings || []).map((opening, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-highest text-secondary font-semibold font-code-metric">
                    {opening.fit_label}
                  </span>
                  <span className="font-headline-sm text-headline-sm text-secondary font-code-score">
                    {opening.match_score.toFixed(1)}%
                  </span>
                </div>
                <h5 className="font-headline-sm text-headline-sm text-on-surface mt-2">{opening.title}</h5>
                <span className="font-body-sm text-body-sm text-on-surface-variant block">
                  {opening.company} · {opening.department}
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-3">
                  {opening.rationale}
                </p>
              </div>
              <div className="pt-4 mt-3 flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">Immediate Routing</span>
                <button
                  onClick={() => setSelectedJobId(opening.job_id)}
                  className="p-1 rounded text-secondary hover:bg-surface-container-highest transition-colors"
                  type="button"
                  title="Switch to this Job Evaluation"
                >
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
