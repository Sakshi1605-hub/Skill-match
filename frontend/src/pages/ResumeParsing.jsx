import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResumeFile } from '../api/client';

export default function ResumeParsing() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [parsedResult, setParsedResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    setError(null);
    const validExtensions = ['.pdf', '.docx', '.txt'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(ext)) {
      setError(`Invalid format "${ext}". Supported document types: PDF, DOCX, TXT.`);
      setSelectedFile(null);
      return;
    }

    if (file.size === 0) {
      setError('File is 0 bytes. Please select a valid document.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('File exceeds maximum size limit of 15MB.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please choose or drag a resume file first.');
      return;
    }
    try {
      setUploading(true);
      setError(null);
      const res = await uploadResumeFile(selectedFile);
      setParsedResult(res);
    } catch (err) {
      setError(err.message || 'Failed to parse resume document.');
    } finally {
      setUploading(false);
    }
  };

  // Generate instant sample TXT resume
  const handleLoadSampleResume = () => {
    const content = `Ananya Sharma
Email: ananya.sharma@example.com
Phone: +1 (555) 234-8902
Location: San Francisco, CA

Education:
B.Tech Computer Science · Class of 2024
GPA: 3.8/4.0

Technical Skills:
Python, Java, SQL, JavaScript, HTML, CSS, Git

Projects:
1. Student Management System
Designed a relational Student Management System using Python and SQL database schema design.

2. Weather Forecast App
Built a responsive Weather Forecast App using JavaScript and APIs.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], 'Ananya_Sharma_Resume.txt', { type: 'text/plain' });
    validateAndSetFile(file);
  };

  return (
    <div className="flex flex-col w-full pb-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-surface-container-lowest shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-code-metric text-label-sm text-outline px-2 py-0.5 rounded bg-surface-container">
              MODULE M-02
            </span>
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">Multi-Format Resume Parser</h1>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-2xl">
            Ingest PDF, DOCX, and TXT candidate documents with deterministic entity extraction, skill mapping, and OCR fallback.
          </p>
        </div>
        <button
          onClick={handleLoadSampleResume}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md shrink-0"
          type="button"
        >
          <span className="material-symbols-outlined text-base">description</span>
          <span>Load Sample Resume</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-space-md rounded-xl bg-error-container text-on-error-container flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            <span className="font-body-md font-medium">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="font-label-sm uppercase hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Upload Candidate Resume</h2>
            <p className="font-body-sm text-body-sm text-outline mb-4">
              Supported formats: .PDF (vector or scanned), .DOCX (Microsoft Word), .TXT (plain text).
            </p>

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center transition-all ${
                dragActive
                  ? 'border-secondary bg-secondary/5'
                  : 'border-outline-variant/60 bg-surface-container-low hover:border-secondary/60'
              }`}
            >
              <div className="w-14 h-14 rounded-full bg-surface-container-highest flex items-center justify-center text-secondary mb-3">
                <span className="material-symbols-outlined text-3xl">upload_file</span>
              </div>
              <p className="font-headline-sm text-body-md text-on-surface font-semibold mb-1">
                Drag &amp; drop candidate resume here
              </p>
              <span className="font-body-sm text-body-sm text-outline mb-4">or click to browse your computer</span>
              <label className="cursor-pointer px-4 py-2 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container font-label-md text-label-md transition-colors shadow-sm">
                <span>Browse Files</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* Selected File Card */}
          {selectedFile && (
            <div className="p-3.5 rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/40">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-2xl">description</span>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-body-md text-on-surface font-semibold">{selectedFile.name}</span>
                  <span className="font-code-metric text-label-sm text-outline">
                    {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.name.split('.').pop().toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-outline hover:text-error p-1"
                title="Remove file"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-inverse-surface disabled:opacity-50 transition-colors font-label-md text-label-md shadow-sm"
            type="button"
          >
            <span className="material-symbols-outlined text-base">
              {uploading ? 'sync' : 'document_scanner'}
            </span>
            <span>{uploading ? 'Parsing Resume Stream...' : 'Parse & Extract Profile'}</span>
          </button>
        </div>

        {/* Parsed Result View */}
        <div className="lg:col-span-6 bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-surface-container pb-3 mb-4">
              <h2 className="font-headline-md text-headline-md text-on-surface">Extraction Telemetry</h2>
              <span className="font-code-metric text-label-sm px-2.5 py-0.5 rounded bg-surface-container text-on-surface">
                {parsedResult ? 'Parsed Status: 200 OK' : 'Awaiting Ingestion'}
              </span>
            </div>

            {parsedResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-code-score text-body-lg font-bold">
                      {parsedResult.candidate_name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('') || 'CA'}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                        {parsedResult.candidate_name}
                      </h3>
                      <span className="font-code-metric text-label-sm text-outline">
                        ID: {parsedResult.parsed_candidate_id}
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#ECFDF5] text-[#065F46] font-code-metric text-label-sm font-semibold">
                    100% Parsed
                  </span>
                </div>

                {/* Detected Skills */}
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline block mb-2">
                    Extracted Technical Skills ({parsedResult.detected_skills?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-lg bg-surface-container-low border border-outline-variant/30">
                    {(parsedResult.detected_skills || []).map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface font-label-sm font-semibold shadow-sm flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-surface-container text-body-sm text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
                  <span>Document ingested into Candidate Registry and ready for deterministic match calibration.</span>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center flex flex-col items-center justify-center text-outline">
                <span className="material-symbols-outlined text-5xl mb-2 text-outline-variant">
                  inventory_2
                </span>
                <p className="font-body-md text-body-md">No document parsed in current session.</p>
                <span className="font-body-sm text-body-sm text-outline">Upload a resume to inspect extracted attributes.</span>
              </div>
            )}
          </div>

          {parsedResult && (
            <div className="pt-4 border-t border-surface-container flex items-center justify-end gap-3">
              <button
                onClick={() => navigate(`/skillsight-ai?candidate_id=${parsedResult.parsed_candidate_id}`)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-secondary text-on-secondary hover:bg-secondary-container transition-colors font-label-md text-label-md shadow-sm"
                type="button"
              >
                <span>Launch SkillSight AI Match</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
