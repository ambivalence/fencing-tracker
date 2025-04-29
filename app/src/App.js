import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { UserProvider } from './context/UserContext';
import { DataProvider } from './context/DataContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FencerList from './pages/FencerList';
import FencerDetail from './pages/FencerDetail';
import TournamentList from './pages/TournamentList';
import TournamentDetail from './pages/TournamentDetail';
import PoolEntry from './pages/PoolEntry';
import DEEntry from './pages/DEEntry';
import Analytics from './pages/Analytics';
import DebugPanel from './pages/DebugPanel';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated in localStorage
    const user = localStorage.getItem('fencing_tracker_user');
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <DataProvider>
          <Router>
            <Routes>
              <Route path="/login" element={
                isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />
              } />
              
              <Route path="/" element={
                <PrivateRoute isAuthenticated={isAuthenticated}>
                  <Layout />
                </PrivateRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="fencers" element={<FencerList />} />
                <Route path="fencers/:id" element={<FencerDetail />} />
                <Route path="tournaments" element={<TournamentList />} />
                <Route path="tournaments/:id" element={<TournamentDetail />} />
                <Route path="entries/:id/pools" element={<PoolEntry />} />
                <Route path="entries/:id/de" element={<DEEntry />} />
                <Route path="analytics/:fencerId" element={<Analytics />} />
                <Route path="debug" element={<DebugPanel />} />
              </Route>
            </Routes>
          </Router>
        </DataProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;