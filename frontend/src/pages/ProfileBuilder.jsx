import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCandidates, createCandidate } from '../api/client';

export default function ProfileBuilder() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    full_name: '',
    candidate_code: '',
    email: '',
    phone: '',
    location: 'San Francisco, CA',
    education: 'B.Tech Computer Science · Class of 2024',
    degree: 'B.Tech Computer Science',
    graduation_year: '2024',
    experience_years: 0,
    current_role: 'Fresher / Software Engineer',
    skills: [],
    projects: [],
    certifications: [],
  });

  const [skillInput, setSkillInput] = useState('');
  const [projectInput, setProjectInput] = useState({ title: '', description: '', skills_used: [] });

  useEffect(() => {
    loadCandidates();
  }, []);

  async function loadCandidates() {
    try {
      const list = await fetchCandidates();
      setCandidates(list);
      if (list.length > 0 && !selectedCandidateId) {
        populateForm(list[0]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const populateForm = (cand) => {
    setSelectedCandidateId(cand.id);
    setForm({
      full_name: cand.full_name || '',
      candidate_code: cand.candidate_code || '',
      email: cand.email || '',
      phone: cand.phone || '',
      location: cand.location || 'San Francisco, CA',
      education: cand.education || '',
      degree: cand.degree || '',
      graduation_year: cand.graduation_year || '2024',
      experience_years: cand.experience_years || 0,
      current_role: cand.current_role || '',
      skills: cand.skills || [],
      projects: cand.projects || [],
      certifications: cand.certifications || [],
    });
  };

  const handleSelectCandidate = (candId) => {
    const cand = candidates.find((c) => c.id === candId);
    if (cand) {
      populateForm(cand);
    }
  };

  const handleNewCandidate = () => {
    setSelectedCandidateId('');
    setForm({
      full_name: '',
      candidate_code: `CAN-${Math.floor(1000 + Math.random() * 9000)}`,
      email: '',
      phone: '',
      location: 'San Francisco, CA',
      education: 'B.Tech Computer Science · Class of 2024',
      degree: 'B.Tech Computer Science',
      graduation_year: '2024',
      experience_years: 0,
      current_role: 'Software Engineer',
      skills: ['Python', 'Java', 'SQL'],
      projects: [],
      certifications: [],
    });
  };

  // Profile Completeness calculation
  const calculateCompleteness = () => {
    let score = 20;
    if (form.full_name.trim()) score += 15;
    if (form.email.trim()) score += 15;
    if (form.degree.trim()) score += 15;
    if (form.skills.length >= 3) score += 20;
    if (form.projects.length >= 1) score += 15;
    return Math.min(100, score);
  };

  const completeness = calculateCompleteness();

  const handleAddSkill = () => {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const handleAddProject = () => {
    if (projectInput.title.trim()) {
      setForm({
        ...form,
        projects: [...form.projects, { ...projectInput }],
      });
      setProjectInput({ title: '', description: '', skills_used: [] });
    }
  };

  const handleRemoveProject = (index) => {
    setForm({ ...form, projects: form.projects.filter((_, i) => i !== index) });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      setError('Candidate Name is required.');
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const res = await createCandidate({
        ...form,
        completeness_percentage: completeness,
      });
      setSuccess(`Profile for "${res.full_name}" saved with ${completeness}% completeness!`);
      loadCandidates();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-surface-container-lowest shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-code-metric text-label-sm text-outline px-2 py-0.5 rounded bg-surface-container">
              MODULE M-03
            </span>
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Candidate Profile Builder</h1>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl">
            Configure structured talent records, calibrate competency vectors, and audit profile integrity.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleNewCandidate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md"
            type="button"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>+ New Profile</span>
          </button>
        </div>
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

      {/* Main Grid: Selector & Completeness on Left, Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Existing Candidates & Completeness Gauge */}
        <div className="lg:col-span-4 space-y-6">
          {/* Completeness Card */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm text-center flex flex-col items-center">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-2">
              Profile Completeness
            </span>
            <div className="relative w-32 h-32 flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle className="text-surface-container" cx="50" cy="50" fill="none" r="42" stroke="currentColor" strokeWidth="8" />
                <circle
                  className="text-secondary transition-all duration-700"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="42"
                  stroke="currentColor"
                  strokeDasharray="263.89"
                  strokeDashoffset={263.89 - (completeness / 100) * 263.89}
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline-xl text-headline-xl text-on-surface font-code-score">
                  {completeness}%
                </span>
              </div>
            </div>
            <span className="font-code-metric text-label-sm text-on-surface-variant font-medium">
              {completeness === 100 ? 'Vector Ready (100%)' : 'Partial Record'}
            </span>
            <p className="font-body-sm text-body-sm text-outline mt-2">
              Full profiles ensure maximum deterministic matching accuracy in SkillSight AI M-05.
            </p>
          </div>

          {/* Existing Candidates Selector */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">Saved Candidates</h3>
            <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
              {candidates.map((cand) => (
                <div
                  key={cand.id}
                  onClick={() => handleSelectCandidate(cand.id)}
                  className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    selectedCandidateId === cand.id
                      ? 'bg-secondary text-on-secondary shadow-sm'
                      : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-body-md font-semibold">{cand.full_name}</span>
                    <span
                      className={`font-label-sm text-label-sm ${
                        selectedCandidateId === cand.id ? 'text-on-secondary/80' : 'text-outline'
                      }`}
                    >
                      {cand.candidate_code} • {cand.degree}
                    </span>
                  </div>
                  <span
                    className={`font-code-metric text-label-sm px-2 py-0.5 rounded ${
                      selectedCandidateId === cand.id ? 'bg-white/20 text-white' : 'bg-surface-container-highest text-secondary'
                    }`}
                  >
                    {cand.experience_years === 0 ? 'Fresher' : `${cand.experience_years}y`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Candidate Profile Editor Form */}
        <form onSubmit={handleSave} className="lg:col-span-8 bg-surface-container-lowest p-6 rounded-xl shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <h2 className="font-headline-md text-headline-md text-on-surface">Candidate Details</h2>
            <span className="font-code-metric text-label-sm text-outline">
              ID: {form.candidate_code || 'CAN-XXXX'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-label-sm text-label-sm uppercase text-outline block mb-1">Full Name *</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="e.g. Ananya Sharma"
                required
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm uppercase text-outline block mb-1">Email Address</label>
              <input
                type="email"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ananya.sharma@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-label-sm text-label-sm uppercase text-outline block mb-1">Phone</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (555) 234-8902"
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm uppercase text-outline block mb-1">Location</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="San Francisco, CA"
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm uppercase text-outline block mb-1">Years Experience</label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary"
                value={form.experience_years}
                onChange={(e) => setForm({ ...form, experience_years: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-label-sm text-label-sm uppercase text-outline block mb-1">Academic Degree</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
                placeholder="B.Tech Computer Science"
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm uppercase text-outline block mb-1">Current Target Role</label>
              <input
                type="text"
                className="w-full px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md border border-outline-variant/40 focus:outline-none focus:ring-1 focus:ring-secondary"
                value={form.current_role}
                onChange={(e) => setForm({ ...form, current_role: e.target.value })}
                placeholder="Fresher / Software Engineer"
              />
            </div>
          </div>

          {/* Skills Management */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md font-semibold text-on-surface">Technical Skills *</label>
              <span className="font-code-metric text-label-sm text-outline">{form.skills.length} skills added</span>
            </div>
            <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-surface-container-low min-h-12 border border-outline-variant/40">
              {form.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-sm font-semibold shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
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
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="text-secondary hover:underline font-label-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Projects Portfolio */}
          <div className="space-y-3">
            <label className="font-label-md text-label-md font-semibold text-on-surface block">
              Verified Project Artifacts &amp; Evidence
            </label>
            <div className="space-y-2">
              {form.projects.map((proj, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-surface-container-low flex items-start justify-between border border-outline-variant/30">
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-body-md text-on-surface font-semibold">{proj.title}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{proj.description}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveProject(idx)}
                    className="text-outline hover:text-error p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Inline add project form */}
            <div className="p-3 rounded-lg bg-surface-container space-y-2 border border-outline-variant/40">
              <input
                type="text"
                placeholder="Project Title (e.g. Student Management System)"
                className="w-full px-3 py-1 rounded bg-surface-container-lowest text-on-surface text-body-sm focus:outline-none"
                value={projectInput.title}
                onChange={(e) => setProjectInput({ ...projectInput, title: e.target.value })}
              />
              <textarea
                placeholder="Project Description & Evidence (e.g. Student Management System using Python and SQL schema design.)"
                className="w-full px-3 py-1 rounded bg-surface-container-lowest text-on-surface text-body-sm focus:outline-none h-16"
                value={projectInput.description}
                onChange={(e) => setProjectInput({ ...projectInput, description: e.target.value })}
              />
              <button
                type="button"
                onClick={handleAddProject}
                className="px-3 py-1 rounded bg-secondary text-on-secondary font-label-sm text-label-sm"
              >
                + Add Project Artifact
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-surface-container">
            <button
              type="button"
              onClick={() => navigate(`/skillsight-ai?candidate_id=${selectedCandidateId}`)}
              className="text-secondary hover:underline font-label-md"
            >
              Run SkillSight AI Evaluation →
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-on-primary hover:bg-inverse-surface transition-colors font-label-md text-label-md shadow-sm disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-base">save</span>
              <span>{saving ? 'Saving...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
