import React, { useContext, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DataContext } from '../context/DataContext';
import { UserContext } from '../context/UserContext';

export default function DebugPanel() {
  const { debugLocalStorage } = useContext(DataContext);
  const { currentUser } = useContext(UserContext);
  const [localStorageData, setLocalStorageData] = useState(null);
  const [customKey, setCustomKey] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleCheckLocalStorage = () => {
    try {
      // Check if localStorage is available
      const testKey = 'test';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      
      // Get all data from localStorage
      const data = debugLocalStorage();
      setLocalStorageData(data);
      
      setSnackbar({
        open: true,
        message: 'Local storage checked successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Local storage error: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleClearLocalStorage = () => {
    try {
      localStorage.removeItem('fencing_tracker_fencers');
      localStorage.removeItem('fencing_tracker_tournaments');
      localStorage.removeItem('fencing_tracker_entries');
      localStorage.removeItem('fencing_tracker_pools');
      localStorage.removeItem('fencing_tracker_bouts');
      localStorage.removeItem('fencing_tracker_de_bouts');
      
      setSnackbar({
        open: true,
        message: 'Local storage cleared successfully',
        severity: 'success'
      });
      
      setLocalStorageData(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error clearing local storage: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleSetCustomValue = () => {
    try {
      if (customKey && customValue) {
        localStorage.setItem(customKey, customValue);
        setSnackbar({
          open: true,
          message: `Set "${customKey}" successfully`,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Both key and value are required',
          severity: 'warning'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error setting value: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Debug Panel
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Local Storage Status
        </Typography>
        <Button 
          variant="contained" 
          onClick={handleCheckLocalStorage}
          sx={{ mr: 2 }}
        >
          Check Local Storage
        </Button>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleClearLocalStorage}
        >
          Clear Local Storage
        </Button>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">
            Current User: {currentUser ? currentUser.name : 'Not logged in'}
          </Typography>
        </Box>
        
        {localStorageData && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Local Storage Contents:
            </Typography>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  Fencers ({localStorageData.fencers ? localStorageData.fencers.length : 0})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
                  {JSON.stringify(localStorageData.fencers, null, 2)}
                </pre>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  Tournaments ({localStorageData.tournaments ? localStorageData.tournaments.length : 0})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
                  {JSON.stringify(localStorageData.tournaments, null, 2)}
                </pre>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  Entries ({localStorageData.entries ? localStorageData.entries.length : 0})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
                  {JSON.stringify(localStorageData.entries, null, 2)}
                </pre>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  Pools ({localStorageData.pools ? localStorageData.pools.length : 0})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
                  {JSON.stringify(localStorageData.pools, null, 2)}
                </pre>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  Bouts ({localStorageData.bouts ? localStorageData.bouts.length : 0})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
                  {JSON.stringify(localStorageData.bouts, null, 2)}
                </pre>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  DE Bouts ({localStorageData.deBouts ? localStorageData.deBouts.length : 0})
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
                  {JSON.stringify(localStorageData.deBouts, null, 2)}
                </pre>
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </Paper>
      
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Custom Local Storage Operations
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            label="Key"
            value={customKey}
            onChange={(e) => setCustomKey(e.target.value)}
            sx={{ mr: 2, flexGrow: 1 }}
          />
          <TextField
            label="Value"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            sx={{ mr: 2, flexGrow: 1 }}
          />
          <Button 
            variant="contained"
            onClick={handleSetCustomValue}
          >
            Set Value
          </Button>
        </Box>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}