import React from 'react';
import { Switch, Route } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { FieldsPage } from './pages/FieldsPage';
import { AdvisoryWizard } from './pages/AdvisoryWizard';
import { AdvisoryDetail } from './pages/AdvisoryDetail';
import { DiagnosticDoctor } from './pages/DiagnosticDoctor';
import { HistoryPage } from './pages/HistoryPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        {/* Top Sticky Header */}
        <Navbar />

        <div className="flex flex-1">
          {/* Left Navigation Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/fields" component={FieldsPage} />
              <Route path="/advisory/new" component={AdvisoryWizard} />
              <Route path="/advisory/:id" component={AdvisoryDetail} />
              <Route path="/diagnostics" component={DiagnosticDoctor} />
              <Route path="/history" component={HistoryPage} />
              <Route>
                <div className="glass-panel rounded-3xl p-12 text-center space-y-4 max-w-md mx-auto my-16">
                  <h2 className="text-xl font-bold text-slate-100">404 — Page Not Found</h2>
                  <p className="text-xs text-slate-400">The requested agronomic route does not exist.</p>
                  <a href="/" className="inline-block px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs">
                    Return to Dashboard
                  </a>
                </div>
              </Route>
            </Switch>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default App;
