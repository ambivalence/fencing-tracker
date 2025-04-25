import React, { useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataContext } from '../context/DataContext';
import { formatDate } from '../utils/helpers';

export default function TournamentList() {
  const { tournaments, addTournament, updateTournament, deleteTournament } = useContext(DataContext);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [currentTournament, setCurrentTournament] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    level: '',
  });
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState(null);

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      name: '',
      location: '',
      startDate: '',
      endDate: '',
      level: '',
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (tournament) => {
    setDialogMode('edit');
    setCurrentTournament(tournament);
    setFormData({
      name: tournament.name || '',
      location: tournament.location || '',
      startDate: tournament.startDate || '',
      endDate: tournament.endDate || '',
      level: tournament.level || '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name) {
      alert("Tournament name is required.");
      return;
    }
    
    if (!formData.startDate) {
      alert("Start date is required.");
      return;
    }
    
    if (dialogMode === 'add') {
      addTournament(formData);
    } else {
      updateTournament(currentTournament.id, formData);
    }
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (tournament) => {
    setTournamentToDelete(tournament);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTournamentToDelete(null);
  };

  const handleDeleteTournament = () => {
    deleteTournament(tournamentToDelete.id);
    setDeleteDialogOpen(false);
    setTournamentToDelete(null);
  };

  // Sort tournaments by date (most recent first)
  const sortedTournaments = [...tournaments].sort((a, b) => {
    return new Date(b.startDate) - new Date(a.startDate);
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Tournaments</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Tournament
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Level</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTournaments.length > 0 ? (
              sortedTournaments.map((tournament) => (
                <TableRow 
                  key={tournament.id} 
                  hover
                  component={RouterLink}
                  to={`/tournaments/${tournament.id}`}
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'none',
                    },
                  }}
                >
                  <TableCell>{tournament.name}</TableCell>
                  <TableCell>
                    {formatDate(tournament.startDate)}
                    {tournament.endDate && tournament.endDate !== tournament.startDate && 
                      ` - ${formatDate(tournament.endDate)}`}
                  </TableCell>
                  <TableCell>{tournament.location}</TableCell>
                  <TableCell>
                    {tournament.level && (
                      <Chip 
                        label={tournament.level} 
                        size="small"
                        color={
                          tournament.level === 'National' || tournament.level === 'International' 
                            ? 'primary' 
                            : 'default'
                        }
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleOpenEditDialog(tournament);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleOpenDeleteDialog(tournament);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No tournaments added yet. Click "Add Tournament" to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Add/Edit Tournament Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Tournament' : 'Edit Tournament'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Tournament Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            required
            error={!formData.name}
            helperText={!formData.name ? "Tournament name is required" : ""}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            value={formData.location}
            onChange={handleInputChange}
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
            value={formData.startDate}
            onChange={handleInputChange}
            required
            error={!formData.startDate}
            helperText={!formData.startDate ? "Start date is required" : ""}
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
            value={formData.endDate}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="level"
            label="Level (Local, Regional, National, International)"
            type="text"
            fullWidth
            value={formData.level}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={!formData.name || !formData.startDate}
          >
            {dialogMode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the tournament "{tournamentToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteTournament} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}