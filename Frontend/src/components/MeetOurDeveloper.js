
import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Kushagraimg from '../assets/kushagraimg.jpg';

// Playful bounce for heading
const bounceIn = keyframes`
  0% { transform: scale(0.7); opacity: 0; }
  60% { transform: scale(1.1); opacity: 1; }
  80% { transform: scale(0.95); }
  100% { transform: scale(1); }
`;

const PlayfulHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  // color: theme.palette.primary.main,
  color:'hsl(219, 43.00%, 51.20%)',
  textAlign: 'center',
  marginBottom: theme.spacing(5),
  letterSpacing: 2,
  fontSize: '2.5rem',
  fontFamily: 'Quicksand, Poppins, Arial, sans-serif',
  animation: `${bounceIn} 1.2s cubic-bezier(0.23, 1, 0.32, 1)`,
}));

const PlayfulCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255,255,255,0.95)',
  borderRadius: 28,
  boxShadow: '0 6px 32px 0 rgba(161, 196, 253, 0.18)',
  border: '2.5px solid #f7cac9',
  transition: 'box-shadow 0.3s, transform 0.3s, border 0.3s',
  position: 'relative',
  overflow: 'visible',
  '&:hover': {
    boxShadow: '0 12px 36px 0 #f7cac9cc',
    border: '2.5px solid #92a8d1',
    transform: 'scale(1.06) rotate(-2deg)',
  },
}));

const PlayfulAvatar = styled(Avatar)(({ theme }) => ({
  width: 110,
  height: 110,
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 16px 0 #f7cac9',
  border: '4px solid #92a8d1',
  background: 'linear-gradient(135deg, #f7cac9 0%, #92a8d1 100%)',
  transition: 'box-shadow 0.3s, border 0.3s',
  '&:hover': {
    boxShadow: '0 8px 32px 0 #92a8d1',
    border: '4px solid #f7cac9',
  },
}));

const developers = [
  {
    name: 'Kushagra Singh Bias',
    role: 'Frontend Developer',
    // img: 'https://randomuser.me/api/portraits/men/32.jpg',
    img:Kushagraimg,
    bio: 'Passionate about building beautiful and performant UIs with React and Material-UI.'
  },
  {
    name: 'Lakshya Bagora',
    role: 'Backend Developer',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    bio: 'Loves designing robust APIs and scalable backend systems with Java and Spring Boot.'
  },
  {
    name: 'Ronak',
    role: 'Bakend Developer',
    img: 'https://randomuser.me/api/portraits/men/65.jpg',
    
    bio: 'Enjoys working across the stack and bringing ideas to life from database to UI.'
  },
  {
    name: 'Paridhi Patidar',
    role: 'Backend Developer',
    img: 'https://randomuser.me/api/portraits/women/68.jpg',
    bio: 'Designs intuitive and delightful user experiences for web and mobile apps.'
  },
  {
    name: 'Sidharth Valecha',
    role: 'Backend Developer',
    img: 'https://randomuser.me/api/portraits/men/75.jpg',
    bio: 'Automates deployments and ensures smooth CI/CD pipelines for the team.'
  },
  {
    name: 'Rimzim Soni',
    role: 'Frontend Developer',
    img: 'https://randomuser.me/api/portraits/women/50.jpg',
    bio: 'Ensures the highest quality by testing and breaking things before users do.'
  },
  {
    name: 'Dakshta Sen',
    role: 'Frontend Developer',
    img: 'https://randomuser.me/api/portraits/men/80.jpg',
    bio: 'Keeps the team on track and ensures timely delivery of awesome products.'
  }
];

const localTheme = createTheme({
  typography: {
    fontFamily: 'Quicksand, Poppins, Arial, sans-serif',
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#92a8d1',
    },
    background: {
      default: '#f7cac9',
    },
    text: {
      primary: '#222',
      secondary: '#555',
    },
  },
});

const cardVariants = {
  offscreen: { opacity: 0, y: 60, scale: 0.9 },
  onscreen: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.2 + i * 0.1, type: 'spring', bounce: 0.55, duration: 0.7 },
  }),
  hover: {
    scale: 1.08,
    rotate: -2,
    transition: { type: 'spring', stiffness: 300, damping: 12 },
  },
};

const floatAnim = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
    },
  },
};

const PlayfulShape = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  opacity: 0.25,
  zIndex: 0,
}));

const MeetOurDeveloper = () => {
  const theme = useTheme();
  const background =
    'linear-gradient(120deg, #f7cac9 0%, #92a8d1 100%)';

  return (
    <ThemeProvider theme={localTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          position: 'relative',
          background: background,
          py: 8,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Playful floating shapes */}
        <PlayfulShape sx={{ top: 40, left: 60, width: 120, height: 120, background: '#92a8d1' }} />
        <PlayfulShape sx={{ bottom: 60, right: 80, width: 160, height: 160, background: '#f7cac9' }} />
        <PlayfulShape sx={{ top: 120, right: 120, width: 80, height: 80, background: '#ffe5b4' }} />
        <Container maxWidth="lg">
          <PlayfulHeading variant="h2">
            Meet Our Developers
          </PlayfulHeading>
          <Grid container spacing={5} justifyContent="center">
            {developers.map((dev, idx) => (
              <Grid item xs={12} sm={6} md={4} key={dev.name}>
                <motion.div
                  initial="offscreen"
                  whileInView="onscreen"
                  whileHover="hover"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={cardVariants}
                  custom={idx}
                  style={{ borderRadius: 28 }}
                >
                  <motion.div {...floatAnim}>
                    <PlayfulCard>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 3 }}>
                        <PlayfulAvatar
                          src={dev.img}
                          alt={dev.name}
                        />
                        <CardContent sx={{ textAlign: 'center' }}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#222' }}>
                            {dev.name}
                          </Typography>
                          <Typography variant="subtitle1" color="primary" sx={{ mb: 1, fontWeight: 500 }}>
                            {dev.role}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {dev.bio}
                          </Typography>
                        </CardContent>
                      </Box>
                    </PlayfulCard>
                  </motion.div>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default MeetOurDeveloper; 