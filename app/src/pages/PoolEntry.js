import React from 'react';
import { Box, Typography } from '@mui/material';

export default function PoolEntry() {
  return (
    <Box>
      <Typography variant="h4">Pool Entry</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        This page will allow users to enter pool bout results for a tournament entry.
      </Typography>
    </Box>
  );
}