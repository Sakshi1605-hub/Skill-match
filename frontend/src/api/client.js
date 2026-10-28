const API_BASE = '/api';

/**
 * Standard fetch helper with JSON parsing and standardized error handling.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      let errorMsg = `Server responded with ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData.detail) {
          errorMsg = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
        }
      } catch (e) {
        // Not JSON
      }
      throw new Error(errorMsg);
    }
    return await res.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
      throw new Error('SkillSight Backend API is offline. Ensure FastAPI is running on port 8000.');
    }
    throw err;
  }
}

// --- Jobs API ---
export async function fetchJobs() {
  return request('/jobs');
}

export async function fetchJob(jobId) {
  return request(`/jobs/${jobId}`);
}

export async function createJob(jobData) {
  return request('/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });
}

export async function analyzeJDText(rawText) {
  return request('/jobs/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw_text: rawText }),
  });
}

// --- Candidates API ---
export async function fetchCandidates() {
  return request('/candidates');
}

export async function fetchCandidate(candidateId) {
  return request(`/candidates/${candidateId}`);
}

export async function createCandidate(candidateData) {
  return request('/candidates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(candidateData),
  });
}

// --- Resumes API ---
export async function uploadResumeFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  return request('/resumes/upload', {
    method: 'POST',
    body: formData,
  });
}

// --- SkillSight AI Matching & Simulator API ---
export async function calculateMatch(candidateId, jobId, requiredWeight = 0.70, preferredWeight = 0.30) {
  return request('/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      candidate_id: candidateId,
      job_id: jobId,
      required_weight: requiredWeight,
      preferred_weight: preferredWeight,
    }),
  });
}

export async function runSimulation(candidateId, jobId, simulatedSkills) {
  return request('/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      candidate_id: candidateId,
      job_id: jobId,
      simulated_skills: simulatedSkills,
    }),
  });
}

// --- Recommendations API ---
export async function fetchRecommendations(candidateId, jobId = null) {
  const query = jobId ? `?job_id=${encodeURIComponent(jobId)}` : '';
  return request(`/recommendations/${candidateId}${query}`);
}

// --- Talent Check API ---
export async function runTalentCheck(candidateId, jobId) {
  return request('/talent-check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      candidate_id: candidateId,
      job_id: jobId,
    }),
  });
}

// --- Dashboard & Health API ---
export async function fetchDashboardStats() {
  return request('/dashboard/stats');
}

export async function fetchHealth() {
  return request('/health');
}
