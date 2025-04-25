import React, { useState, useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataContext } from '../context/DataContext';

export default function FencerList() {
  const { fencers, addFencer, updateFencer, deleteFencer } = useContext(DataContext);
  const navigate = useNavigate();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [currentFencer, setCurrentFencer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    club: '',
    primaryWeapon: '',
    secondaryWeapon: '',
    rating: '',
  });
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fencerToDelete, setFencerToDelete] = useState(null);
  
  // Snackbar for validation errors
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  const handleOpenAddDialog = () => {
    setDialogMode('add');
    setFormData({
      name: '',
      dateOfBirth: '',
      gender: '',
      club: '',
      primaryWeapon: '',
      secondaryWeapon: '',
      rating: '',
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (fencer) => {
    setDialogMode('edit');
    setCurrentFencer(fencer);
    setFormData({
      name: fencer.name || '',
      dateOfBirth: fencer.dateOfBirth || '',
      gender: fencer.gender || '',
      club: fencer.club || '',
      primaryWeapon: fencer.primaryWeapon || '',
      secondaryWeapon: fencer.secondaryWeapon || '',
      rating: fencer.rating || '',
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
      setSnackbar({
        open: true,
        message: "Fencer name is required.",
        severity: "error"
      });
      return;
    }
    
    if (dialogMode === 'add') {
      addFencer(formData);
      setSnackbar({
        open: true,
        message: "Fencer added successfully!",
        severity: "success"
      });
    } else {
      updateFencer(currentFencer.id, formData);
      setSnackbar({
        open: true,
        message: "Fencer updated successfully!",
        severity: "success"
      });
    }
    setOpenDialog(false);
  };

  const handleOpenDeleteDialog = (fencer) => {
    setFencerToDelete(fencer);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setFencerToDelete(null);
  };

  const handleDeleteFencer = () => {
    deleteFencer(fencerToDelete.id);
    setDeleteDialogOpen(false);
    setFencerToDelete(null);
    setSnackbar({
      open: true,
      message: "Fencer deleted successfully",
      severity: "success"
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handleRowClick = (fencerId) => {
    navigate(`/fencers/${fencerId}`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Fencers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Fencer
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Club</TableCell>
              <TableCell>Primary Weapon</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fencers.length > 0 ? (
              fencers.map((fencer) => (
                <TableRow 
                  key={fencer.id} 
                  hover
                  onClick={() => handleRowClick(fencer.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{fencer.name}</TableCell>
                  <TableCell>{fencer.club}</TableCell>
                  <TableCell>{fencer.primaryWeapon}</TableCell>
                  <TableCell>{fencer.rating}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditDialog(fencer);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDeleteDialog(fencer);
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
                  No fencers added yet. Click "Add Fencer" to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Add/Edit Fencer Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Fencer' : 'Edit Fencer'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            required
            error={!formData.name}
            helperText={!formData.name ? "Name is required" : ""}
          />
          <TextField
            margin="dense"
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            value={formData.dateOfBirth}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              label="Gender"
            >
              <MenuItem value="M">Male</MenuItem>
              <MenuItem value="F">Female</MenuItem>
              <MenuItem value="O">Other</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="club"
            label="Club"
            type="text"
            fullWidth
            value={formData.club}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Primary Weapon</InputLabel>
            <Select
              name="primaryWeapon"
              value={formData.primaryWeapon}
              onChange={handleInputChange}
              label="Primary Weapon"
            >
              <MenuItem value="Foil">Foil</MenuItem>
              <MenuItem value="Épée">Épée</MenuItem>
              <MenuItem value="Saber">Saber</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Secondary Weapon</InputLabel>
            <Select
              name="secondaryWeapon"
              value={formData.secondaryWeapon}
              onChange={handleInputChange}
              label="Secondary Weapon"
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Foil">Foil</MenuItem>
              <MenuItem value="Épée">Épée</MenuItem>
              <MenuItem value="Saber">Saber</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="rating"
            label="Rating (e.g., E2022)"
            type="text"
            fullWidth
            value={formData.rating}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.name}>
            {dialogMode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {fencerToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteFencer} color="error" variant="contained">
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
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}