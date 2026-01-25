
import React, { useState } from 'react';
import { SECTIONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: string;
  setActiveSection: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeSection, setActiveSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white fixed h-full z-20">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <i className="fas fa-infinity text-blue-400"></i>
            <span>DevOps Hub</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-4 mt-6">
          <ul className="space-y-2">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === section.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <i className={`fas ${section.icon} w-5 text-center`}></i>
                  <span className="font-medium">{section.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          Expertise DevOps Pro &copy; 2024
        </div>
      </aside>

      {/* Header - Mobile */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-30">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <i className="fas fa-infinity text-blue-400"></i>
          <span>DevOps Hub</span>
        </h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900 z-20 flex flex-col pt-20 px-6">
          <ul className="space-y-4">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => {
                    setActiveSection(section.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-lg ${
                    activeSection === section.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-400 border border-slate-800'
                  }`}
                >
                  <i className={`fas ${section.icon} w-6`}></i>
                  <span>{section.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto p-4 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
