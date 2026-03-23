import { Box, Button, CircularProgress, FormControl, FormControlLabel, Grid, InputAdornment, InputLabel, MenuItem, Select, Switch, TextField } from "@material-ui/core";


interface ComponentResizeTabProps {

    resizeAlgorhythm: string;
    setResizeAlgorhythm: (type: string) => void;
    resizePreset: number;
    setResizePreset: (type: number) => void;
    resizeWidth: number | string;
    setResizeWidth: (type: number | string) => void;
    resizeHight: number | string;
    setResizeHight: (type: number | string) => void;
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

export const ComponentResizeTab = ({ resizeAlgorhythm, setResizeAlgorhythm, resizePreset, setResizePreset, resizeWidth, setResizeWidth, resizeHight,
    setResizeHight, resizeMaintainAspect, setResizeMaintainAspect, aspectRatio, processImage, ready, inputBytes, loadingState, originalResizeHeight,
    originalResizeWidth }: ComponentResizeTabProps) => {

    return (
        <Grid container spacing={3}>
            <Grid item xs={6}>
                <FormControl fullWidth>
                    <InputLabel>Algorythm</InputLabel>
                    <Select
                        value={resizeAlgorhythm}
                        onChange={e =>
                            setResizeAlgorhythm(e.target.value as string)
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

                            let resizeHightFactor = Number(originalResizeHeight) * presetVal;
                            let resizeWidthFactor = Number(originalResizeWidth) * presetVal;

                            setResizeHight(resizeHightFactor);
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
                    value={resizeWidth}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">px</InputAdornment>
                        ),
                    }}
                    onChange={e => {
                        const val = e.target.value;
                        setResizeWidth(val);

                        if (
                            resizeMaintainAspect &&
                            val !== '' &&
                            aspectRatio > 0
                        ) {
                            const newHight = Number(val) / aspectRatio;
                            setResizeHight(Math.round(newHight));
                        }
                    }}
                />
            </Grid>

            <Grid item xs={6}>
                <TextField
                    id="height"
                    label="Hight"
                    variant="outlined"
                    value={resizeHight}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">px</InputAdornment>
                        ),
                    }}
                    onChange={e => {
                        const val = e.target.value;
                        setResizeHight(val);

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
                    disabled={!ready || !inputBytes || loadingState}
                    fullWidth
                    startIcon={
                        loadingState ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : null
                    }
                >
                    {loadingState ? 'Verarbeite...' : 'Run Resize'}
                </Button>
            </Grid>
        </Grid>

    )
}