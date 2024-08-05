import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './components/Main';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline, IconButton, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import './App.css';
const queryClient = new QueryClient();

function App() {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const storedMode = localStorage.getItem('themeMode');
    if (storedMode) {
      setMode(storedMode);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
      <img src = "drawio.svg" alt="My Happy SVG" style={{marginTop:95,}}/>
        <QueryClientProvider client={queryClient}>
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <IconButton onClick={toggleTheme} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Box>
          <BrowserRouter>
            <Routes>
              <Route exact path="/Main" element={ <Main />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </div>
    </ThemeProvider>
 
  );
}

export default App;
