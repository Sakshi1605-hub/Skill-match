import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children, onSearch, currentSearch }) {
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased min-h-screen">
      <Sidebar />
      <div className="pl-64">
        <Header onSearch={onSearch} currentSearch={currentSearch} />
        <main className="w-full pt-16 bg-surface px-space-lg min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
