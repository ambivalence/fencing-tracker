import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  Link,
} from '@mui/material';
import { DataContext } from '../context/DataContext';
import { formatDate } from '../utils/helpers';

export default function Dashboard() {
  const { fencers, tournaments, entries } = useContext(DataContext);
  
  // Get upcoming tournaments (those with start dates in the future)
  const upcomingTournaments = tournaments
    .filter(tournament => new Date(tournament.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3);
  
  // Get recent tournaments (those with end dates in the past)
  const recentTournaments = tournaments
    .filter(tournament => new Date(tournament.endDate) < new Date())
    .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
    .slice(0, 3);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Fencer Cards */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Your Fencers
          </Typography>
          <Grid container spacing={2}>
            {fencers.length > 0 ? (
              fencers.map(fencer => (
                <Grid item xs={12} sm={6} md={4} key={fencer.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {fencer.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {fencer.club}
                      </Typography>
                      <Typography variant="body2">
                        Primary Weapon: {fencer.primaryWeapon}
                      </Typography>
                      {fencer.rating && (
                        <Typography variant="body2">
                          Rating: {fencer.rating}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        component={RouterLink} 
                        to={`/fencers/${fencer.id}`}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="small" 
                        component={RouterLink} 
                        to={`/analytics/${fencer.id}`}
                      >
                        Analytics
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body1">
                    No fencers added yet.
                  </Typography>
                  <Button 
                    variant="contained" 
                    component={RouterLink} 
                    to="/fencers" 
                    sx={{ mt: 1 }}
                  >
                    Add Fencer
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Grid>
        
        {/* Upcoming Tournaments */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Tournaments
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {upcomingTournaments.length > 0 ? (
              <List>
                {upcomingTournaments.map(tournament => (
                  <ListItem key={tournament.id} disablePadding>
                    <ListItemText
                      primary={
                        <Link component={RouterLink} to={`/tournaments/${tournament.id}`}>
                          {tournament.name}
                        </Link>
                      }
                      secondary={`${formatDate(tournament.startDate)} - ${formatDate(tournament.endDate)}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                No upcoming tournaments.
              </Typography>
            )}
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button 
                variant="outlined" 
                component={RouterLink} 
                to="/tournaments"
              >
                View All Tournaments
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Recent Results */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Results
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {recentTournaments.length > 0 ? (
              <List>
                {recentTournaments.map(tournament => {
                  const tournamentEntries = entries.filter(
                    entry => entry.tournamentId === tournament.id
                  );
                  
                  return (
                    <ListItem key={tournament.id} disablePadding>
                      <ListItemText
                        primary={
                          <Link component={RouterLink} to={`/tournaments/${tournament.id}`}>
                            {tournament.name}
                          </Link>
                        }
                        secondary={
                          <>
                            {formatDate(tournament.endDate)}
                            <br />
                            {tournamentEntries.length} {tournamentEntries.length === 1 ? 'entry' : 'entries'}
                          </>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                No recent tournament results.
              </Typography>
            )}
            <Box sx={{ mt: 2, textAlign: 'right' }}>
              <Button 
                variant="outlined" 
                component={RouterLink} 
                to="/tournaments"
              >
                View All Results
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Quick Links */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  component={RouterLink} 
                  to="/fencers"
                >
                  Manage Fencers
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button 
                  variant="contained" 
                  fullWidth 
                  component={RouterLink} 
                  to="/tournaments"
                >
                  Manage Tournaments
                </Button>
              </Grid>
              {fencers.length > 0 && (
                <Grid item xs={12} sm={6} md={3}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    component={RouterLink} 
                    to={`/analytics/${fencers[0].id}`}
                  >
                    View Analytics
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}