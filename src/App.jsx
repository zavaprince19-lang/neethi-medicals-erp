import React from 'react';
import { LedgerProvider, useLedger } from './context/LedgerContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Login from './components/views/Login';
import Dashboard from './components/views/Dashboard';
import Ledger from './components/views/Ledger';
import Companies from './components/views/Companies';
import Reports from './components/views/Reports';
import Settings from './components/views/Settings';

const MainApp = () => {
    const { isAuthenticated, activeTab } = useLedger();

    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <Topbar />
                <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'ledger' && <Ledger />}
                    {activeTab === 'companies' && <Companies />}
                    {activeTab === 'reports' && <Reports />}
                    {activeTab === 'settings' && <Settings />}
                </div>
            </main>
        </div>
    );
};

function App() {
    return (
        <LedgerProvider>
            <MainApp />
        </LedgerProvider>
    );
}

export default App;
