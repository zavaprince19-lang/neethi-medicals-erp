import React from 'react';
import { useLedger } from '../context/LedgerContext';
import { DashboardIcon, LedgerIcon, CompanyIcon, ReportIcon, SettingsIcon, SaveIcon, TrashIcon, DownloadIcon, LockIcon, LogoutIcon, SearchIcon, HomeIcon, ChartIcon, PdfIcon, MoneyIcon } from './icons';

export default function Topbar() {
    const { activeTab, fileHandle, autoSaveStatus, connectDesktopFile, exportToCSV } = useLedger();

    return (
        <header className="bg-white border-b px-8 py-5 flex flex-col sm:flex-row sm:justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-black text-slate-950 capitalize">{activeTab} WorkSpace</h1>
                    <p className="text-xs text-slate-400 font-semibold">Ledger & Supplier Outstanding ERP Suite</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">{autoSaveStatus}</span>
                    {!fileHandle && <button onClick={connectDesktopFile} className="flex items-center px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 border rounded-xl"><SaveIcon /> Link Desktop CSV</button>}
                    <button onClick={exportToCSV} className="flex items-center px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl"><DownloadIcon /> Manual Backup</button>
                  </div>
                </header>
    );
}
