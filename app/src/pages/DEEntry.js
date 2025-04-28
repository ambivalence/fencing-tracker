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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { DataContext } from '../context/DataContext';
import { getDERoundName } from '../utils/helpers';

export default function DEEntry() {
  const { id: entryId } = useParams();
  const navigate = useNavigate();
  const { 
    getEntry, 
    getFencer, 
    getTournament, 
    deBouts, 
    addDEBout, 
    updateDEBout, 
    deleteDEBout 
  } = useContext(DataContext);
  
  const [entry, setEntry] = useState(null);
  const [fencer, setFencer] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [entryBouts, setEntryBouts] = useState([]);
  
  // Dialog states
  const [openBoutDialog, setOpenBoutDialog] = useState(false);
  const [boutDialogMode, setBoutDialogMode] = useState('add');
  const [currentBout, setCurrentBout] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [boutToDelete, setBoutToDelete] = useState(null);
  
  // Form data
  const [boutFormData, setBoutFormData] = useState({
    round: '',
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
      
      // Get DE bouts for this entry
      const filteredBouts = deBouts.filter(bout => bout.entryId === entryId);
      // Sort by round (largest to smallest, e.g., 64, 32, 16...)
      const sortedBouts = filteredBouts.sort((a, b) => b.round - a.round);
      setEntryBouts(sortedBouts);
    }
  }, [entryId, getEntry, getFencer, getTournament, deBouts]);
  
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
  
  // Bout dialog handlers
  const handleOpenAddBoutDialog = () => {
    setBoutDialogMode('add');
    setBoutFormData({
      round: '',
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
      round: bout.round || '',
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
    
    if (!boutFormData.round) {
      setSnackbar({
        open: true,
        message: "Round is required",
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
        entryId,
        round: parseInt(boutFormData.round),
        scoreFor: parseInt(boutFormData.scoreFor) || 0,
        scoreAgainst: parseInt(boutFormData.scoreAgainst) || 0,
      };
      addDEBout(newBout);
      setSnackbar({
        open: true,
        message: 'Bout added successfully',
        severity: 'success',
      });
    } else {
      updateDEBout(currentBout.id, {
        ...boutFormData,
        round: parseInt(boutFormData.round),
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
    deleteDEBout(boutToDelete.id);
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
  
  // Calculate DE statistics
  const totalBouts = entryBouts.length;
  const victories = entryBouts.filter(bout => bout.victory).length;
  const winPercentage = totalBouts > 0 ? (victories / totalBouts) * 100 : 0;
  const touchesScored = entryBouts.reduce((sum, bout) => sum + bout.scoreFor, 0);
  const touchesReceived = entryBouts.reduce((sum, bout) => sum + bout.scoreAgainst, 0);
  const indicator = touchesScored - touchesReceived;
  
  // Find the furthest round reached
  const furthestRound = entryBouts.length > 0 
    ? Math.min(...entryBouts.filter(bout => bout.victory).map(bout => bout.round / 2).concat([64]))
    : null;
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBackToTournament} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Direct Elimination
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
        
        {/* DE Statistics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              DE Statistics
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
                      {victories} / {totalBouts}
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
                      {winPercentage.toFixed(1)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Furthest Round
                    </Typography>
                    <Typography variant="h5" component="div">
                      {furthestRound ? getDERoundName(furthestRound) : 'N/A'}
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
                      {touchesScored}
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
                      {touchesReceived}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Final Result */}
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Final Result
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {entry.finalPlacing ? (
              <Box sx={{ textAlign: 'center' }}>
                <EmojiEventsIcon 
                  sx={{ 
                    fontSize: 60, 
                    color: entry.finalPlacing <= 3 
                      ? ['gold', 'silver', '#cd7f32'][entry.finalPlacing - 1] 
                      : 'text.secondary' 
                  }} 
                />
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {entry.finalPlacing}{getPlacingSuffix(entry.finalPlacing)} Place
                </Typography>
              </Box>
            ) : (
              <Alert severity="info">
                No final placing recorded. You can add it in the tournament entry details.
              </Alert>
            )}
          </Paper>
        </Grid>
        
        {/* DE Bouts */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                DE Bouts
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAddBoutDialog}
              >
                Add Bout
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {entryBouts.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                No DE bouts added yet. Click "Add Bout" to get started.
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Round</TableCell>
                      <TableCell>Opponent</TableCell>
                      <TableCell align="center">Score</TableCell>
                      <TableCell align="center">Result</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entryBouts.map(bout => (
                      <TableRow key={bout.id}>
                        <TableCell>{getDERoundName(bout.round)}</TableCell>
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
          
          {/* DE Bracket Visualization Placeholder */}
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              DE Bracket
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1" gutterBottom>
                Bracket visualization will be available in a future update.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add DE bouts to track your progress through the direct elimination rounds.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Add/Edit Bout Dialog */}
      <Dialog open={openBoutDialog} onClose={handleCloseBoutDialog}>
        <DialogTitle>
          {boutDialogMode === 'add' ? 'Add New DE Bout' : 'Edit DE Bout'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Round</InputLabel>
            <Select
              name="round"
              value={boutFormData.round}
              onChange={handleBoutInputChange}
              label="Round"
              required
            >
              <MenuItem value={64}>Table of 64</MenuItem>
              <MenuItem value={32}>Table of 32</MenuItem>
              <MenuItem value={16}>Table of 16</MenuItem>
              <MenuItem value={8}>Quarterfinals</MenuItem>
              <MenuItem value={4}>Semifinals</MenuItem>
              <MenuItem value={2}>Finals</MenuItem>
              <MenuItem value={1}>Gold Medal Bout</MenuItem>
            </Select>
          </FormControl>
          <TextField
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
            Are you sure you want to delete this bout against {boutToDelete?.opponentName} in the {boutToDelete && getDERoundName(boutToDelete.round)}?
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

// Helper function for placing suffixes
function getPlacingSuffix(placing) {
  if (placing % 10 === 1 && placing % 100 !== 11) {
    return 'st';
  } else if (placing % 10 === 2 && placing % 100 !== 12) {
    return 'nd';
  } else if (placing % 10 === 3 && placing % 100 !== 13) {
    return 'rd';
  } else {
    return 'th';
  }
}