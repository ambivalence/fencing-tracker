import React from 'react';
import { Box, Typography } from '@mui/material';

export default function TournamentDetail() {
  return (
    <Box>
      <Typography variant="h4">Tournament Detail</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        This page will show detailed information about a specific tournament, including entries, results, and statistics.
      </Typography>
    </Box>
  );
}