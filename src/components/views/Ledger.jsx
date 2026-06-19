import React from 'react';
import { useLedger } from '../../context/LedgerContext';
import { DashboardIcon, LedgerIcon, CompanyIcon, ReportIcon, SettingsIcon, SaveIcon, TrashIcon, DownloadIcon, LockIcon, LogoutIcon, SearchIcon, HomeIcon, ChartIcon, PdfIcon, MoneyIcon } from '../icons';


export default function Ledger() {
    const { date, setDate, particulars, setParticulars, pivNo, setPivNo, purchaseValue, setPurchaseValue, liabilityAmount, setLiabilityAmount, saleAmount, setSaleAmount, searchTerm, setSearchTerm, filterType, setFilterType, currentPage, setCurrentPage, knownCompanies, formatDate, paginatedLedger, totalPages, handleSubmit, handleDelete } = useLedger();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-6">
                              <h2 className="text-sm font-bold uppercase mb-5 flex items-center"><SaveIcon /> New Entry</h2>
                              <form onSubmit={handleSubmit} className="space-y-4">
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label><input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">Particulars</label><input type="text" required list="part-ops" value={particulars} onChange={(e) => setParticulars(e.target.value)} className="w-full px-4 py-2 border rounded-lg uppercase" />
                                  <datalist id="part-ops"><option value="cash" /><option value="upi" />{knownCompanies.map(c => <React.Fragment key={c}><option value={c} /><option value={`${c} purchase return`} /></React.Fragment>)}</datalist>
                                </div>
                                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1">PIV No.</label><input type="text" value={pivNo} onChange={(e) => setPivNo(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
                                <hr/>
                                <div className="space-y-3">
                                  <div><label className="block text-xs font-semibold text-blue-600 mb-1">Purchase Value (Info)</label><input type="number" step="0.01" min="0" value={purchaseValue} onChange={(e) => setPurchaseValue(e.target.value)} className="w-full px-3 py-2 border bg-blue-50/20 rounded-lg" /></div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div><label className="block text-[10px] font-bold text-red-600 uppercase mb-1">Liability (+)</label><input type="number" step="0.01" min="0" value={liabilityAmount} onChange={(e) => setLiabilityAmount(e.target.value)} className="w-full px-3 py-2 border bg-red-50/20 rounded-lg" /></div>
                                    <div><label className="block text-[10px] font-bold text-emerald-600 uppercase mb-1">Sales/Pay (-)</label><input type="number" step="0.01" min="0" value={saleAmount} onChange={(e) => setSaleAmount(e.target.value)} className="w-full px-3 py-2 border bg-emerald-50/20 rounded-lg" /></div>
                                  </div>
                                </div>
                                <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md">Post Transaction</button>
                              </form>
                            </div>
                          </div>

                          <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                              <div className="p-5 border-b flex flex-col md:flex-row justify-between bg-slate-50/50">
                                <h2 className="text-sm font-bold uppercase">Transactions</h2>
                                <div className="flex gap-2">
                                    <div className="relative"><span className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><SearchIcon /></span><input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="pl-9 pr-4 py-1.5 w-48 border rounded-xl text-xs" /></div>
                                    <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }} className="px-3 py-1.5 border rounded-xl text-xs"><option value="all">All</option><option value="purchase">Purchases</option><option value="liability">Liabilities</option><option value="sale">Sales</option></select>
                                </div>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                  <thead className="bg-slate-50 text-slate-400 font-bold text-xs uppercase border-b">
                                    <tr><th className="px-6 py-4">Date</th><th className="px-6 py-4">Particulars</th><th className="px-6 py-4">PIV No.</th><th className="px-6 py-4 text-right">Purch(Info)</th><th className="px-6 py-4 text-right">Liab(+)</th><th className="px-6 py-4 text-right">Pay(-)</th><th className="px-6 py-4 text-right">Balance</th><th className="px-6 py-4 text-center">Act</th></tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {paginatedLedger.length === 0 ? (<tr><td colSpan="8" className="px-6 py-12 text-center text-slate-400">No entries found.</td></tr>) : (
                                      paginatedLedger.map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-50/50">
                                          <td className="px-6 py-4 text-xs font-semibold">{formatDate(t.date)}</td>
                                          <td className="px-6 py-4 font-bold capitalize">{t.particulars}</td>
                                          <td className="px-6 py-4 text-slate-400">{t.pivNo || '-'}</td>
                                          <td className="px-6 py-4 text-right text-xs font-bold text-blue-600">{t.purchaseValue ? t.purchaseValue.toLocaleString('en-IN') : ''}</td>
                                          <td className="px-6 py-4 text-right text-xs font-bold text-red-600">{t.liabilityAmount ? t.liabilityAmount.toLocaleString('en-IN') : ''}</td>
                                          <td className="px-6 py-4 text-right text-xs font-bold text-emerald-600">{t.saleAmount ? t.saleAmount.toLocaleString('en-IN') : ''}</td>
                                          <td className="px-6 py-4 text-right font-black">{t.runningBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                          <td className="px-6 py-4 text-center"><button onClick={() => handleDelete(t.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg"><TrashIcon /></button></td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                              {totalPages > 1 && (
                                <div className="p-4 bg-slate-50/80 border-t flex justify-between text-xs">
                                    <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-3 py-1.5 border bg-white rounded-lg disabled:opacity-50">Prev</button>
                                    <span className="font-bold">Page {currentPage} of {totalPages}</span>
                                    <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 border bg-white rounded-lg disabled:opacity-50">Next</button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
    );
}
