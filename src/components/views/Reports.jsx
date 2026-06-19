import React from 'react';
import { useLedger } from '../../context/LedgerContext';
import { DashboardIcon, LedgerIcon, CompanyIcon, ReportIcon, SettingsIcon, SaveIcon, TrashIcon, DownloadIcon, LockIcon, LogoutIcon, SearchIcon, HomeIcon, ChartIcon, PdfIcon, MoneyIcon } from '../icons';


export default function Reports() {
    const { date, reportStartDate, setReportStartDate, reportEndDate, setReportEndDate, reportData, exportReportToPDF } = useLedger();

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-indigo-100">
                          <div className="flex flex-col md:flex-row justify-between mb-6 border-b pb-4">
                              <h2 className="text-xl font-bold flex items-center"><ReportIcon /> Dynamic Reports</h2>
                              <div className="flex gap-4 items-end mt-4 md:mt-0">
                                  <div><label className="block text-xs font-medium mb-1">Start Date</label><input type="date" value={reportStartDate} onChange={(e) => setReportStartDate(e.target.value)} className="px-3 py-1.5 border rounded-md text-sm" /></div>
                                  <div><label className="block text-xs font-medium mb-1">End Date</label><input type="date" value={reportEndDate} onChange={(e) => setReportEndDate(e.target.value)} className="px-3 py-1.5 border rounded-md text-sm" /></div>
                                  <button onClick={exportReportToPDF} className="flex items-center px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl"><DownloadIcon /> Export PDF</button>
                              </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                              <div className="bg-slate-50 p-4 rounded-xl border"><p className="text-xs font-bold uppercase mb-1">Cash Sale</p><p className="text-lg font-bold">₹{reportData.totalCashSale.toLocaleString('en-IN')}</p></div>
                              <div className="bg-slate-50 p-4 rounded-xl border"><p className="text-xs font-bold uppercase mb-1">UPI Sale</p><p className="text-lg font-bold">₹{reportData.totalUpiSale.toLocaleString('en-IN')}</p></div>
                              <div className="bg-emerald-50 p-4 rounded-xl border"><p className="text-xs font-bold uppercase mb-1 text-emerald-700">Total Sales</p><p className="text-xl font-bold text-emerald-800">₹{reportData.totalCombinedSales.toLocaleString('en-IN')}</p></div>
                              <div className="bg-blue-50 p-4 rounded-xl border"><p className="text-xs font-bold uppercase mb-1 text-blue-700">Goods Purchase</p><p className="text-xl font-bold text-blue-800">₹{reportData.totalPurchaseValue.toLocaleString('en-IN')}</p></div>
                              <div className="bg-purple-50 p-4 rounded-xl border"><p className="text-xs font-bold uppercase mb-1 text-purple-700">Purchase Returns</p><p className="text-xl font-bold text-purple-800">₹{reportData.totalPurchaseReturn.toLocaleString('en-IN')}</p></div>
                          </div>
                          <div>
                              <h3 className="text-sm font-bold uppercase mb-3">Company-Wise Bill Outstanding</h3>
                              <div className="overflow-x-auto border rounded-lg">
                                  <table className="w-full text-left text-sm">
                                      <thead className="bg-slate-50 font-bold border-b"><tr><th className="px-4 py-3">Company</th><th className="px-4 py-3 text-right">Bills(+)</th><th className="px-4 py-3 text-right">Pay(-)</th><th className="px-4 py-3 text-right">Outstanding</th></tr></thead>
                                      <tbody className="divide-y">
                                          {reportData.companyStats.map((c, i) => (
                                              <tr key={i} className="hover:bg-slate-50"><td className="px-4 py-3 font-bold capitalize">{c.name}</td><td className="px-4 py-3 text-right text-red-600">{c.bills.toLocaleString('en-IN')}</td><td className="px-4 py-3 text-right text-emerald-600">{c.returnsPayments.toLocaleString('en-IN')}</td><td className="px-4 py-3 text-right font-black">{c.netOutstanding.toLocaleString('en-IN')}</td></tr>
                                          ))}
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                        </div>
    );
}
