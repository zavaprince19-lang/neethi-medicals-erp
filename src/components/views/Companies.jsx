import React from 'react';
import { useLedger } from '../../context/LedgerContext';
import { DashboardIcon, LedgerIcon, CompanyIcon, ReportIcon, SettingsIcon, SaveIcon, TrashIcon, DownloadIcon, LockIcon, LogoutIcon, SearchIcon, HomeIcon, ChartIcon, PdfIcon, MoneyIcon } from '../icons';


export default function Companies() {
    const { date, pivNo, liabilityAmount, saleAmount, setSelectedCompanyName, quickPayCompany, setQuickPayCompany, quickPayAmount, setQuickPayAmount, quickPayDate, setQuickPayDate, quickPayRef, setQuickPayRef, formatDate, companyBalances, handleQuickPaySubmit, activeCompanyDetails } = useLedger();

    return (
        <>
<div className="bg-white p-6 rounded-2xl shadow-sm border">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900">Supplier Ledger & Settlement</h2>
                                    <p className="text-xs text-slate-400 font-semibold mt-1">Track Total Billed, Total Paid, and Settle Outstanding Amounts directly.</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {companyBalances.map((comp, idx) => (
                                    <div key={idx} className="bg-slate-50 p-5 rounded-2xl border hover:border-indigo-200 transition-all flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-black text-slate-900 capitalize text-lg mb-4 border-b border-slate-200 pb-2 flex justify-between items-center">
                                                {comp.name}
                                            </h3>
                                            <div className="space-y-3 text-xs font-semibold mb-6">
                                                <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                                                    <span className="text-slate-500">Total Billed Amount (+):</span>
                                                    <span className="text-red-600 font-bold">₹{comp.bills.toLocaleString('en-IN', {minimumFractionDigits:2})}</span>
                                                </div>
                                                <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                                                    <span className="text-slate-500">Total Paid Amount (-):</span>
                                                    <span className="text-emerald-600 font-bold">₹{comp.returnsPayments.toLocaleString('en-IN', {minimumFractionDigits:2})}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="pt-4 border-t border-slate-200 flex justify-between items-center mb-4">
                                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Active Balance</span>
                                                <p className="text-lg font-black text-slate-900">₹{comp.netOutstanding.toLocaleString('en-IN', {minimumFractionDigits:2})}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setSelectedCompanyName(comp.name)} className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-all">Statements</button>
                                                <button onClick={() => setQuickPayCompany(comp.name)} className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all">
                                                    <MoneyIcon /> Settle Bill
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
{quickPayCompany && (
<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-emerald-100">
                          <div className="p-6 bg-emerald-600 text-white flex justify-between items-center">
                              <div>
                                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200">Settle Supplier Bill</span>
                                  <h2 className="text-xl font-black capitalize tracking-tight">{quickPayCompany}</h2>
                              </div>
                              <button onClick={() => setQuickPayCompany(null)} className="text-emerald-200 hover:text-white font-extrabold text-sm">✕</button>
                          </div>
                          
                          <form onSubmit={handleQuickPaySubmit} className="p-6 space-y-4">
                              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-center mb-4">
                                  <p className="text-xs font-bold text-emerald-800 uppercase">Current Outstanding</p>
                                  <p className="text-2xl font-black text-emerald-600">₹{(companyBalances.find(c => c.name === quickPayCompany)?.netOutstanding || 0).toLocaleString('en-IN')}</p>
                              </div>
                              
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Payment Date</label>
                                  <input type="date" required value={quickPayDate} onChange={(e) => setQuickPayDate(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500"/>
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Paid Amount (₹)</label>
                                  <input type="number" step="0.01" min="0" required value={quickPayAmount} onChange={(e) => setQuickPayAmount(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg text-emerald-600 focus:ring-2 focus:ring-emerald-500" placeholder="0.00"/>
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Ref / Cheque No. (Optional)</label>
                                  <input type="text" value={quickPayRef} onChange={(e) => setQuickPayRef(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-emerald-500" placeholder="e.g. UTR / Cash"/>
                              </div>
                              
                              <button type="submit" className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-lg mt-4 transition-all">
                                  Record Payment
                              </button>
                          </form>
                      </div>
                  </div>
)}
{activeCompanyDetails && (
<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border">
                          <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                              <div>
                                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Supplier Ledger Card</span>
                                  <h2 className="text-xl font-black capitalize tracking-tight">{activeCompanyDetails.name} Complete Statement</h2>
                              </div>
                              <button onClick={() => setSelectedCompanyName(null)} className="text-slate-400 hover:text-white font-extrabold text-sm">✕ Close</button>
                          </div>
                          
                          <div className="p-6 grid grid-cols-3 gap-4 border-b bg-slate-50">
                              <div><span className="text-[9px] uppercase font-extrabold text-slate-400">Total Billed (+)</span><p className="text-base font-extrabold text-red-600">₹{activeCompanyDetails.bills.toLocaleString('en-IN', {minimumFractionDigits:2})}</p></div>
                              <div><span className="text-[9px] uppercase font-extrabold text-slate-400">Total Paid (-)</span><p className="text-base font-extrabold text-emerald-600">₹{activeCompanyDetails.returnsPayments.toLocaleString('en-IN', {minimumFractionDigits:2})}</p></div>
                              <div><span className="text-[9px] uppercase font-extrabold text-slate-400">Current Outstanding (=)</span><p className="text-lg font-black">₹{activeCompanyDetails.netOutstanding.toLocaleString('en-IN', {minimumFractionDigits:2})}</p></div>
                          </div>
                          
                          <div className="flex-1 p-6 overflow-y-auto min-h-0">
                              <table className="w-full text-left text-xs">
                                  <thead className="bg-slate-100 font-bold uppercase border-b border-slate-200">
                                      <tr>
                                          <th className="px-4 py-3">Date</th>
                                          <th className="px-4 py-3">Particulars / Ref</th>
                                          <th className="px-4 py-3 text-right">Bill Amt (+)</th>
                                          <th className="px-4 py-3 text-right">Paid Amt (-)</th>
                                          <th className="px-4 py-3 text-right text-indigo-900">Running Bal.</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                      {activeCompanyDetails.txs.map((tx, idx) => (
                                          <tr key={idx} className="hover:bg-slate-50 font-semibold">
                                              <td className="px-4 py-3">{formatDate(tx.date)}</td>
                                              <td className="px-4 py-3 capitalize text-slate-500">{tx.pivNo || 'Settlement'}</td>
                                              <td className="px-4 py-3 text-right text-red-600">{tx.liabilityAmount > 0 ? `₹${tx.liabilityAmount.toLocaleString('en-IN')}` : '-'}</td>
                                              <td className="px-4 py-3 text-right text-emerald-600">{tx.saleAmount > 0 ? `₹${tx.saleAmount.toLocaleString('en-IN')}` : '-'}</td>
                                              <td className="px-4 py-3 text-right font-black text-slate-900">₹{tx.compRunBal.toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
)}
</>
    );
}
