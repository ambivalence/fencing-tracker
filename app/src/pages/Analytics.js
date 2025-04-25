import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { DataContext } from '../context/DataContext';
import { formatDate } from '../utils/helpers';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const { id: fencerId } = useParams();
  const { getFencer, getFencerStats, getPerformanceTrend } = useContext(DataContext);
  const [fencer, setFencer] = useState(null);
  const [stats, setStats] = useState(null);
  const [performanceTrend, setPerformanceTrend] = useState([]);

  useEffect(() => {
    const fencerData = getFencer(fencerId);
    setFencer(fencerData);
    
    if (fencerData) {
      const fencerStats = getFencerStats(fencerId);
      setStats(fencerStats);
      
      const trend = getPerformanceTrend(fencerId);
      setPerformanceTrend(trend);
    }
  }, [fencerId, getFencer, getFencerStats, getPerformanceTrend]);

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

  // Prepare data for win percentage chart
  const winPercentageChartData = {
    labels: performanceTrend.map(tournament => formatDate(tournament.date)),
    datasets: [
      {
        label: 'Win Percentage',
        data: performanceTrend.map(tournament => tournament.winPercentage),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  // Prepare data for indicator chart
  const indicatorChartData = {
    labels: performanceTrend.map(tournament => formatDate(tournament.date)),
    datasets: [
      {
        label: 'Indicator',
        data: performanceTrend.map(tournament => tournament.indicator),
        backgroundColor: performanceTrend.map(tournament => 
          tournament.indicator >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
        ),
      },
    ],
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Analytics: {fencer.name}</Typography>
        <Button
          variant="outlined"
          component={RouterLink}
          to={`/fencers/${fencerId}`}
        >
          Back to Fencer
        </Button>
      </Box>

      {stats && stats.totalTournaments > 0 ? (
        <Grid container spacing={3}>
          {/* Overall Stats */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Overall Performance
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
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
                <Grid item xs={12} sm={6} md={3}>
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
                <Grid item xs={12} sm={6} md={3}>
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
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        DE Win %
                      </Typography>
                      <Typography variant="h4">
                        {stats.deWinPercentage.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2">
                        {stats.deVictories} / {stats.totalDEBouts} bouts
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Win Percentage Chart */}
          {performanceTrend.length > 1 && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Win Percentage Trend
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300 }}>
                  <Line 
                    data={winPercentageChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          min: 0,
                          max: 100,
                          title: {
                            display: true,
                            text: 'Win %'
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          )}

          {/* Indicator Chart */}
          {performanceTrend.length > 1 && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Indicator Trend
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ height: 300 }}>
                  <Bar 
                    data={indicatorChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          title: {
                            display: true,
                            text: 'Indicator'
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No tournament data available
          </Typography>
          <Typography variant="body1" paragraph>
            Add tournament results for this fencer to see analytics.
          </Typography>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/tournaments"
          >
            Add Tournament Result
          </Button>
        </Paper>
      )}
    </Box>
  );
}