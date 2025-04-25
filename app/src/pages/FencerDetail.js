import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { DataContext } from '../context/DataContext';
import { formatDate } from '../utils/helpers';

export default function FencerDetail() {
  const { id } = useParams();
  const { getFencer, entries, tournaments, getFencerStats } = useContext(DataContext);
  const [fencer, setFencer] = useState(null);
  const [stats, setStats] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fencerData = getFencer(id);
    setFencer(fencerData);
    
    if (fencerData) {
      const fencerStats = getFencerStats(id);
      setStats(fencerStats);
    }
  }, [id, getFencer, getFencerStats]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!fencer) {
    return (
      <Box>
        <Typography variant="h5">Fencer not found</Typography>
        <Button component={RouterLink} to="/fencers" sx={{ mt: 2 }}>
          Back to Fencers
        </Button>
      </Box>
    );
  }

  // Get fencer's tournament entries
  const fencerEntries = entries.filter(entry => entry.fencerId === id);
  
  // Get tournaments from entries
  const fencerTournaments = fencerEntries.map(entry => {
    const tournament = tournaments.find(t => t.tournamentId === entry.tournamentId);
    return {
      ...tournament,
      entry,
    };
  }).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{fencer.name}</Typography>
        <Button
          variant="contained"
          component={RouterLink}
          to={`/analytics/${id}`}
        >
          View Analytics
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Fencer Info Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Fencer Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List dense>
              {fencer.club && (
                <ListItem>
                  <ListItemText primary="Club" secondary={fencer.club} />
                </ListItem>
              )}
              {fencer.dateOfBirth && (
                <ListItem>
                  <ListItemText primary="Date of Birth" secondary={formatDate(fencer.dateOfBirth)} />
                </ListItem>
              )}
              {fencer.gender && (
                <ListItem>
                  <ListItemText 
                    primary="Gender" 
                    secondary={
                      fencer.gender === 'M' ? 'Male' : 
                      fencer.gender === 'F' ? 'Female' : 'Other'
                    } 
                  />
                </ListItem>
              )}
              <ListItem>
                <ListItemText primary="Primary Weapon" secondary={fencer.primaryWeapon || 'Not specified'} />
              </ListItem>
              {fencer.secondaryWeapon && (
                <ListItem>
                  <ListItemText primary="Secondary Weapon" secondary={fencer.secondaryWeapon} />
                </ListItem>
              )}
              {fencer.rating && (
                <ListItem>
                  <ListItemText primary="Rating" secondary={fencer.rating} />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Stats Card */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Overview
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {stats ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Tournaments
                      </Typography>
                      <Typography variant="h4">
                        {stats.totalTournaments}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Pool Win %
                      </Typography>
                      <Typography variant="h4">
                        {stats.poolWinPercentage.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2">
                        {stats.poolVictories} / {stats.totalPoolBouts} bouts
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Indicator
                      </Typography>
                      <Typography variant="h4" color={stats.indicator >= 0 ? 'success.main' : 'error.main'}>
                        {stats.indicator >= 0 ? '+' : ''}{stats.indicator}
                      </Typography>
                      <Typography variant="body2">
                        {stats.touchesScored} scored / {stats.touchesReceived} received
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Typography variant="body1">
                No statistics available yet. Add tournament results to see statistics.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Tournaments Tab */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="Tournaments" />
              <Tab label="Results" />
            </Tabs>
            <Box sx={{ p: 2 }}>
              {tabValue === 0 && (
                <>
                  {fencerTournaments.length > 0 ? (
                    <List>
                      {fencerTournaments.map((tournament) => (
                        <ListItem 
                          key={tournament.id} 
                          component={Paper} 
                          variant="outlined"
                          sx={{ mb: 1, display: 'block' }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="subtitle1">
                                <RouterLink to={`/tournaments/${tournament.id}`}>
                                  {tournament.name}
                                </RouterLink>
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(tournament.startDate)}
                                {tournament.location && ` • ${tournament.location}`}
                              </Typography>
                            </Box>
                            <Box>
                              {tournament.entry.finalPlacing && (
                                <Chip 
                                  label={`${tournament.entry.finalPlacing}${getPlacingSuffix(tournament.entry.finalPlacing)} Place`}
                                  color={
                                    tournament.entry.finalPlacing <= 3 ? 'success' : 'default'
                                  }
                                  variant="outlined"
                                />
                              )}
                            </Box>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                      No tournaments added yet for this fencer.
                    </Typography>
                  )}
                  <Box sx={{ mt: 2, textAlign: 'right' }}>
                    <Button 
                      variant="contained" 
                      component={RouterLink} 
                      to="/tournaments"
                    >
                      Add Tournament Result
                    </Button>
                  </Box>
                </>
              )}
              {tabValue === 1 && (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                  Detailed results view will be implemented in a future version.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
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