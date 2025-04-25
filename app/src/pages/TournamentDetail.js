import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataContext } from '../context/DataContext';
import { formatDate, getWeaponName, getAgeCategoryName } from '../utils/helpers';

export default function TournamentDetail() {
  const { id } = useParams();
  const { 
    getTournament, 
    updateTournament, 
    fencers, 
    entries, 
    addEntry, 
    updateEntry, 
    deleteEntry 
  } = useContext(DataContext);
  
  const [tournament, setTournament] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [tournamentEntries, setTournamentEntries] = useState([]);
  
  // Dialog states
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openEntryDialog, setOpenEntryDialog] = useState(false);
  const [entryDialogMode, setEntryDialogMode] = useState('add');
  const [currentEntry, setCurrentEntry] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  
  // Form data
  const [tournamentFormData, setTournamentFormData] = useState({
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    level: '',
  });
  
  const [entryFormData, setEntryFormData] = useState({
    fencerId: '',
    weapon: '',
    ageCategory: '',
    initialSeeding: '',
    finalPlacing: '',
    notes: '',
  });
  
  useEffect(() => {
    const tournamentData = getTournament(id);
    setTournament(tournamentData);
    
    if (tournamentData) {
      setTournamentFormData({
        name: tournamentData.name || '',
        location: tournamentData.location || '',
        startDate: tournamentData.startDate || '',
        endDate: tournamentData.endDate || '',
        level: tournamentData.level || '',
      });
      
      // Get entries for this tournament
      const filteredEntries = entries.filter(entry => entry.tournamentId === id);
      setTournamentEntries(filteredEntries);
    }
  }, [id, getTournament, entries]);
  
  if (!tournament) {
    return (
      <Box>
        <Typography variant="h5">Tournament not found</Typography>
        <Button component={RouterLink} to="/tournaments" sx={{ mt: 2 }}>
          Back to Tournaments
        </Button>
      </Box>
    );
  }
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Tournament edit handlers
  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };
  
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };
  
  const handleTournamentInputChange = (e) => {
    const { name, value } = e.target;
    setTournamentFormData({
      ...tournamentFormData,
      [name]: value,
    });
  };
  
  const handleTournamentSubmit = () => {
    updateTournament(id, tournamentFormData);
    setOpenEditDialog(false);
    
    // Update local state
    setTournament({
      ...tournament,
      ...tournamentFormData,
    });
  };
  
  // Entry handlers
  const handleOpenAddEntryDialog = () => {
    setEntryDialogMode('add');
    setEntryFormData({
      fencerId: fencers.length > 0 ? fencers[0].id : '',
      weapon: '',
      ageCategory: '',
      initialSeeding: '',
      finalPlacing: '',
      notes: '',
    });
    setOpenEntryDialog(true);
  };
  
  const handleOpenEditEntryDialog = (entry) => {
    setEntryDialogMode('edit');
    setCurrentEntry(entry);
    setEntryFormData({
      fencerId: entry.fencerId || '',
      weapon: entry.weapon || '',
      ageCategory: entry.ageCategory || '',
      initialSeeding: entry.initialSeeding || '',
      finalPlacing: entry.finalPlacing || '',
      notes: entry.notes || '',
    });
    setOpenEntryDialog(true);
  };
  
  const handleCloseEntryDialog = () => {
    setOpenEntryDialog(false);
  };
  
  const handleEntryInputChange = (e) => {
    const { name, value } = e.target;
    setEntryFormData({
      ...entryFormData,
      [name]: value,
    });
  };
  
  const handleEntrySubmit = () => {
    if (entryDialogMode === 'add') {
      const newEntry = {
        ...entryFormData,
        tournamentId: id,
      };
      addEntry(newEntry);
    } else {
      updateEntry(currentEntry.id, entryFormData);
    }
    setOpenEntryDialog(false);
  };
  
  const handleOpenDeleteDialog = (entry) => {
    setEntryToDelete(entry);
    setOpenDeleteDialog(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setEntryToDelete(null);
  };
  
  const handleDeleteEntry = () => {
    deleteEntry(entryToDelete.id);
    setOpenDeleteDialog(false);
    setEntryToDelete(null);
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{tournament.name}</Typography>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={handleOpenEditDialog}
        >
          Edit Tournament
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {/* Tournament Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tournament Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List dense>
              <ListItem>
                <ListItemText 
                  primary="Date" 
                  secondary={
                    tournament.startDate === tournament.endDate || !tournament.endDate
                      ? formatDate(tournament.startDate)
                      : `${formatDate(tournament.startDate)} - ${formatDate(tournament.endDate)}`
                  } 
                />
              </ListItem>
              {tournament.location && (
                <ListItem>
                  <ListItemText primary="Location" secondary={tournament.location} />
                </ListItem>
              )}
              {tournament.level && (
                <ListItem>
                  <ListItemText primary="Level" secondary={tournament.level} />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        
        {/* Entries Summary */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Entries ({tournamentEntries.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenAddEntryDialog}
                disabled={fencers.length === 0}
              >
                Add Entry
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {fencers.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                You need to add fencers before you can create entries.
                <br />
                <Button 
                  component={RouterLink} 
                  to="/fencers" 
                  variant="outlined" 
                  sx={{ mt: 1 }}
                >
                  Add Fencers
                </Button>
              </Typography>
            ) : tournamentEntries.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                No entries added yet. Click "Add Entry" to get started.
              </Typography>
            ) : (
              <List>
                {tournamentEntries.map(entry => {
                  const fencer = fencers.find(f => f.id === entry.fencerId);
                  
                  return (
                    <ListItem 
                      key={entry.id}
                      secondaryAction={
                        <>
                          <IconButton 
                            edge="end" 
                            aria-label="edit"
                            onClick={() => handleOpenEditEntryDialog(entry)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={() => handleOpenDeleteDialog(entry)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      }
                    >
                      <ListItemText
                        primary={fencer?.name || 'Unknown Fencer'}
                        secondary={
                          <>
                            {entry.weapon && `${getWeaponName(entry.weapon)} • `}
                            {entry.ageCategory && `${getAgeCategoryName(entry.ageCategory)} • `}
                            {entry.finalPlacing && `${entry.finalPlacing}${getPlacingSuffix(entry.finalPlacing)} Place`}
                          </>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Paper>
        </Grid>
        
        {/* Tabs for Results */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Pool Results" />
              <Tab label="Direct Elimination" />
              <Tab label="Final Results" />
            </Tabs>
            <Box sx={{ p: 2 }}>
              {tabValue === 0 && (
                <Box>
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                    Pool results will be displayed here. Add entries first, then you can add pool results.
                  </Typography>
                  {tournamentEntries.length > 0 && (
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Button 
                        variant="contained"
                        component={RouterLink}
                        to={`/entries/${tournamentEntries[0].id}/pools`}
                      >
                        Enter Pool Results
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
              {tabValue === 1 && (
                <Box>
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                    Direct elimination results will be displayed here. Add entries first, then you can add DE results.
                  </Typography>
                  {tournamentEntries.length > 0 && (
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Button 
                        variant="contained"
                        component={RouterLink}
                        to={`/entries/${tournamentEntries[0].id}/de`}
                      >
                        Enter DE Results
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
              {tabValue === 2 && (
                <Box>
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                    Final results summary will be displayed here.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Edit Tournament Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Tournament</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Tournament Name"
            type="text"
            fullWidth
            value={tournamentFormData.name}
            onChange={handleTournamentInputChange}
            required
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            value={tournamentFormData.location}
            onChange={handleTournamentInputChange}
          />
          <TextField
            margin="dense"
            name="startDate"
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={tournamentFormData.startDate}
            onChange={handleTournamentInputChange}
            required
          />
          <TextField
            margin="dense"
            name="endDate"
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={tournamentFormData.endDate}
            onChange={handleTournamentInputChange}
          />
          <TextField
            margin="dense"
            name="level"
            label="Level (Local, Regional, National, International)"
            type="text"
            fullWidth
            value={tournamentFormData.level}
            onChange={handleTournamentInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleTournamentSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add/Edit Entry Dialog */}
      <Dialog open={openEntryDialog} onClose={handleCloseEntryDialog}>
        <DialogTitle>
          {entryDialogMode === 'add' ? 'Add New Entry' : 'Edit Entry'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Fencer</InputLabel>
            <Select
              name="fencerId"
              value={entryFormData.fencerId}
              onChange={handleEntryInputChange}
              label="Fencer"
              required
            >
              {fencers.map(fencer => (
                <MenuItem key={fencer.id} value={fencer.id}>
                  {fencer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Weapon</InputLabel>
            <Select
              name="weapon"
              value={entryFormData.weapon}
              onChange={handleEntryInputChange}
              label="Weapon"
            >
              <MenuItem value="F">Foil</MenuItem>
              <MenuItem value="E">Épée</MenuItem>
              <MenuItem value="S">Saber</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Age Category</InputLabel>
            <Select
              name="ageCategory"
              value={entryFormData.ageCategory}
              onChange={handleEntryInputChange}
              label="Age Category"
            >
              <MenuItem value="Y10">Y10 (Under 10)</MenuItem>
              <MenuItem value="Y12">Y12 (Under 12)</MenuItem>
              <MenuItem value="Y14">Y14 (Under 14)</MenuItem>
              <MenuItem value="Cadet">Cadet (Under 17)</MenuItem>
              <MenuItem value="Junior">Junior (Under 20)</MenuItem>
              <MenuItem value="Senior">Senior (Open)</MenuItem>
              <MenuItem value="Veteran">Veteran (40+)</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="initialSeeding"
            label="Initial Seeding"
            type="number"
            fullWidth
            value={entryFormData.initialSeeding}
            onChange={handleEntryInputChange}
          />
          <TextField
            margin="dense"
            name="finalPlacing"
            label="Final Placing"
            type="number"
            fullWidth
            value={entryFormData.finalPlacing}
            onChange={handleEntryInputChange}
          />
          <TextField
            margin="dense"
            name="notes"
            label="Notes"
            type="text"
            fullWidth
            multiline
            rows={2}
            value={entryFormData.notes}
            onChange={handleEntryInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEntryDialog}>Cancel</Button>
          <Button onClick={handleEntrySubmit} variant="contained">
            {entryDialogMode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this entry? This will also delete all pool and DE results for this entry.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteEntry} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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