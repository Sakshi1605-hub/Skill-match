import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeJDText, createJob, fetchJobs } from '../api/client';

export default function JDAnalytics() {
  const navigate = useNavigate();
  const [rawText, setRawText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Extracted/Editable Fields
  const [jobData, setJobData] = useState({
    title: '',
    department: 'Engineering',
    company: 'Google',
    location: 'Mountain View / Hybrid',
    experience_level: 'Mid-Level',
    min_years_experience: 0,
    required_skills: [],
    preferred_skills: [],
    responsibilities: [],
    description: '',
  });

  const [newReqSkill, setNewReqSkill] = useState('');
  const [newPrefSkill, setNewPrefSkill] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  async function loadSavedJobs() {
    try {
      const list = await fetchJobs();
      setSavedJobs(list);
    } catch (e) {
      console.error(e);
    }
  }

  const handleAnalyze = async () => {
    if (!rawText.trim()) {
      setError('Please enter or paste a job description.');
      return;
    }
    try {
      setAnalyzing(true);
      setError(null);
      const parsed = await analyzeJDText(rawText);
      setJobData({
        title: parsed.title,
        department: parsed.department,
        company: parsed.company,
        location: parsed.location,
        experience_level: parsed.experience_level,
        min_years_experience: parsed.min_years_experience,
        required_skills: parsed.required_skills,
        preferred_skills: parsed.preferred_skills,
        responsibilities: parsed.responsibilities,
        description: rawText.slice(0, 500),
      });
      setSuccess('Job description analyzed! You can now review and edit the extracted data below.');
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!jobData.title.trim()) {
      setError('Job Title is required.');
      return;
    }
    if (jobData.required_skills.length === 0) {
      setError('At least one Required Skill must be specified.');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const created = await createJob(jobData);
      setSuccess(`Job "${created.title}" successfully saved!`);
      loadSavedJobs();
      // Optional navigate to SkillSight AI
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addReqSkill = () => {
    if (newReqSkill.trim() && !jobData.required_skills.includes(newReqSkill.trim())) {
      setJobData({ ...jobData, required_skills: [...jobData.required_skills, newReqSkill.trim()] });
      setNewReqSkill('');
    }
  };

  const removeReqSkill = (skill) => {
    setJobData({ ...jobData, required_skills: jobData.required_skills.filter((s) => s !== skill) });
  };

  const addPrefSkill = () => {
    if (newPrefSkill.trim() && !jobData.preferred_skills.includes(newPrefSkill.trim())) {
      setJobData({ ...jobData, preferred_skills: [...jobData.preferred_skills, newPrefSkill.trim()] });
      setNewPrefSkill('');
    }
  };

  const removePrefSkill = (skill) => {
    setJobData({ ...jobData, preferred_skills: jobData.preferred_skills.filter((s) => s !== skill) });
  };

  const loadSampleJD = () => {
    setRawText(`Job Title: Python Developer
Company: Google
Department: Core Platform & AI Services
Location: Mountain View / Hybrid
Experience Level: Entry Level / Fresher
Experience: 0-1 years

Required Skills:
- Python
- Java
- SQL
- Machine Learning

Preferred Skills:
- AWS
- Docker
- Git
- Communication Skills

Responsibilities:
- Build scalable backend services and microservices supporting AI pipelines.
- Design normalized relational database schemas and optimize query throughput.
- Write modular, tested code adhering to clean architecture standards.`);
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-surface-container-lowest shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-code-metric text-label-sm text-outline px-2 py-0.5 rounded bg-surface-container">
              MODULE M-01
            </span>
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">JD Analytics &amp; Competency Extraction</h1>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl">
            Ingest and parse unstructured job descriptions into structured competencies, weights, and qualification bounds.
          </p>
        </div>
        <button
          onClick={loadSampleJD}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md shrink-0"
          type="button"
        >
          <span className="material-symbols-outlined text-base">auto_fix_high</span>
          <span>Load Sample Prompt JD</span>
        </button>
      </div>

      {error && (
        <div className="p-space-md rounded-xl bg-error-container text-on-error-container flex items-center justify-between">
          <span className="font-body-md">{error}</span>
          <button onClick={() => setError(null)} className="font-label-sm uppercase">Dismiss</button>
        </div>
      )}

      {success && (
        <div className="p-space-md rounded-xl bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] flex items-center justify-between">
          <span className="font-body-md font-medium">{success}</span>
          <button onClick={() => setSuccess(null)} className="font-label-sm uppercase">Dismiss</button>
        </div>
      )}

      {/* Main Grid: Paste / Upload on Left, Extracted Fields on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Textarea */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-headline-sm text-headline-sm text-on-surface">Paste Job Description</label>
              <span className="font-code-metric text-label-sm text-outline">Raw Text Ingestion</span>
            </div>
            <textarea
              className="w-full h-80 p-3 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary border border-outline-variant/40"
              placeholder="Paste complete job description text here, including requirements, qualifications, and responsibilities..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="font-code-metric text-label-sm text-outline">
              {rawText ? `${rawText.split(/\s+/).filter(Boolean).length} words` : 'Empty buffer'}
            </span>
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !rawText.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container transition-colors disabled:opacity-50 font-label-md text-label-md shadow-sm"
              type="button"
            >
              <span className="material-symbols-outlined text-base">
                {analyzing ? 'sync' : 'psychology'}
              </span>
              <span>{analyzing ? 'Extracting...' : 'Extract Competencies'}</span>
            </button>
          </div>
        </div>

        {/* Right: Editable Extracted Structured Data */}
        <form onSubmit={handleSave} className="lg:col-span-7 bg-surface-container-lowest p-6 rounded-xl shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <h2 className="font-headline-md text-headline-md text-on-surface">Structured Requisition Data</h2>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container text-secondary font-code-metric">
              Editable Schema
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-label-sm text-label-sm uppercase text-outline block mb-1">Job Title *</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary"
                value={jobData.title}
                onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                placeholder="e.g. Python Developer"
                required
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm uppercase text-outline block mb-1">Company</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary"
                value={jobData.company}
                onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
                placeholder="e.g. Google"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-label-sm text-label-sm uppercase text-outline block mb-1">Department</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary"
                value={jobData.department}
                onChange={(e) => setJobData({ ...jobData, department: e.target.value })}
                placeholder="Core Platform"
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm uppercase text-outline block mb-1">Location</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary"
                value={jobData.location}
                onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                placeholder="Mountain View / Hybrid"
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm uppercase text-outline block mb-1">Min Years Exp</label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary"
                value={jobData.min_years_experience}
                onChange={(e) => setJobData({ ...jobData, min_years_experience: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Required Skills (70% Weight) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md font-semibold text-on-surface">
                Required Skills (70% Weight) *
              </label>
              <span className="font-code-metric text-label-sm text-outline">
                {jobData.required_skills.length} skills listed
              </span>
            </div>
            <div className="flex flex-wrap gap-2 p-2.5 rounded-lg bg-surface-container-low min-h-12 border border-outline-variant/40">
              {jobData.required_skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface font-label-sm font-semibold shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeReqSkill(skill)}
                    className="text-outline hover:text-error ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="+ Add skill"
                  className="bg-transparent text-on-surface font-body-sm px-2 py-0.5 focus:outline-none w-28"
                  value={newReqSkill}
                  onChange={(e) => setNewReqSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addReqSkill();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addReqSkill}
                  className="text-secondary hover:underline font-label-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Preferred Skills (30% Weight) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md font-semibold text-on-surface">
                Preferred Skills (30% Weight)
              </label>
              <span className="font-code-metric text-label-sm text-outline">
                {jobData.preferred_skills.length} skills listed
              </span>
            </div>
            <div className="flex flex-wrap gap-2 p-2.5 rounded-lg bg-surface-container-low min-h-12 border border-outline-variant/40">
              {jobData.preferred_skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-outline font-label-sm font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                  {skill}
                  <button
                    type="button"
                    onClick={() => removePrefSkill(skill)}
                    className="text-outline hover:text-error ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="+ Add skill"
                  className="bg-transparent text-on-surface font-body-sm px-2 py-0.5 focus:outline-none w-28"
                  value={newPrefSkill}
                  onChange={(e) => setNewPrefSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPrefSkill();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addPrefSkill}
                  className="text-secondary hover:underline font-label-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-container">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-inverse-surface transition-colors font-label-md text-label-md shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>{saving ? 'Saving...' : 'Save Requisition'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Saved JDs Table */}
      <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between pb-4">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Active Requisitions Directory</h3>
            <p className="font-body-sm text-body-sm text-outline">Stored job descriptions available for SkillSight evaluation</p>
          </div>
          <span className="font-code-metric text-label-sm text-secondary bg-surface-container px-2.5 py-1 rounded">
            {savedJobs.length} Requisitions Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
                <th className="py-2.5 px-4 rounded-l-lg">Job Title</th>
                <th className="py-2.5 px-4">Company &amp; Dept</th>
                <th className="py-2.5 px-4">Required Skills</th>
                <th className="py-2.5 px-4">Preferred Skills</th>
                <th className="py-2.5 px-4 rounded-r-lg text-right">SkillSight Run</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container font-body-md text-body-md">
              {savedJobs.map((job) => (
                <tr key={job.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-4 font-semibold text-on-surface">
                    {job.title}
                    <span className="block font-label-sm text-label-sm text-outline font-normal">
                      ID: {job.id}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-on-surface">{job.company}</span>
                    <span className="block font-label-sm text-label-sm text-outline">{job.department}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {job.required_skills.slice(0, 4).map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface font-code-metric text-label-sm">
                          {s}
                        </span>
                      ))}
                      {job.required_skills.length > 4 && (
                        <span className="text-outline text-label-sm font-code-metric">
                          +{job.required_skills.length - 4}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {job.preferred_skills.slice(0, 4).map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-surface-container-low text-outline font-code-metric text-label-sm">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate(`/skillsight-ai?job_id=${job.id}`)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded bg-secondary text-on-secondary hover:bg-secondary-container transition-colors font-label-sm text-label-sm shadow-sm"
                    >
                      <span>Match</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
