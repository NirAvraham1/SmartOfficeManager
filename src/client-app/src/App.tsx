import { observer } from 'mobx-react-lite';
import { useStore } from './stores/store';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { CssBaseline } from '@mui/material';

function App() {
  const { authStore } = useStore();

  if (authStore.loading && !authStore.isLoggedIn) {
    return <div className="h-screen w-screen flex items-center justify-center">טוען...</div>;
  }

  return (
    <div className="w-full min-h-screen">
      <CssBaseline />
      {!authStore.isLoggedIn ? <LoginPage /> : <DashboardPage />}
    </div>
  );
}

export default observer(App);