import { AuthProvider, useAuthContext } from './context/AuthContext';
import { DriveProvider } from './context/DriveContext';
import { HomePage } from './components/home/HomePage';
import { Dashboard } from './components/dashboard/Dashboard';
import { Loading } from './components/common/Loading';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return <Loading />;
  }

  return isAuthenticated ? <Dashboard /> : <HomePage />;
};

function App() {
  return (
    <AuthProvider>
      <DriveProvider>
        <AppContent />
      </DriveProvider>
    </AuthProvider>
  );
}

export default App;
