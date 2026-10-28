import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ onSearch, currentSearch = '' }) {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('recruiter');
  const [searchValue, setSearchValue] = useState(currentSearch);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    } else {
      navigate(`/skillsight-ai?q=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-space-lg">
      <div className="flex items-center gap-space-md">
        <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
          <span 
            className="hover:text-on-surface transition-colors cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            Platform
          </span>
          <span className="text-outline-variant">/</span>
          <span className="text-on-surface font-headline-sm">Workspace</span>
        </div>
        
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center ml-space-md">
          <span className="material-symbols-outlined absolute left-space-md text-outline text-base pointer-events-none">
            search
          </span>
          <input
            className="w-72 pl-9 pr-12 py-1.5 rounded-lg bg-surface-container text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-secondary transition-all"
            placeholder="Search candidates, skills, jobs..."
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
          />
          <span className="absolute right-space-sm px-1.5 py-0.5 rounded bg-surface-container-highest text-on-surface-variant font-code-metric text-label-sm pointer-events-none">
            ⌘K
          </span>
        </form>
      </div>

      <div className="flex items-center gap-space-lg">
        {/* Recruiter / Admin Switcher */}
        <div className="flex items-center bg-surface-container-low p-0.5 rounded-lg">
          <button
            className={`px-space-md py-1 rounded font-label-sm text-label-sm transition-colors ${
              viewMode === 'recruiter'
                ? 'text-on-surface bg-surface-container-lowest shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
            onClick={() => setViewMode('recruiter')}
          >
            Recruiter View
          </button>
          <button
            className={`px-space-md py-1 rounded font-label-sm text-label-sm transition-colors ${
              viewMode === 'admin'
                ? 'text-on-surface bg-surface-container-lowest shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
            type="button"
            onClick={() => setViewMode('admin')}
          >
            Admin View
          </button>
        </div>

        {/* Notifications */}
        <button
          className="relative p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          type="button"
          title="Notifications"
        >
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error ring-2 ring-surface-container-lowest"></span>
        </button>

        {/* Action Button */}
        <button
          className="flex items-center gap-space-xs px-space-md py-1.5 rounded-lg bg-primary text-on-primary hover:bg-inverse-surface font-label-md text-label-md shadow-sm transition-colors"
          type="button"
          onClick={() => navigate('/profile-builder')}
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>New Evaluation</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-space-sm pl-space-sm">
          <img
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB07-JTmgS2eClS1P2pWXJe9scMCu6Ap_nideXNlytbVD_VbbRhwaGxWnG-39fVXZj_AhxLPu8Y9u59Haxywx1l3AEjWE2wDgNFcSbAEfTiCvLiCFO-qHSy0Qn-KH3etffdDAlN3DaVnCc6VzdNAsN08WZVgZhlL1oHxH765peFNdhT6bvDv4R8FpSdi7jylrcjtHsNhjs6FCTM24f1iAJ3RKWlmAEtNhKpl5KeGt3Lo1mUdr6lRLNT"
            onError={(e) => {
              e.target.src = 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=4b41e1&color=fff';
            }}
          />
          <div className="flex flex-col text-left">
            <span className="font-headline-sm text-label-md text-on-surface leading-tight">Sarah Jenkins</span>
            <span className="font-body-sm text-label-sm text-on-surface-variant leading-tight">Senior Talent Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
}
