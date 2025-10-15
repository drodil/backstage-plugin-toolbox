import { useState, useMemo } from 'react';
import { useApp } from '@backstage/core-plugin-api';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const BackstageIcons = () => {
    const [search, setSearch] = useState('');
    const [copiedIcon, setCopiedIcon] = useState<string | null>(null);
    const app = useApp();
    
    // Get all registered Backstage icons
    const allIcons = useMemo(() => {
        const icons = app.getSystemIcons?.() || {};
        return Object.keys(icons).sort();
    }, [app]);
    
    const getIconComponent = (iconName: string) => {
        return app.getSystemIcon(iconName);
    };

    // Filter icons based on search
    const filteredIcons = useMemo(() => {
        if (!search) return allIcons;
        const searchLower = search.toLowerCase();
        return allIcons.filter(iconName => 
            iconName.toLowerCase().includes(searchLower)
        );
    }, [search, allIcons]);

    const handleCopyIconName = (iconName: string) => {
        navigator.clipboard.writeText(iconName);
        setCopiedIcon(iconName);
    };

    const handleCopyUsage = (iconName: string) => {
        const usageExample = `app.getSystemIcon('${iconName}')`;
        navigator.clipboard.writeText(usageExample);
        setCopiedIcon(iconName);
    };

    const handleCloseSnackbar = () => {
        setCopiedIcon(null);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Search icons..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    variant="outlined"
                />
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Found {filteredIcons.length} of {allIcons.length} icons
                </Typography>
            </Box>

            <Grid container spacing={2}>
                {filteredIcons.map((iconName) => {
                    const IconComponent = getIconComponent(iconName);
                    
                    return (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={iconName}>
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 1,
                                    height: '100%',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        elevation: 3,
                                        transform: 'translateY(-2px)',
                                        boxShadow: 3,
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: 48,
                                        fontSize: 40,
                                    }}
                                >
                                    {IconComponent && <IconComponent />}
                                </Box>
                                
                                <Typography
                                    variant="caption"
                                    sx={{
                                        textAlign: 'center',
                                        wordBreak: 'break-word',
                                        fontSize: '0.7rem',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {iconName}
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Tooltip title="Copy icon name">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleCopyIconName(iconName)}
                                            sx={{ p: 0.5 }}
                                        >
                                            <ContentCopyIcon sx={{ fontSize: 16 }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Copy usage example">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleCopyUsage(iconName)}
                                            sx={{ p: 0.5 }}
                                        >
                                            <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>
                                                {'</>'}
                                            </Typography>
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>

            {filteredIcons.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No icons found matching "{search}"
                    </Typography>
                </Box>
            )}

            <Snackbar
                open={copiedIcon !== null}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Copied {copiedIcon} to clipboard!
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default BackstageIcons;
