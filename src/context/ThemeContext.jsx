/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useLanguage } from './LanguageContext';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');
    const { language } = useLanguage();

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const theme = useMemo(() => createTheme({
        direction: language === 'ar' ? 'rtl' : 'ltr',
        palette: {
            mode,
            primary: {
                main: '#D32F2F', // Brand Red
                dark: '#8B0000',
                light: '#FF5252',
            },
            secondary: {
                main: '#FFD700', // Gold as secondary accent
            },
            background: {
                default: mode === 'light' ? '#F8F9FA' : '#050505',
                paper: mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(10, 10, 10, 0.8)',
            },
            text: {
                primary: mode === 'light' ? '#1A1A1A' : '#FFFFFF',
                secondary: mode === 'light' ? '#666666' : '#A0A0A0',
            }
        },
        typography: {
            fontFamily: 'Cairo, Alexandria, Tajawal, Readex Pro, sans-serif',
            allVariants: {
                fontWeight: 600,
            },
            h1: { fontWeight: 900, letterSpacing: '-0.02em' },
            h2: { fontWeight: 900, letterSpacing: '-0.02em' },
            h3: { fontWeight: 800 },
            h4: { fontWeight: 800 },
            h5: { fontWeight: 700 },
            h6: { fontWeight: 700 },
            button: { fontWeight: 700, textTransform: 'none' },
        },
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        boxShadow: mode === 'light'
                            ? '0 4px 20px rgba(0,0,0,0.05)'
                            : '0 4px 20px rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(10px)',
                        background: mode === 'light'
                            ? 'rgba(255, 255, 255, 0.9)'
                            : 'rgba(30, 30, 30, 0.9)',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 30,
                        textTransform: 'none',
                        fontWeight: 600,
                    },
                },
            },
        },
    }), [mode, language]);

    return (
        <ThemeContext.Provider value={{ mode, toggleColorMode }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useColorMode = () => useContext(ThemeContext);
