import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#0047AB',
        borderTop: '3px solid #E31E24'
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center" sx={{ color: 'white', fontWeight: 500, mb: 1 }}>
          © {new Date().getFullYear()} Centre Missionnaire REHOBOTH - Côte d'Ivoire
        </Typography>
        <Typography variant="caption" align="center" display="block" sx={{ color: 'white', opacity: 0.95, mb: 0.5 }}>
          Cocody Angré 8e Tranche derrière le magasin Phenicia
        </Typography>
        <Typography variant="caption" align="center" display="block" sx={{ color: 'white', opacity: 0.95, mb: 1 }}>
          Contacts : 07 78 09 22 69 / 07 08 22 61 61
        </Typography>
        <Typography variant="caption" align="center" display="block" sx={{ mt: 1, color: 'white', opacity: 0.9 }}>
          Powered by <strong>ALiz Strategy</strong>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
