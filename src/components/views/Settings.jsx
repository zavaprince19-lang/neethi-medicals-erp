import React from 'react';
import { useLedger } from '../../context/LedgerContext';
import { DashboardIcon, LedgerIcon, CompanyIcon, ReportIcon, SettingsIcon, SaveIcon, TrashIcon, DownloadIcon, LockIcon, LogoutIcon, SearchIcon, HomeIcon, ChartIcon, PdfIcon, MoneyIcon } from '../icons';


export default function Settings() {
    const { newOpeningBalance, setNewOpeningBalance, resetCurrentPass, setResetCurrentPass, resetNewPass, setResetNewPass, resetConfirmPass, setResetConfirmPass, resetMessage, excelSheets, selectedSheet, setSelectedSheet, handleUpdateBalance, handlePasswordReset, handleClearData, handleFileUpload, importSelectedSheet } = useLedger();

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-6">
                            <div>
                                <h2 className="text-lg font-bold mb-4">Ledger Initialization</h2>
                                <form onSubmit={handleUpdateBalance} className="flex gap-4 items-end">
                                  <div><label className="block text-xs font-bold uppercase mb-1">Opening Balance (₹)</label><input type="number" step="0.01" value={newOpeningBalance} onChange={(e) => setNewOpeningBalance(e.target.value)} className="w-64 px-4 py-2 border rounded-lg" /></div>
                                  <button type="submit" className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg">Update</button>
                                </form>
                            </div>
                            <hr />
                            <div>
                                <h2 className="text-lg font-bold mb-2">Bulk Upload (Excel / CSV)</h2>
                                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="block w-full text-sm py-2 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 cursor-pointer" />
                                {excelSheets.length > 0 && (
                                    <div className="mt-4 bg-indigo-50 p-4 rounded-xl border max-w-md">
                                        <label className="block text-xs font-extrabold uppercase mb-2">Select Sheet:</label>
                                        <select value={selectedSheet} onChange={(e) => setSelectedSheet(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm mb-3">
                                            <option value="">-- Choose a sheet --</option>{excelSheets.map(n => <option key={n} value={n}>{n}</option>)}
                                        </select>
                                        <button onClick={importSelectedSheet} disabled={!selectedSheet} className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg">Import Data</button>
                                    </div>
                                )}
                            </div>
                            <hr />
                            <div>
                                <h2 className="text-lg font-bold mb-2">Change Admin Password</h2>
                                {resetMessage && <div className={`mb-4 p-3 text-sm rounded-lg border ${resetMessage.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{resetMessage.text}</div>}
                                <form onSubmit={handlePasswordReset} className="space-y-3 max-w-sm">
                                    <input type="password" placeholder="Current Password" value={resetCurrentPass} onChange={(e) => setResetCurrentPass(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                                    <input type="password" placeholder="New Password" value={resetNewPass} onChange={(e) => setResetNewPass(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                                    <input type="password" placeholder="Confirm New Password" value={resetConfirmPass} onChange={(e) => setResetConfirmPass(e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                                    <button type="submit" className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg">Update Password</button>
                                </form>
                            </div>
                            <hr />
                            <div>
                                <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
                                <button onClick={handleClearData} className="px-4 py-2 text-xs font-bold bg-red-100 text-red-700 rounded-lg">Clear All Data</button>
                            </div>
                        </div>
    );
}
