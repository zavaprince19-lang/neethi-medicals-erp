import fs from 'fs';

const appPath = 'src/App.jsx';
let content = fs.readFileSync(appPath, 'utf8');

function extractBalancedBlock(startMarker) {
    const startIdx = content.indexOf(startMarker);
    if (startIdx === -1) return null;
    let depth = 1;
    let inString = false;
    let strChar = '';
    let captureEnd = -1;
    
    // We already passed the first '(' which is the last char of startMarker
    for (let i = startIdx + startMarker.length; i < content.length; i++) {
        const char = content[i];
        if (!inString && (char === '"' || char === "'" || char === '`')) {
            inString = true;
            strChar = char;
        } else if (inString && char === strChar && content[i-1] !== '\\') {
            inString = false;
        } else if (!inString) {
            if (char === '(') depth++;
            else if (char === ')') {
                depth--;
                if (depth === 0) {
                    captureEnd = i;
                    break;
                }
            }
        }
    }
    return content.substring(startIdx + startMarker.length, captureEnd).trim();
}

const allContextVars = ['activeTab', 'setActiveTab', 'isAuthenticated', 'setIsAuthenticated', 'loginUser', 'setLoginUser', 'loginPass', 'setLoginPass', 'loginError', 'setLoginError', 'transactions', 'setTransactions', 'openingBalance', 'setOpeningBalance', 'date', 'setDate', 'particulars', 'setParticulars', 'pivNo', 'setPivNo', 'purchaseValue', 'setPurchaseValue', 'liabilityAmount', 'setLiabilityAmount', 'saleAmount', 'setSaleAmount', 'searchTerm', 'setSearchTerm', 'filterType', 'setFilterType', 'currentPage', 'setCurrentPage', 'rowsPerPage', 'newOpeningBalance', 'setNewOpeningBalance', 'resetCurrentPass', 'setResetCurrentPass', 'resetNewPass', 'setResetNewPass', 'resetConfirmPass', 'setResetConfirmPass', 'resetMessage', 'setResetMessage', 'excelWorkbook', 'setExcelWorkbook', 'excelSheets', 'setExcelSheets', 'selectedSheet', 'setSelectedSheet', 'currDate', 'firstDay', 'reportStartDate', 'setReportStartDate', 'reportEndDate', 'setReportEndDate', 'selectedCompanyName', 'setSelectedCompanyName', 'quickPayCompany', 'setQuickPayCompany', 'quickPayAmount', 'setQuickPayAmount', 'quickPayDate', 'setQuickPayDate', 'quickPayRef', 'setQuickPayRef', 'fileHandle', 'setFileHandle', 'autoSaveStatus', 'setAutoSaveStatus', 'unsavedChangesCount', 'setUnsavedChangesCount', 'knownCompanies', 'handleLogin', 'handleLogout', 'roundToTwo', 'formatDate', 'parseDateString', 'parseExcelDate', 'ledger', 'filteredLedger', 'paginatedLedger', 'totalPages', 'totalPurchases', 'totalLiability', 'totalSales', 'currentBalance', 'companyBalances', 'reportData', 'exportReportToPDF', 'handleSubmit', 'handleQuickPaySubmit', 'handleDelete', 'handleUpdateBalance', 'handlePasswordReset', 'handleClearData', 'handleFileUpload', 'importSelectedSheet', 'getCsvContent', 'connectDesktopFile', 'exportToCSV', 'activeCompanyDetails'];

function getUsedVars(body) {
    return allContextVars.filter(v => new RegExp(`\\b${v}\\b`).test(body)).join(', ');
}

// Special extraction for login (if (!isAuthenticated) { return (...) })
const loginStart = content.indexOf('if (!isAuthenticated) {');
const loginReturn = content.indexOf('return (', loginStart);
let loginDepth = 1;
let loginEnd = -1;
for (let i = loginReturn + 'return ('.length; i < content.length; i++) {
    const char = content[i];
    if (char === '(') loginDepth++;
    else if (char === ')') {
        loginDepth--;
        if (loginDepth === 0) {
            loginEnd = i;
            break;
        }
    }
}
const loginBody = content.substring(loginReturn + 'return ('.length, loginEnd).trim();

// Special extraction for Sidebar and Topbar (simple tags)
const sidebarStart = content.indexOf('<aside');
const sidebarEnd = content.indexOf('</aside>', sidebarStart) + '</aside>'.length;
const sidebarBody = content.substring(sidebarStart, sidebarEnd).trim();

const topbarStart = content.indexOf('<header');
const topbarEnd = content.indexOf('</header>', topbarStart) + '</header>'.length;
const topbarBody = content.substring(topbarStart, topbarEnd).trim();

// Extract views
const dbBody = extractBalancedBlock("{activeTab === 'dashboard' && (");
const ledgerBody = extractBalancedBlock("{activeTab === 'ledger' && (");
const companiesBody = extractBalancedBlock("{activeTab === 'companies' && (");
const reportsBody = extractBalancedBlock("{activeTab === 'reports' && (");
const settingsBody = extractBalancedBlock("{activeTab === 'settings' && (");

const quickPayModal = extractBalancedBlock("{quickPayCompany && (");
const statementModal = extractBalancedBlock("{activeCompanyDetails && (");

const companiesJSX = `<>
${companiesBody}
{quickPayCompany && (
${quickPayModal}
)}
{activeCompanyDetails && (
${statementModal}
)}
</>`;

const generateComponent = (name, body, extraImports = '') => {
    const vars = getUsedVars(body);
    const file = `import React from 'react';
import { useLedger } from '../../context/LedgerContext';
import { DashboardIcon, LedgerIcon, CompanyIcon, ReportIcon, SettingsIcon, SaveIcon, TrashIcon, DownloadIcon, LockIcon, LogoutIcon, SearchIcon, HomeIcon, ChartIcon, PdfIcon, MoneyIcon } from '../icons';
${extraImports}

export default function ${name}() {
    const { ${vars} } = useLedger();

    return (
        ${body}
    );
}
`;
    fs.writeFileSync(`src/components/views/${name}.jsx`, file, 'utf8');
}

const generateSharedComponent = (name, body) => {
    const vars = getUsedVars(body);
    const file = `import React from 'react';
import { useLedger } from '../context/LedgerContext';
import { DashboardIcon, LedgerIcon, CompanyIcon, ReportIcon, SettingsIcon, SaveIcon, TrashIcon, DownloadIcon, LockIcon, LogoutIcon, SearchIcon, HomeIcon, ChartIcon, PdfIcon, MoneyIcon } from './icons';

export default function ${name}() {
    const { ${vars} } = useLedger();

    return (
        ${body}
    );
}
`;
    fs.writeFileSync(`src/components/${name}.jsx`, file, 'utf8');
}

generateSharedComponent('Sidebar', sidebarBody);
generateSharedComponent('Topbar', topbarBody);

generateComponent('Login', loginBody);
generateComponent('Dashboard', dbBody, "import LedgerChart from '../LedgerChart';");
generateComponent('Ledger', ledgerBody);
generateComponent('Companies', companiesJSX);
generateComponent('Reports', reportsBody);
generateComponent('Settings', settingsBody);

console.log('Views generated successfully with balanced parsing.');
