import React from 'react';
import { styled, Typography, useTheme, Box } from '@mui/material';

const ShinyHeader = ({ text, variant = "h4", align = "center", gutterBottom = true, sx = {} }) => {
  const theme = useTheme();

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
      mb: gutterBottom ? 6 : 3,
      width: '100%',
      position: 'relative'
    }}>
      <StyledWrapper align={align}>
        <Typography variant={variant} component="div" className="shiny-text" gutterBottom={false} sx={{
          fontWeight: 900,
          fontSize: variant === 'h4' ? { xs: '1.8rem', md: '2.5rem' } : undefined,
          ...sx
        }}>
          {text}
        </Typography>
      </StyledWrapper>

      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 180, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          height: 4,
          background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, #FFD700, transparent)`,
          marginTop: '8px',
          borderRadius: '4px',
          boxShadow: `0 0 15px ${theme.palette.primary.main}44`
        }}
      />
    </Box>
  );
}

const StyledWrapper = styled('div')(({ align }) => ({
  display: 'flex',
  justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
  width: '100%',

  '& .shiny-text': {
    position: 'relative',
    display: 'inline-block',
    background: 'linear-gradient(120deg, #FFFFFF 30%, #FFD700 50%, #FFFFFF 70%)',
    backgroundSize: '200% auto',
    color: '#000',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'shine 4s linear infinite',
  },

  '@keyframes shine': {
    '0%': { backgroundPosition: '200% center' },
    '100%': { backgroundPosition: '-200% center' },
  }
}));

export default ShinyHeader;
