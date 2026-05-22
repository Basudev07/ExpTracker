import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ToastProvider from './components/ToastProvider';

// Lazy load pages for optimized initial chunk delivery
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Auth = lazy(() => import('./pages/Auth'));
const Income = lazy(() => import('./pages/Income'));
const Expense = lazy(() => import('./pages/Expense'));
const Profile = lazy(() => import('./pages/Profile'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));

const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <span className="loading loading-spinner loading-lg text-primary"></span>
  </div>
);

function Layout({ children }) {
  const isAuthenticated = !!localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
   <div className="flex min-h-screen bg-base-100">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pt-20 lg:pt-0">
        <div className="mx-auto max-w-7xl p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Layout><Dashboard /></Layout>} />
            <Route path="/income" element={<Layout><Income /></Layout>} />
            <Route path="/expense" element={<Layout><Expense /></Layout>} />
            <Route path="/profile" element={<Layout><Profile /></Layout>} />
            <Route path="/change-password" element={<Layout><ChangePassword /></Layout>} />
          </Routes>
        </Suspense>
      </Router>
    </ToastProvider>
  );
}

export default App;