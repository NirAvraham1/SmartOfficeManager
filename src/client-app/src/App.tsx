import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from './stores/store';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { CssBaseline, Box, CircularProgress } from '@mui/material';

function App() {
  const { authStore } = useStore();

  useEffect(() => {
    authStore.getUser();
  }, [authStore]);

  if (authStore.loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="screen" 
        height="100vh"
      >
        <CircularProgress />
        <span style={{ marginRight: '10px' }}>טוען מערכת...</span>
      </Box>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <CssBaseline />
      {/* רינדור מותנה: אם אין משתמש, מציגים לוגין. אם יש, מציגים דשבורד */}
      {!authStore.isLoggedIn ? <LoginPage /> : <DashboardPage />}
    </div>
  );
}

export default observer(App);