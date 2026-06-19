import React, { createContext, useState, useEffect, useMemo, useContext, useRef } from 'react';
import * as XLSX from 'xlsx';
import Chart from 'chart.js/auto';

const LedgerContext = createContext();

export const LedgerProvider = ({ children }) => {

          const [activeTab, setActiveTab] = useState('dashboard');
          const [isAuthenticated, setIsAuthenticated] = useState(false);
          const [loginUser, setLoginUser] = useState('');
          const [loginPass, setLoginPass] = useState('');
          const [loginError, setLoginError] = useState('');

          const [transactions, setTransactions] = useState([]);
          const [openingBalance, setOpeningBalance] = useState(0);
          
          const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
          const [particulars, setParticulars] = useState('');
          const [pivNo, setPivNo] = useState('');
          const [purchaseValue, setPurchaseValue] = useState('');
          const [liabilityAmount, setLiabilityAmount] = useState('');
          const [saleAmount, setSaleAmount] = useState('');

          const [searchTerm, setSearchTerm] = useState('');
          const [filterType, setFilterType] = useState('all');
          const [currentPage, setCurrentPage] = useState(1);
          const rowsPerPage = 50;

          const [newOpeningBalance, setNewOpeningBalance] = useState('');
          const [resetCurrentPass, setResetCurrentPass] = useState('');
          const [resetNewPass, setResetNewPass] = useState('');
          const [resetConfirmPass, setResetConfirmPass] = useState('');
          const [resetMessage, setResetMessage] = useState(null);

          const [excelWorkbook, setExcelWorkbook] = useState(null);
          const [excelSheets, setExcelSheets] = useState([]);
          const [selectedSheet, setSelectedSheet] = useState('');
          
          const currDate = new Date();
          const firstDay = new Date(currDate.getFullYear(), currDate.getMonth(), 1).toISOString().split('T')[0];
          const [reportStartDate, setReportStartDate] = useState(firstDay);
          const [reportEndDate, setReportEndDate] = useState(currDate.toISOString().split('T')[0]);

          /* --- Settlement & Company State --- */
          const [selectedCompanyName, setSelectedCompanyName] = useState(null);
          
          const [quickPayCompany, setQuickPayCompany] = useState(null);
          const [quickPayAmount, setQuickPayAmount] = useState('');
          const [quickPayDate, setQuickPayDate] = useState(new Date().toISOString().split('T')[0]);
          const [quickPayRef, setQuickPayRef] = useState('');

          const [fileHandle, setFileHandle] = useState(null);
          const [autoSaveStatus, setAutoSaveStatus] = useState('Not connected to Desktop');
          const [unsavedChangesCount, setUnsavedChangesCount] = useState(0);

          const knownCompanies = ["bruklyn", "abn", "medibest", "varghesesco", "varghese", "zedwell", "relife pharma", "relife", "anandha", "neethi ekm", "jaison", "classic", "clasic", "tdh", "veena", "southern", "green specialities", "intimate", "new life", "jb pharma", "sabari", "neethi ktm", "jaycee pharma", "zedwell distributor"];

          useEffect(() => {
            if(sessionStorage.getItem('neethi_auth') === 'true') setIsAuthenticated(true);
          }, []);

          useEffect(() => {
            if (isAuthenticated) {
                const savedTransactions = localStorage.getItem('neethi_transactions');
                const savedBalance = localStorage.getItem('neethi_opening_balance');
                if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
                if (savedBalance) {
                  setOpeningBalance(parseFloat(savedBalance));
                  setNewOpeningBalance(savedBalance);
                }
            }
          }, [isAuthenticated]);

          useEffect(() => {
            if (isAuthenticated) {
                localStorage.setItem('neethi_transactions', JSON.stringify(transactions));
                localStorage.setItem('neethi_opening_balance', openingBalance.toString());
            }
          }, [transactions, openingBalance, isAuthenticated]);

          const handleLogin = (e) => {
            e.preventDefault();
            const correctUsername = "admin";
            const correctPassword = localStorage.getItem('neethi_admin_pass') || "admin123";
            if (loginUser === correctUsername && loginPass === correctPassword) {
                setIsAuthenticated(true);
                setLoginError('');
                sessionStorage.setItem('neethi_auth', 'true');
            } else {
                setLoginError('Invalid username or password.');
            }
          };

          const handleLogout = () => {
              setIsAuthenticated(false);
              setLoginUser('');
              setLoginPass('');
              sessionStorage.removeItem('neethi_auth');
          };

          const roundToTwo = (num) => Math.round(num * 100) / 100;

          const formatDate = (dateStr) => {
              if (!dateStr) return '';
              if (dateStr.includes('-')) {
                  const [y, m, d] = dateStr.split('-');
                  if (y.length === 4) return `${d}-${m}-${y}`;
              }
              return dateStr;
          };

          const parseDateString = (dateStr) => {
              if (!dateStr) return '';
              if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
              const parts = String(dateStr).trim().split(/[-/ ]+/);
              if (parts.length === 3) {
                  if (parts[2].length === 4) return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                  if (parts[0].length === 4) return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
              }
              return dateStr;
          };

          const parseExcelDate = (val) => {
              if (val instanceof Date) return val.toISOString().split('T')[0];
              if (typeof val === 'number' && val > 30000 && val < 60000) {
                  const date = new Date((val - 25569) * 86400 * 1000);
                  return date.toISOString().split('T')[0];
              }
              return parseDateString(String(val));
          };

          const ledger = useMemo(() => {
            const sorted = [...transactions].sort((a, b) => {
              if (a.date === b.date) return a.timestamp - b.timestamp;
              return new Date(a.date) - new Date(b.date);
            });
            let currentBalance = openingBalance;
            return sorted.map(t => {
              const liab = t.liabilityAmount || 0;
              const sale = t.saleAmount || 0;
              currentBalance = roundToTwo(currentBalance + liab - sale);
              return { ...t, runningBalance: currentBalance };
            });
          }, [transactions, openingBalance]);

          const filteredLedger = useMemo(() => {
              return ledger.filter(t => {
                  const matchesSearch = t.particulars.toLowerCase().includes(searchTerm.toLowerCase()) || (t.pivNo && t.pivNo.includes(searchTerm));
                  if (!matchesSearch) return false;
                  if (filterType === 'all') return true;
                  if (filterType === 'purchase') return t.purchaseValue > 0;
                  if (filterType === 'liability') return t.liabilityAmount > 0;
                  if (filterType === 'sale') return t.saleAmount > 0;
                  return true;
              });
          }, [ledger, searchTerm, filterType]);

          const paginatedLedger = useMemo(() => {
              const startIndex = (currentPage - 1) * rowsPerPage;
              return [...filteredLedger].reverse().slice(startIndex, startIndex + rowsPerPage);
          }, [filteredLedger, currentPage]);

          const totalPages = Math.ceil(filteredLedger.length / rowsPerPage) || 1;

          const { totalPurchases, totalLiability, totalSales, currentBalance } = useMemo(() => {
            let purch = 0, liab = 0, sales = 0;
            transactions.forEach(t => {
              if (t.purchaseValue) purch += t.purchaseValue;
              if (t.liabilityAmount) liab += t.liabilityAmount;
              if (t.saleAmount) sales += t.saleAmount;
            });
            return { totalPurchases: purch, totalLiability: liab, totalSales: sales, currentBalance: roundToTwo(openingBalance + liab - sales) };
          }, [transactions, openingBalance]);

          const companyBalances = useMemo(() => {
              const balances = {};
              transactions.forEach(t => {
                  const p = (t.particulars || '').trim().toLowerCase();
                  const matchedCompany = knownCompanies.find(c => p.startsWith(c));
                  if (matchedCompany) {
                      if (!balances[matchedCompany]) balances[matchedCompany] = { bills: 0, returnsPayments: 0, netOutstanding: 0, txs: [] };
                      balances[matchedCompany].bills += (t.liabilityAmount || 0);
                      balances[matchedCompany].returnsPayments += (t.saleAmount || 0);
                      balances[matchedCompany].netOutstanding += ((t.liabilityAmount || 0) - (t.saleAmount || 0));
                      balances[matchedCompany].txs.push(t);
                  }
              });
              return Object.entries(balances).map(([name, stats]) => ({ name, ...stats, netOutstanding: roundToTwo(stats.netOutstanding) })).sort((a, b) => b.netOutstanding - a.netOutstanding);
          }, [transactions]);

          const reportData = useMemo(() => {
            const filtered = transactions.filter(t => t.date >= reportStartDate && t.date <= reportEndDate);
            let tcSale = 0, tuSale = 0, tpValue = 0, tpReturn = 0, cStats = {}; 
            let cList = [], uList = [], pList = [], rList = [];

            filtered.forEach(t => {
                const p = (t.particulars || '').trim().toLowerCase();
                const saleAmt = t.saleAmount || 0, liabAmt = t.liabilityAmount || 0, purchVal = t.purchaseValue || 0;

                if (p === 'cash') { tcSale += saleAmt; if(saleAmt > 0) cList.push(t); }
                if (p === 'upi') { tuSale += saleAmt; if(saleAmt > 0) uList.push(t); }
                if (purchVal > 0) { tpValue += purchVal; pList.push(t); }
                if (p.includes('purchase return') || p.includes('return')) { tpReturn += saleAmt; if (saleAmt > 0) rList.push(t); }

                const matchedCompany = knownCompanies.find(c => p.startsWith(c));
                if (matchedCompany) {
                    if (!cStats[matchedCompany]) cStats[matchedCompany] = { bills: 0, returnsPayments: 0, netOutstanding: 0 };
                    cStats[matchedCompany].bills += liabAmt;
                    cStats[matchedCompany].returnsPayments += saleAmt;
                    cStats[matchedCompany].netOutstanding += (liabAmt - saleAmt);
                }
            });

            return {
                totalCashSale: roundToTwo(tcSale), totalUpiSale: roundToTwo(tuSale), totalCombinedSales: roundToTwo(tcSale + tuSale),
                totalPurchaseValue: roundToTwo(tpValue), totalPurchaseReturn: roundToTwo(tpReturn),
                companyStats: Object.entries(cStats).map(([name, stats]) => ({ name, ...stats, netOutstanding: roundToTwo(stats.netOutstanding) })).sort((a,b) => b.netOutstanding - a.netOutstanding),
                cashSalesList: cList, upiSalesList: uList, purchaseList: pList, returnList: rList
            };
          }, [transactions, reportStartDate, reportEndDate]);

          const exportReportToPDF = () => {
            if (!window.jspdf) { alert("PDF library is still loading. Please check your internet connection."); return; }
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('p', 'mm', 'a4');

            const checkPageBreak = (currentY, neededSpace = 30) => {
                if (currentY + neededSpace > 280) { doc.addPage(); return 20; }
                return currentY;
            };

            doc.setFontSize(18); doc.setFont("helvetica", "bold"); doc.text("NEETHI MEDICALS - FINANCIAL REPORT", 14, 20);
            doc.setFontSize(11); doc.setFont("helvetica", "normal");
            doc.text(`Report Period: ${formatDate(reportStartDate)} to ${formatDate(reportEndDate)}`, 14, 28);
            doc.text(`Generated On: ${formatDate(new Date().toISOString().split('T')[0])}`, 14, 34);

            doc.setDrawColor(200); doc.setFillColor(245, 245, 245); doc.rect(14, 40, 182, 30, 'FD'); 
            doc.setFontSize(10); doc.setFont("helvetica", "bold");
            doc.text(`Total Cash Sale:`, 18, 48); doc.text(`Total UPI Sale:`, 18, 56); doc.text(`Total Combined Sales:`, 18, 64);
            doc.setFont("helvetica", "normal");
            doc.text(`Rs. ${reportData.totalCashSale.toLocaleString('en-IN')}`, 65, 48); doc.text(`Rs. ${reportData.totalUpiSale.toLocaleString('en-IN')}`, 65, 56);
            doc.setFont("helvetica", "bold"); doc.text(`Rs. ${reportData.totalCombinedSales.toLocaleString('en-IN')}`, 65, 64);

            doc.setFont("helvetica", "bold"); doc.text(`Total Goods Purchase:`, 110, 48); doc.text(`Purchase Returns:`, 110, 56);
            doc.setFont("helvetica", "normal");
            doc.text(`Rs. ${reportData.totalPurchaseValue.toLocaleString('en-IN')}`, 155, 48); doc.text(`Rs. ${reportData.totalPurchaseReturn.toLocaleString('en-IN')}`, 155, 56);

            let currentY = 80;
            doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text("1. Company-Wise Outstanding Summary", 14, currentY);
            doc.autoTable({
                startY: currentY + 4,
                head: [['Company Name', 'Bills Added (+)', 'Returns / Payments (-)', 'Net Outstanding']],
                body: reportData.companyStats.map(c => [ c.name.toUpperCase(), c.bills > 0 ? c.bills.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '-', c.returnsPayments > 0 ? c.returnsPayments.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '-', c.netOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 }) ]),
                theme: 'grid', headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] }, styles: { fontSize: 9, cellPadding: 3 }, columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right', fontStyle: 'bold' } }
            });

            currentY = checkPageBreak(doc.lastAutoTable.finalY + 15, 30);
            doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text(`2. Goods Purchases (Total: Rs. ${reportData.totalPurchaseValue.toLocaleString('en-IN')})`, 14, currentY);
            doc.autoTable({
                startY: currentY + 4, head: [['Date', 'Particulars', 'PIV No', 'Purchase Value']],
                body: reportData.purchaseList.length ? reportData.purchaseList.map(t => [formatDate(t.date), t.particulars.toUpperCase(), t.pivNo || '-', t.purchaseValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })]) : [['-', 'No purchases found', '-', '-']],
                theme: 'grid', headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255] }, styles: { fontSize: 9 }, columnStyles: { 3: { halign: 'right' } }
            });

            currentY = checkPageBreak(doc.lastAutoTable.finalY + 15, 30);
            doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text(`3. Cash Sales (Total: Rs. ${reportData.totalCashSale.toLocaleString('en-IN')})`, 14, currentY);
            doc.autoTable({
                startY: currentY + 4, head: [['Date', 'Particulars', 'Amount']],
                body: reportData.cashSalesList.length ? reportData.cashSalesList.map(t => [formatDate(t.date), t.particulars.toUpperCase(), t.saleAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })]) : [['-', 'No cash sales found', '-']],
                theme: 'grid', headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] }, styles: { fontSize: 9 }, columnStyles: { 2: { halign: 'right' } }
            });

            currentY = checkPageBreak(doc.lastAutoTable.finalY + 15, 30);
            doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text(`4. UPI Sales (Total: Rs. ${reportData.totalUpiSale.toLocaleString('en-IN')})`, 14, currentY);
            doc.autoTable({
                startY: currentY + 4, head: [['Date', 'Particulars', 'Amount']],
                body: reportData.upiSalesList.length ? reportData.upiSalesList.map(t => [formatDate(t.date), t.particulars.toUpperCase(), t.saleAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })]) : [['-', 'No UPI sales found', '-']],
                theme: 'grid', headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] }, styles: { fontSize: 9 }, columnStyles: { 2: { halign: 'right' } }
            });

            currentY = checkPageBreak(doc.lastAutoTable.finalY + 15, 30);
            doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.text(`5. Purchase Returns Report (Total: Rs. ${reportData.totalPurchaseReturn.toLocaleString('en-IN')})`, 14, currentY);
            doc.autoTable({
                startY: currentY + 4, head: [['Date', 'Company / Particulars', 'PIV No', 'Return Amount (-)']],
                body: reportData.returnList.length ? reportData.returnList.map(t => [formatDate(t.date), t.particulars.toUpperCase(), t.pivNo || '-', t.saleAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })]) : [['-', 'No returns found', '-', '-']],
                theme: 'grid', headStyles: { fillColor: [139, 92, 246], textColor: [255, 255, 255] }, styles: { fontSize: 9 }, columnStyles: { 3: { halign: 'right' } }
            });

            doc.save(`Neethi_Report_${formatDate(reportStartDate)}_to_${formatDate(reportEndDate)}.pdf`);
          };

          const handleSubmit = (e) => {
            e.preventDefault();
            if (!particulars) return;
            if (!purchaseValue && !liabilityAmount && !saleAmount) { alert("Please enter at least one amount."); return; }

            const newTransaction = {
              id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
              timestamp: Date.now(),
              date, particulars: particulars.toLowerCase().trim(), pivNo,
              purchaseValue: purchaseValue ? parseFloat(purchaseValue) : 0,
              liabilityAmount: liabilityAmount ? parseFloat(liabilityAmount) : 0,
              saleAmount: saleAmount ? parseFloat(saleAmount) : 0
            };

            setTransactions([...transactions, newTransaction]);
            setUnsavedChangesCount(prev => prev + 1);
            setParticulars(''); setPivNo(''); setPurchaseValue(''); setLiabilityAmount(''); setSaleAmount('');
          };

          // --- QUICK SUPPLIER SETTLEMENT HANDLER ---
          const handleQuickPaySubmit = (e) => {
              e.preventDefault();
              const amt = parseFloat(quickPayAmount);
              if(!amt || amt <= 0) return;
              
              const newTx = {
                  id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
                  timestamp: Date.now(),
                  date: quickPayDate,
                  particulars: quickPayCompany.toLowerCase().trim(),
                  pivNo: quickPayRef || 'PAYMENT/SETTLEMENT',
                  purchaseValue: 0,
                  liabilityAmount: 0,
                  saleAmount: amt // Pays down balance
              };
              setTransactions([...transactions, newTx]);
              setUnsavedChangesCount(prev => prev + 1);
              setQuickPayCompany(null);
              setQuickPayAmount('');
              setQuickPayRef('');
              alert(`Success! Payment of ₹${amt} to ${quickPayCompany} recorded.`);
          };

          const handleDelete = (id) => {
            if (window.confirm('Are you sure you want to delete this entry?')) {
              setTransactions(transactions.filter(t => t.id !== id));
              setUnsavedChangesCount(prev => prev + 1);
            }
          };

          const handleUpdateBalance = (e) => {
            e.preventDefault();
            if (!isNaN(newOpeningBalance)) {
              setOpeningBalance(parseFloat(newOpeningBalance));
              setUnsavedChangesCount(prev => prev + 1);
              alert("Opening balance updated.");
            }
          };

          const handlePasswordReset = (e) => {
              e.preventDefault();
              const correctPassword = localStorage.getItem('neethi_admin_pass') || "admin123";
              if (resetCurrentPass !== correctPassword) { setResetMessage({ type: 'error', text: 'Current password incorrect.' }); return; }
              if (resetNewPass !== resetConfirmPass) { setResetMessage({ type: 'error', text: 'Passwords do not match.' }); return; }
              if (resetNewPass.length < 4) { setResetMessage({ type: 'error', text: 'Password too short.' }); return; }
              
              localStorage.setItem('neethi_admin_pass', resetNewPass);
              setResetMessage({ type: 'success', text: 'Password updated!' });
              setResetCurrentPass(''); setResetNewPass(''); setResetConfirmPass('');
              setTimeout(() => setResetMessage(null), 4000);
          };

          const handleClearData = () => {
              const pass = window.prompt("WARNING: This will permanently delete ALL ledger entries.\n\nEnter admin password to confirm:");
              const correctPassword = localStorage.getItem('neethi_admin_pass') || "admin123";
              if (pass === correctPassword) {
                  if (window.confirm("Are you ABSOLUTELY sure? This cannot be undone.")) {
                      setTransactions([]); setOpeningBalance(0); setNewOpeningBalance('');
                      setUnsavedChangesCount(0); setActiveTab('dashboard');
                      alert("All data wiped.");
                  }
              } else if (pass !== null) { alert("Incorrect password."); }
          };

          const handleFileUpload = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = new Uint8Array(event.target.result);
                    const wb = XLSX.read(data, { type: 'array', cellDates: true });
                    setExcelWorkbook(wb);
                    setExcelSheets(wb.SheetNames);
                    if (wb.SheetNames.length > 0) setSelectedSheet(wb.SheetNames[0]);
                } catch (err) { alert("Failed to load file. Ensure it is a valid Excel or CSV."); }
            };
            reader.readAsArrayBuffer(file);
          };

          const importSelectedSheet = () => {
            if (!excelWorkbook || !selectedSheet) return;
            try {
                const sheet = excelWorkbook.Sheets[selectedSheet];
                const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
                if (rows.length === 0) { alert("Selected sheet is empty."); return; }

                let dateIdx = 0, particularsIdx = 1, pivIdx = 2, purchaseIdx = 3, liabilityIdx = 3, saleIdx = 4;
                for (let r = 0; r < Math.min(15, rows.length); r++) {
                    const row = rows[r];
                    const hasDate = row.some(cell => String(cell).toLowerCase().includes('date'));
                    const hasPart = row.some(cell => String(cell).toLowerCase().includes('particular'));
                    if (hasDate && hasPart) {
                        row.forEach((cell, idx) => {
                            const val = String(cell).toLowerCase().trim();
                            if (val.includes('date')) dateIdx = idx;
                            else if (val.includes('particular')) particularsIdx = idx;
                            else if (val.includes('piv') || val.includes('bill')) pivIdx = idx;
                            else if (val.includes('goods purchase value') || val.includes('purchase (info)')) purchaseIdx = idx;
                            else if (val.includes('liability (+)') || val.includes('liability amount')) liabilityIdx = idx;
                            else if (val.includes('sale') || val.includes('payment')) saleIdx = idx;
                            else if (val.includes('balance (s.v)') || val.includes('purchase') || val.includes('liability')) {
                                if (!val.includes('running') && val !== 'liability') { purchaseIdx = idx; liabilityIdx = idx; }
                            }
                        });
                        break;
                    }
                }

                const newTransactions = [];
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                rows.forEach((row, index) => {
                    if (row.length < 2) return;
                    const rawDate = row[dateIdx];
                    if (!rawDate || String(rawDate).toLowerCase().includes('date')) return;
                    const dateStr = parseExcelDate(rawDate);
                    if (!dateRegex.test(dateStr)) return;
                    const particulars = String(row[particularsIdx] || '').trim().toLowerCase();
                    if (!particulars || particulars === 'particulars') return;
                    const pivNo = String(row[pivIdx] || '').trim();
                    const pVal = parseFloat(row[purchaseIdx]) || 0, lAmt = parseFloat(row[liabilityIdx]) || 0, sAmt = parseFloat(row[saleIdx]) || 0;

                    if (pVal > 0 || lAmt > 0 || sAmt > 0) {
                        newTransactions.push({
                            id: (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()) + '-' + index,
                            timestamp: Date.now() + index, date: dateStr, particulars, pivNo, purchaseValue: pVal, liabilityAmount: lAmt, saleAmount: sAmt
                        });
                    }
                });

                if (newTransactions.length > 0) {
                    if(window.confirm(`Found ${newTransactions.length} entries. Import them?`)) {
                        setTransactions(prev => [...prev, ...newTransactions]);
                        setExcelWorkbook(null); setExcelSheets([]); setSelectedSheet('');
                        setUnsavedChangesCount(prev => prev + newTransactions.length);
                        setActiveTab('ledger');
                        alert("Data imported successfully!");
                    }
                } else { alert('No valid transactions found.'); }
            } catch (err) { alert("Error importing sheet."); }
          };

          const getCsvContent = (ledgerData) => {
            const headers = ['Date', 'Particulars', 'PIV No.', 'Goods Purchase Value (Info)', 'Liability (+)', 'Sale/Payment (-)', 'Running Balance'];
            const rows = ledgerData.map(t => [ formatDate(t.date), t.particulars, t.pivNo || '', t.purchaseValue || '', t.liabilityAmount || '', t.saleAmount || '', t.runningBalance ]);
            return [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
          };

          const connectDesktopFile = async () => {
            try {
              if (!window.showSaveFilePicker) { alert("Requires Google Chrome/Edge."); return; }
              const handle = await window.showSaveFilePicker({ suggestedName: `Neethi_Medicals_Ledger.csv`, types: [{ description: 'CSV File', accept: { 'text/csv': ['.csv'] } }] });
              setFileHandle(handle); setAutoSaveStatus('🟢 Connected! Auto-saving enabled.'); setUnsavedChangesCount(0);
              const writable = await handle.createWritable(); await writable.write(getCsvContent(ledger)); await writable.close();
            } catch (error) {
              if (error.name === 'SecurityError') { setAutoSaveStatus('⚠️ Direct sync blocked. Use Manual Backup.'); } 
              else if (error.name !== 'AbortError') { setAutoSaveStatus('🔴 Auto-save failed!'); }
            }
          };

          useEffect(() => {
            if (!fileHandle) return;
            const saveAutomatically = async () => {
              try {
                setAutoSaveStatus('🔄 Saving...');
                const writable = await fileHandle.createWritable(); await writable.write(getCsvContent(ledger)); await writable.close();
                setAutoSaveStatus(`🟢 Auto-saved at ${new Date().toLocaleTimeString()}`);
                setUnsavedChangesCount(0);
              } catch (error) { setAutoSaveStatus('🔴 Auto-save failed!'); }
            };
            saveAutomatically();
          }, [ledger, fileHandle]);

          const exportToCSV = () => {
            const csvContent = getCsvContent(ledger);
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `Neethi_Medicals_Ledger_${formatDate(new Date().toISOString().split('T')[0])}.csv`;
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
            setUnsavedChangesCount(0);
          };

          /* --- Active Company Statement Processor (Adds Running Balance specifically for modals) --- */
          const activeCompanyDetails = useMemo(() => {
              if(!selectedCompanyName) return null;
              const comp = companyBalances.find(c => c.name === selectedCompanyName);
              if(!comp) return null;
              
              // Sort by date, then add running balance
              let runBal = 0;
              const historyWithBalance = comp.txs.slice().sort((a,b) => {
                  if(a.date === b.date) return a.timestamp - b.timestamp;
                  return new Date(a.date) - new Date(b.date);
              }).map(tx => {
                  runBal += (tx.liabilityAmount || 0) - (tx.saleAmount || 0);
                  return { ...tx, compRunBal: runBal };
              }).reverse(); // Reverse so newest is at the top of the table
              
              return { ...comp, txs: historyWithBalance };
          }, [selectedCompanyName, companyBalances]);


          

    const value = {
        activeTab, setActiveTab, isAuthenticated, setIsAuthenticated, loginUser, setLoginUser,
        loginPass, setLoginPass, loginError, setLoginError, transactions, setTransactions,
        openingBalance, setOpeningBalance, date, setDate, particulars, setParticulars,
        pivNo, setPivNo, purchaseValue, setPurchaseValue, liabilityAmount, setLiabilityAmount,
        saleAmount, setSaleAmount, searchTerm, setSearchTerm, filterType, setFilterType,
        currentPage, setCurrentPage, rowsPerPage, newOpeningBalance, setNewOpeningBalance,
        resetCurrentPass, setResetCurrentPass, resetNewPass, setResetNewPass, resetConfirmPass,
        setResetConfirmPass, resetMessage, setResetMessage, excelWorkbook, setExcelWorkbook,
        excelSheets, setExcelSheets, selectedSheet, setSelectedSheet, currDate, firstDay,
        reportStartDate, setReportStartDate, reportEndDate, setReportEndDate, selectedCompanyName,
        setSelectedCompanyName, quickPayCompany, setQuickPayCompany, quickPayAmount, setQuickPayAmount,
        quickPayDate, setQuickPayDate, quickPayRef, setQuickPayRef, fileHandle, setFileHandle,
        autoSaveStatus, setAutoSaveStatus, unsavedChangesCount, setUnsavedChangesCount,
        knownCompanies, handleLogin, handleLogout, roundToTwo, formatDate, parseDateString,
        parseExcelDate, ledger, filteredLedger, paginatedLedger, totalPages, totalPurchases,
        totalLiability, totalSales, currentBalance, companyBalances, reportData, exportReportToPDF,
        handleSubmit, handleQuickPaySubmit, handleDelete, handleUpdateBalance, handlePasswordReset,
        handleClearData, handleFileUpload, importSelectedSheet, getCsvContent, connectDesktopFile,
        exportToCSV, activeCompanyDetails
    };

    return (
        <LedgerContext.Provider value={value}>
            {children}
        </LedgerContext.Provider>
    );
};

export const useLedger = () => useContext(LedgerContext);
