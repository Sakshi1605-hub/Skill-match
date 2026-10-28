import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { fetchHealth } from '../../api/client';

export default function Sidebar() {
  const location = useLocation();
  const [engineStatus, setEngineStatus] = useState({ online: true, latency: '38ms' });

  useEffect(() => {
    let isMounted = true;
    async function checkHealth() {
      const start = Date.now();
      try {
        await fetchHealth();
        const latency = Date.now() - start;
        if (isMounted) {
          setEngineStatus({ online: true, latency: `${Math.max(12, latency)}ms` });
        }
      } catch (e) {
        if (isMounted) {
          setEngineStatus({ online: false, latency: 'OFFLINE' });
        }
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: 'dashboard',
      meta: 'Overview',
      isEngine: false,
    },
    {
      to: '/jd-analytics',
      label: 'JD Analytics',
      icon: 'description',
      meta: 'M-01',
      isEngine: false,
    },
    {
      to: '/resume-parsing',
      label: 'Resume Parsing',
      icon: 'document_scanner',
      meta: 'M-02',
      isEngine: false,
    },
    {
      to: '/profile-builder',
      label: 'Profile Builder',
      icon: 'badge',
      meta: 'M-03',
      isEngine: false,
    },
    {
      to: '/talent-check',
      label: 'Talent Check',
      icon: 'verified_user',
      meta: 'M-04',
      isEngine: false,
    },
    {
      to: '/skillsight-ai',
      label: 'SkillSight AI',
      icon: 'psychology',
      meta: 'ENGINE',
      isEngine: true,
      code: 'M-05',
    },
    {
      to: '/candidate-comparison',
      label: 'Candidate Comparison',
      icon: 'compare_arrows',
      meta: null,
      isEngine: false,
    },
    {
      to: '/jobs',
      label: 'Job Directory',
      icon: 'work_outline',
      meta: null,
      isEngine: false,
    },
    {
      to: '/analytics',
      label: 'Analytics & Reports',
      icon: 'insights',
      meta: null,
      isEngine: false,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-primary-container text-on-secondary-container z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-space-sm px-space-lg bg-inverse-surface/40">
          <img
            alt="RADIX Talent Match Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UM6GiF9JqSntAbqMdNaCYEKHCie8a-ZjAcVCM_806d2E4pnYkaTvWoRFE2fbBPXUtm7LDQ8Dt4VF_juP7BFu3ZFE6AU6WGiAycMo6jEvtBFgQ5i5XYmnG5z3IE_3UXneTHtQup-Jklb7yifZlWH9Q0XDdbZnidjoc3-doUU7IShFuvMrta4o6UYyVvl49GbkctQqFyGd3hBZuWa0RG5w1Jzw5iBYf7TXceuEfgOUto-Z9MQX_LumbistY"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-surface tracking-tight uppercase">RADIX</span>
              <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-secondary text-on-secondary font-code-metric">v2.4</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-primary-container tracking-wider uppercase">Talent Match</span>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-space-md py-space-sm">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline px-space-sm">Platform Modules</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-0.5 px-space-sm">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to === '/dashboard' && location.pathname === '/');

            if (item.isEngine) {
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-between px-space-md py-space-sm rounded-lg transition-colors ${
                    isActive
                      ? 'bg-secondary text-on-secondary font-headline-sm shadow-sm'
                      : 'text-surface bg-inverse-surface/60 hover:bg-inverse-surface'
                  }`}
                >
                  <div className="flex items-center gap-space-md">
                    <span className="material-symbols-outlined text-base text-tertiary-fixed-dim">psychology</span>
                    <span className={`font-headline-sm text-body-md ${isActive ? 'text-on-secondary' : 'text-surface'}`}>
                      {item.label}
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-code-metric">
                    ENGINE
                  </span>
                </NavLink>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center justify-between px-space-md py-space-sm rounded-lg transition-colors ${
                  isActive
                    ? 'bg-secondary text-on-secondary font-headline-sm shadow-sm'
                    : 'text-on-primary-container hover:bg-inverse-surface hover:text-surface'
                }`}
              >
                <div className="flex items-center gap-space-md">
                  <span className="material-symbols-outlined text-base">{item.icon}</span>
                  <span className="font-body-md text-body-md">{item.label}</span>
                </div>
                {item.meta && (
                  <span
                    className={`font-label-sm text-label-sm ${
                      isActive ? 'text-on-secondary/80' : 'text-outline font-code-metric'
                    }`}
                  >
                    {item.meta}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer System Telemetry & Links */}
      <div className="flex flex-col gap-space-sm p-space-md bg-inverse-surface/30">
        <div className="flex items-center justify-between px-space-sm py-1.5 rounded-lg bg-primary-container/80">
          <div className="flex items-center gap-space-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                engineStatus.online ? 'bg-tertiary-fixed-dim animate-pulse' : 'bg-error'
              }`}
            ></span>
            <span className="font-label-sm text-label-sm text-surface">
              {engineStatus.online ? 'Engines Online' : 'Backend Offline'}
            </span>
          </div>
          <span className="font-code-metric text-code-metric text-outline-variant">
            {engineStatus.latency}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <a
            className="flex items-center gap-space-md px-space-sm py-1.5 rounded-lg text-on-primary-container hover:bg-inverse-surface hover:text-surface transition-colors"
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="material-symbols-outlined text-base">terminal</span>
            <span className="font-body-sm text-body-sm">Documentation &amp; API</span>
          </a>
          <NavLink
            to="/settings"
            className="flex items-center gap-space-md px-space-sm py-1.5 rounded-lg text-on-primary-container hover:bg-inverse-surface hover:text-surface transition-colors"
          >
            <span className="material-symbols-outlined text-base">settings</span>
            <span className="font-body-sm text-body-sm">Settings &amp; Team</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
