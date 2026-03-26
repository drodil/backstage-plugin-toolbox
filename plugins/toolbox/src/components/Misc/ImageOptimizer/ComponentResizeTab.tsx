import {
    Box, Button, CircularProgress, FormControl, FormControlLabel, Grid,
    InputAdornment, InputLabel, MenuItem, Select, Switch, TextField
} from "@material-ui/core";

interface ComponentResizeTabProps {
    resizeAlgorithm: string;
    setResizeAlgorithm: (type: string) => void;
    resizePreset: number;
    setResizePreset: (type: number) => void;
    resizeWidth: number | string;
    setResizeWidth: (type: number | string) => void;
    resizeHeight: number | string;
    setResizeHeight: (type: number | string) => void;
    resizeMaintainAspect: boolean;
    setResizeMaintainAspect: (type: boolean) => void;
    aspectRatio: number;
    processImage: () => void;
    ready: boolean;
    inputBytes: Uint8Array | null;
    loadingState: boolean;
    originalResizeWidth: number;
    originalResizeHeight: number;
}

export const ComponentResizeTab = ({ resizeAlgorithm, setResizeAlgorithm, resizePreset,
    setResizePreset, resizeWidth, setResizeWidth, resizeHeight,
    setResizeHeight, resizeMaintainAspect, setResizeMaintainAspect, aspectRatio,
    processImage, ready, inputBytes, loadingState, originalResizeHeight,
    originalResizeWidth }: ComponentResizeTabProps) => {

    return (
        <Grid container spacing={3}>
            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel>Algorithm</InputLabel>
                    <Select
                        value={resizeAlgorithm}
                        onChange={e =>
                            setResizeAlgorithm(e.target.value as string)
                        }
                    >
                        <MenuItem value="lanczos3">Lanczos3 (recommended) </MenuItem>
                        <MenuItem value="bilinear">Bilinear</MenuItem>
                        <MenuItem value="nearest">Nearest (fast)</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel>Preset</InputLabel>
                    <Select
                        value={resizePreset}
                        onChange={e => {
                            setResizePreset(e.target.value as number);
                            let presetVal = Number(e.target.value) / 100;

                            let resizeHeightFactor = Number(originalResizeHeight) * presetVal;
                            let resizeWidthFactor = Number(originalResizeWidth) * presetVal;

                            resizeHeightFactor = Math.round(resizeHeightFactor);
                            resizeWidthFactor = Math.round(resizeWidthFactor);

                            setResizeHeight(resizeHeightFactor);
                            setResizeWidth(resizeWidthFactor);
                        }}
                    >
                        <MenuItem value="25">25%</MenuItem>
                        <MenuItem value="50">50%</MenuItem>
                        <MenuItem value="100">100%</MenuItem>
                        <MenuItem value="200">200%</MenuItem>
                        <MenuItem value="400">400%</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12}>
                <Box display="flex" justifyContent="center">
                    <FormControlLabel
                        control={
                            <Switch
                                defaultChecked
                                checked={resizeMaintainAspect}
                                onChange={e =>
                                    setResizeMaintainAspect(e.target.checked)
                                }
                            />
                        }
                        label="Maintain aspect ratio"
                    />
                </Box>
            </Grid>

            <Grid item xs={6}>
                <TextField
                    id="width"
                    label="Width"
                    variant="outlined"
                    type="number"
                    autoComplete="off"
                    value={resizeWidth}
                    error={Number(resizeWidth) < 0}
                    helperText={Number(resizeWidth) < 0 ? "value to small" : ""}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">px</InputAdornment>
                        ),
                    }}
                    onChange={e => {
                        const rawVal = e.target.value;
                        const val = rawVal === '' ? '' : Math.round(Number(rawVal));
                        setResizeWidth(val);

                        if (
                            resizeMaintainAspect &&
                            val !== '' &&
                            aspectRatio > 0
                        ) {
                            const newHeight = Number(val) / aspectRatio;
                            setResizeHeight(Math.round(newHeight));
                        }
                    }}
                />
            </Grid>

            <Grid item xs={6}>
                <TextField
                    id="height"
                    label="Height"
                    variant="outlined"
                    type="number"
                    autoComplete="off"
                    value={resizeHeight}
                    error={Number(resizeWidth) < 0}
                    helperText={Number(resizeWidth) < 0 ? "value to small" : ""}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">px</InputAdornment>
                        ),
                    }}
                    onChange={e => {
                        const rawVal = e.target.value;
                        const val = rawVal === '' ? '' : Math.round(Number(rawVal));
                        setResizeHeight(val);

                        if (
                            resizeMaintainAspect &&
                            val !== '' &&
                            aspectRatio > 0
                        ) {
                            const newWidth = Number(val) * aspectRatio;
                            setResizeWidth(Math.round(newWidth));
                        }
                    }}
                />
            </Grid>

            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={processImage}
                    disabled={!ready || !inputBytes || loadingState ||
                        Number(resizeWidth) < 0 || Number(resizeHeight) < 0}
                    fullWidth
                    startIcon={
                        loadingState ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : null
                    }
                >
                    {loadingState ? 'Processing...' : 'Run Resize'}
                </Button>
            </Grid>
        </Grid>
    )
}