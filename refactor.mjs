import fs from 'fs';

const appPath = 'src/App.jsx';
const contextPath = 'src/context/LedgerContext.jsx';
let content = fs.readFileSync(appPath, 'utf8');

const logicBlock = content.substring(content.indexOf('function App() {') + 'function App() {'.length, content.indexOf('if (!isAuthenticated) {'));

const contextContent = `import React, { createContext, useState, useEffect, useMemo, useContext, useRef } from 'react';
import * as XLSX from 'xlsx';
import Chart from 'chart.js/auto';

const LedgerContext = createContext();

export const LedgerProvider = ({ children }) => {
${logicBlock}

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
`;

fs.writeFileSync(contextPath, contextContent, 'utf8');
console.log('Fixed LedgerContext.jsx');
