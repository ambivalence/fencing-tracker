import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControlLabel,
  Switch,
  Divider,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Tooltip,
  FormHelperText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { DataContext } from '../context/DataContext';
import { calculatePoolStats } from '../utils/helpers';

export default function PoolEntry() {
  const { id: entryId } = useParams();
  const navigate = useNavigate();
  const { 
    getEntry, 
    getFencer, 
    getTournament, 
    pools, 
    addPool, 
    bouts, 
    addBout, 
    updateBout, 
    deleteBout 
  } = useContext(DataContext);
  
  const [entry, setEntry] = useState(null);
  const [fencer, setFencer] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [entryPools, setEntryPools] = useState([]);
  const [poolBouts, setPoolBouts] = useState([]);
  const [currentPool, setCurrentPool] = useState(null);
  
  // Dialog states
  const [openPoolDialog, setOpenPoolDialog] = useState(false);
  const [openBoutDialog, setOpenBoutDialog] = useState(false);
  const [boutDialogMode, setBoutDialogMode] = useState('add');
  const [currentBout, setCurrentBout] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [boutToDelete, setBoutToDelete] = useState(null);
  
  // Form data
  const [poolFormData, setPoolFormData] = useState({
    poolNumber: '',
    numberOfFencers: '',
  });
  
  const [boutFormData, setBoutFormData] = useState({
    opponentName: '',
    scoreFor: '',
    scoreAgainst: '',
    victory: false,
    notes: '',
  });
  
  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  useEffect(() => {
    const entryData = getEntry(entryId);
    setEntry(entryData);
    
    if (entryData) {
      const fencerData = getFencer(entryData.fencerId);
      setFencer(fencerData);
      
      const tournamentData = getTournament(entryData.tournamentId);
      setTournament(tournamentData);
      
      // Get pools for this entry
      const filteredPools = pools.filter(pool => pool.entryId === entryId);
      setEntryPools(filteredPools);
      
      // Set current pool to the first one if available
      if (filteredPools.length > 0 && !currentPool) {
        setCurrentPool(filteredPools[0]);
      }
    }
  }, [entryId, getEntry, getFencer, getTournament, pools, currentPool]);
  
  useEffect(() => {
    // Get bouts for the current pool
    if (currentPool) {
      const filteredBouts = bouts.filter(bout => bout.poolId === currentPool.id);
      setPoolBouts(filteredBouts);
    } else {
      setPoolBouts([]);
    }
  }, [currentPool, bouts]);
  
  if (!entry || !fencer || !tournament) {
    return (
      <Box>
        <Typography variant="h5">Entry not found</Typography>
        <Button component={RouterLink} to="/tournaments" sx={{ mt: 2 }}>
          Back to Tournaments
        </Button>
      </Box>
    );
  }
  
  const handleBackToTournament = () => {
    navigate(`/tournaments/${tournament.id}`);
  };
  
  const handleSelectPool = (pool) => {
    setCurrentPool(pool);
  };
  
  // Pool dialog handlers
  const handleOpenPoolDialog = () => {
    setPoolFormData({
      poolNumber: entryPools.length + 1,
      numberOfFencers: '',
    });
    setOpenPoolDialog(true);
  };
  
  const handleClosePoolDialog = () => {
    setOpenPoolDialog(false);
  };
  
  const handlePoolInputChange = (e) => {
    const { name, value } = e.target;
    setPoolFormData({
      ...poolFormData,
      [name]: value,
    });
  };
  
  const handlePoolSubmit = () => {
    const newPool = {
      ...poolFormData,
      entryId,
    };
    const createdPool = addPool(newPool);
    setCurrentPool(createdPool);
    setOpenPoolDialog(false);
    setSnackbar({
      open: true,
      message: 'Pool added successfully',
      severity: 'success',
    });
  };
  
  // Bout dialog handlers
  const handleOpenAddBoutDialog = () => {
    setBoutDialogMode('add');
    setBoutFormData({
      opponentName: '',
      scoreFor: '',
      scoreAgainst: '',
      victory: false,
      notes: '',
    });
    setOpenBoutDialog(true);
  };
  
  const handleOpenEditBoutDialog = (bout) => {
    setBoutDialogMode('edit');
    setCurrentBout(bout);
    setBoutFormData({
      opponentName: bout.opponentName || '',
      scoreFor: bout.scoreFor || '',
      scoreAgainst: bout.scoreAgainst || '',
      victory: bout.victory || false,
      notes: bout.notes || '',
    });
    setOpenBoutDialog(true);
  };
  
  const handleCloseBoutDialog = () => {
    setOpenBoutDialog(false);
  };
  
  const handleBoutInputChange = (e) => {
    const { name, value } = e.target;
    
    // Create updated form data
    const updatedFormData = {
      ...boutFormData,
      [name]: value,
    };
    
    // If score fields are changed, automatically update victory status
    if (name === 'scoreFor' || name === 'scoreAgainst') {
      const scoreFor = name === 'scoreFor' ? parseInt(value) || 0 : parseInt(boutFormData.scoreFor) || 0;
      const scoreAgainst = name === 'scoreAgainst' ? parseInt(value) || 0 : parseInt(boutFormData.scoreAgainst) || 0;
      
      // Only auto-update victory when scores are not equal
      if (scoreFor !== scoreAgainst) {
        // In fencing, victory is determined by who has the higher score
        updatedFormData.victory = scoreFor > scoreAgainst;
      }
      // When scores are equal, keep the current victory status
    }
    
    setBoutFormData(updatedFormData);
  };
  
  const handleBoutSwitchChange = (e) => {
    const victory = e.target.checked;
    
    // If manually setting victory, ensure scores are consistent with victory status
    const scoreFor = parseInt(boutFormData.scoreFor) || 0;
    const scoreAgainst = parseInt(boutFormData.scoreAgainst) || 0;
    
    // Only validate when scores are not equal
    if (scoreFor !== scoreAgainst) {
      if (victory && scoreFor < scoreAgainst) {
        setSnackbar({
          open: true,
          message: "Victory can only be set when your score is higher than or equal to opponent's score.",
          severity: "error"
        });
        return;
      }
      
      if (!victory && scoreFor > scoreAgainst) {
        setSnackbar({
          open: true,
          message: "Defeat can only be set when your score is lower than or equal to opponent's score.",
          severity: "error"
        });
        return;
      }
    }
    // When scores are equal, allow manual setting of victory/defeat
    
    setBoutFormData({
      ...boutFormData,
      victory
    });
  };
  
  const handleBoutSubmit = () => {
    // Validate required fields
    if (!boutFormData.opponentName) {
      setSnackbar({
        open: true,
        message: "Opponent name is required",
        severity: "error"
      });
      return;
    }
    
    // Validate scores and victory consistency
    const scoreFor = parseInt(boutFormData.scoreFor) || 0;
    const scoreAgainst = parseInt(boutFormData.scoreAgainst) || 0;
    
    // Only validate when scores are not equal
    if (scoreFor !== scoreAgainst) {
      if (boutFormData.victory && scoreFor < scoreAgainst) {
        setSnackbar({
          open: true,
          message: "Victory can only be set when your score is higher than or equal to opponent's score",
          severity: "error"
        });
        return;
      }
      
      if (!boutFormData.victory && scoreFor > scoreAgainst) {
        setSnackbar({
          open: true,
          message: "Defeat can only be set when your score is lower than or equal to opponent's score",
          severity: "error"
        });
        return;
      }
    }
    // When scores are equal, allow manual setting of victory/defeat
    
    if (boutDialogMode === 'add') {
      const newBout = {
        ...boutFormData,
        poolId: currentPool.id,
        entryId,
        scoreFor: parseInt(boutFormData.scoreFor) || 0,
        scoreAgainst: parseInt(boutFormData.scoreAgainst) || 0,
      };
      addBout(newBout);
      setSnackbar({
        open: true,
        message: 'Bout added successfully',
        severity: 'success',
      });
    } else {
      updateBout(currentBout.id, {
        ...boutFormData,
        scoreFor: parseInt(boutFormData.scoreFor) || 0,
        scoreAgainst: parseInt(boutFormData.scoreAgainst) || 0,
      });
      setSnackbar({
        open: true,
        message: 'Bout updated successfully',
        severity: 'success',
      });
    }
    setOpenBoutDialog(false);
  };
  
  const handleOpenDeleteDialog = (bout) => {
    setBoutToDelete(bout);
    setOpenDeleteDialog(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setBoutToDelete(null);
  };
  
  const handleDeleteBout = () => {
    deleteBout(boutToDelete.id);
    setOpenDeleteDialog(false);
    setBoutToDelete(null);
    setSnackbar({
      open: true,
      message: 'Bout deleted successfully',
      severity: 'success',
    });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };
  
  // Calculate pool statistics
  const poolStats = calculatePoolStats(poolBouts);
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBackToTournament} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Pool Results
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Tournament and Fencer Info */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6">{tournament.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {tournament.startDate && new Date(tournament.startDate).toLocaleDateString()}
                  {tournament.location && ` • ${tournament.location}`}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="h6">{fencer.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {entry.weapon && `${entry.weapon} • `}
                  {entry.ageCategory && entry.ageCategory}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Pool Selection */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Pools
              </Typography>
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleOpenPoolDialog}
              >
                Add Pool
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {entryPools.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                No pools added yet. Click "Add Pool" to get started.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>
                {entryPools.map(pool => (
                  <Button
                    key={pool.id}
                    variant={currentPool && currentPool.id === pool.id ? 'contained' : 'outlined'}
                    onClick={() => handleSelectPool(pool)}
                    sx={{ minWidth: '80px' }}
                  >
                    Pool {pool.poolNumber}
                  </Button>
                ))}
              </Box>
            )}
          </Paper>
          
          {/* Pool Statistics */}
          {currentPool && (
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Pool Statistics
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Victory/Bout
                      </Typography>
                      <Typography variant="h5" component="div">
                        {poolStats.victories} / {poolStats.bouts}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Win %
                      </Typography>
                      <Typography variant="h5" component="div">
                        {poolStats.bouts > 0 ? poolStats.winPercentage.toFixed(1) : '0'}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Touches Scored
                      </Typography>
                      <Typography variant="h5" component="div">
                        {poolStats.touchesScored}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Touches Received
                      </Typography>
                      <Typography variant="h5" component="div">
                        {poolStats.touchesReceived}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Indicator
                      </Typography>
                      <Typography 
                        variant="h5" 
                        component="div"
                        color={poolStats.indicator >= 0 ? 'success.main' : 'error.main'}
                      >
                        {poolStats.indicator >= 0 ? '+' : ''}{poolStats.indicator}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Grid>
        
        {/* Pool Bouts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                {currentPool ? `Pool ${currentPool.poolNumber} Bouts` : 'Bouts'}
              </Typography>
              {currentPool && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddBoutDialog}
                >
                  Add Bout
                </Button>
              )}
            </Box>
            <Divider sx={{ mb: 2 }} />
            {!currentPool ? (
              <Alert severity="info">
                Please select or create a pool to manage bouts.
              </Alert>
            ) : poolBouts.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                No bouts added yet. Click "Add Bout" to get started.
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Opponent</TableCell>
                      <TableCell align="center">Score</TableCell>
                      <TableCell align="center">Result</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {poolBouts.map(bout => (
                      <TableRow key={bout.id}>
                        <TableCell>{bout.opponentName}</TableCell>
                        <TableCell align="center">
                          <Typography 
                            variant="body1" 
                            color={bout.victory ? 'success.main' : 'error.main'}
                          >
                            {bout.scoreFor} - {bout.scoreAgainst}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {bout.victory ? (
                            <Typography color="success.main">Victory</Typography>
                          ) : (
                            <Typography color="error.main">Defeat</Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small"
                              onClick={() => handleOpenEditBoutDialog(bout)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small"
                              onClick={() => handleOpenDeleteDialog(bout)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Add Pool Dialog */}
      <Dialog open={openPoolDialog} onClose={handleClosePoolDialog}>
        <DialogTitle>Add New Pool</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="poolNumber"
            label="Pool Number"
            type="number"
            fullWidth
            value={poolFormData.poolNumber}
            onChange={handlePoolInputChange}
            required
          />
          <TextField
            margin="dense"
            name="numberOfFencers"
            label="Number of Fencers in Pool"
            type="number"
            fullWidth
            value={poolFormData.numberOfFencers}
            onChange={handlePoolInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePoolDialog}>Cancel</Button>
          <Button onClick={handlePoolSubmit} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add/Edit Bout Dialog */}
      <Dialog open={openBoutDialog} onClose={handleCloseBoutDialog}>
        <DialogTitle>
          {boutDialogMode === 'add' ? 'Add New Bout' : 'Edit Bout'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="opponentName"
            label="Opponent Name"
            type="text"
            fullWidth
            value={boutFormData.opponentName}
            onChange={handleBoutInputChange}
            required
          />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                name="scoreFor"
                label="Your Score"
                type="number"
                fullWidth
                value={boutFormData.scoreFor}
                onChange={handleBoutInputChange}
                required
                error={boutFormData.victory && parseInt(boutFormData.scoreFor) <= parseInt(boutFormData.scoreAgainst)}
                helperText={boutFormData.victory && parseInt(boutFormData.scoreFor) <= parseInt(boutFormData.scoreAgainst) ? 
                  "Score must be higher for victory" : ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="scoreAgainst"
                label="Opponent Score"
                type="number"
                fullWidth
                value={boutFormData.scoreAgainst}
                onChange={handleBoutInputChange}
                required
                error={!boutFormData.victory && parseInt(boutFormData.scoreFor) > parseInt(boutFormData.scoreAgainst)}
                helperText={!boutFormData.victory && parseInt(boutFormData.scoreFor) > parseInt(boutFormData.scoreAgainst) ? 
                  "Score must be lower for defeat" : ""}
              />
            </Grid>
          </Grid>
          <FormControlLabel
            control={
              <Switch
                checked={boutFormData.victory}
                onChange={handleBoutSwitchChange}
                name="victory"
                color="primary"
              />
            }
            label="Victory"
            sx={{ mt: 2 }}
          />
          <FormHelperText>
            Victory is automatically set based on scores when they are not equal. When scores are equal, you can manually set victory or defeat.
          </FormHelperText>
          <TextField
            margin="dense"
            name="notes"
            label="Notes"
            type="text"
            fullWidth
            multiline
            rows={2}
            value={boutFormData.notes}
            onChange={handleBoutInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBoutDialog}>Cancel</Button>
          <Button onClick={handleBoutSubmit} variant="contained">
            {boutDialogMode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this bout against {boutToDelete?.opponentName}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteBout} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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