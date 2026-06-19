import React from 'react';
import { useLedger } from '../context/LedgerContext';
import { DashboardIcon, LedgerIcon, CompanyIcon, ReportIcon, SettingsIcon, SaveIcon, TrashIcon, DownloadIcon, LockIcon, LogoutIcon, SearchIcon, HomeIcon, ChartIcon, PdfIcon, MoneyIcon } from './icons';

export default function Sidebar() {
    const { activeTab, setActiveTab, fileHandle, unsavedChangesCount, handleLogout, ledger } = useLedger();

    return (
        <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex-shrink-0 flex flex-col border-r border-slate-800">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-lg font-black text-white">NEETHI MEDICALS</h2>
                    <span className="text-[10px] uppercase font-bold text-indigo-400">Admin Control ERP</span>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1.5">
                    <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}><DashboardIcon /> Dashboard</button>
                    <button onClick={() => setActiveTab('ledger')} className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl ${activeTab === 'ledger' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}><LedgerIcon /> Ledger Entry</button>
                    <button onClick={() => setActiveTab('companies')} className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl ${activeTab === 'companies' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}><CompanyIcon /> Supplier Directory</button>
                    <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl ${activeTab === 'reports' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}><ReportIcon /> Financial Reports</button>
                    <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl ${activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}><SettingsIcon /> ERP Settings</button>
                </nav>
                <div className="p-4 border-t border-slate-800 space-y-3">
                    {unsavedChangesCount > 0 && !fileHandle && <div className="p-3 bg-amber-500/10 rounded-xl text-center"><p className="text-[11px] text-amber-400 font-medium">⚠️ {unsavedChangesCount} unsaved records!</p></div>}
                    <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2.5 text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-600 hover:text-white rounded-xl"><LogoutIcon /> Log Out</button>
                </div>
              </aside>
    );
}
