import React from 'react';
import { useLedger } from '../../context/LedgerContext';
import { DashboardIcon, LedgerIcon, CompanyIcon, ReportIcon, SettingsIcon, SaveIcon, TrashIcon, DownloadIcon, LockIcon, LogoutIcon, SearchIcon, HomeIcon, ChartIcon, PdfIcon, MoneyIcon } from '../icons';


export default function Login() {
    const { loginUser, setLoginUser, loginPass, setLoginPass, loginError, handleLogin } = useLedger();

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
                      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200/60 text-center">
                          <div className="flex justify-center mb-2"><div className="p-4 bg-indigo-50 rounded-2xl"><LockIcon /></div></div>
                          <h1 className="text-2xl font-black text-slate-900 tracking-tight">NEETHI MEDICALS</h1>
                          <p className="text-slate-400 mt-1 mb-8 text-sm font-medium">Enterprise Management System</p>
                          {loginError && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium">{loginError}</div>}
                          <form onSubmit={handleLogin} className="space-y-4">
                              <div className="text-left"><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username</label><input type="text" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl" placeholder="admin" required/></div>
                              <div className="text-left mb-6"><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label><input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border rounded-xl" placeholder="••••••••" required/></div>
                              <button type="submit" className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg">Secure Log In</button>
                          </form>
                      </div>
                  </div>
    );
}
