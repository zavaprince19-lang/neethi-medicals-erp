import React from 'react';
import { useLedger } from '../../context/LedgerContext';
import { DashboardIcon, LedgerIcon, CompanyIcon, ReportIcon, SettingsIcon, SaveIcon, TrashIcon, DownloadIcon, LockIcon, LogoutIcon, SearchIcon, HomeIcon, ChartIcon, PdfIcon, MoneyIcon } from '../icons';
import LedgerChart from '../LedgerChart';

export default function Dashboard() {
    const { transactions, openingBalance, date, particulars, liabilityAmount, saleAmount, formatDate, totalPurchases, totalLiability, totalSales, currentBalance } = useLedger();

    return (
        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                              <div className="bg-white p-6 rounded-2xl shadow-sm border"><h3 className="text-xs font-bold text-slate-400 uppercase">Purchased Goods</h3><p className="text-2xl font-black text-blue-600 mt-2">₹{totalPurchases.toLocaleString('en-IN')}</p></div>
                              <div className="bg-white p-6 rounded-2xl shadow-sm border"><h3 className="text-xs font-bold text-slate-400 uppercase">Supplier Liabilities</h3><p className="text-2xl font-black text-red-600 mt-2">₹{totalLiability.toLocaleString('en-IN')}</p></div>
                              <div className="bg-white p-6 rounded-2xl shadow-sm border"><h3 className="text-xs font-bold text-slate-400 uppercase">Combined Sales</h3><p className="text-2xl font-black text-emerald-600 mt-2">₹{totalSales.toLocaleString('en-IN')}</p></div>
                              <div className="bg-slate-900 p-6 rounded-2xl shadow-lg border"><h3 className="text-xs font-bold text-slate-400 uppercase">Liability Balance</h3><p className="text-3xl font-black text-white mt-2">₹{currentBalance.toLocaleString('en-IN')}</p></div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border lg:col-span-2"><h3 className="text-sm font-bold mb-4">Financial Volume Trend</h3><LedgerChart transactions={transactions} openingBalance={openingBalance} /></div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border lg:col-span-1 flex flex-col"><h3 className="text-sm font-bold mb-4">Recent Actions</h3>
                                    <div className="flex-1 divide-y overflow-y-auto space-y-3">
                                        {transactions.slice(-6).reverse().map((t, idx) => (
                                            <div key={idx} className="pt-3 flex items-center justify-between text-xs">
                                                <div><p className="font-bold capitalize">{t.particulars}</p><span className="text-[10px] text-slate-400">{formatDate(t.date)}</span></div>
                                                <span className={`font-bold ${t.saleAmount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{t.saleAmount > 0 ? `- ₹${t.saleAmount}` : `+ ₹${t.liabilityAmount}`}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
    );
}
