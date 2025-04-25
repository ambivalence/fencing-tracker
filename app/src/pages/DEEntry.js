import React from 'react';
import { Box, Typography } from '@mui/material';

export default function DEEntry() {
  return (
    <Box>
      <Typography variant="h4">Direct Elimination Entry</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        This page will allow users to enter direct elimination bout results for a tournament entry.
      </Typography>
    </Box>
  );
}