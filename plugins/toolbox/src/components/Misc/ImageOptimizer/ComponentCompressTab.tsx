import { Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Slider, Typography } from "@material-ui/core";
import { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";


interface ComponentCompressTabProps {
    getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
    getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
    isDragActive: boolean;

    fileName: string;
    imgType: string;
    quality: number;

    setImgType: (type: string) => void;
    setQuality: (type: number) => void;
    processImage: () => void;

    ready: boolean;
    inputBytes: boolean;
    loadingState: boolean;


}


export const ComponentCompressTab = ({ getRootProps, getInputProps, isDragActive, fileName,
    imgType, quality, setImgType, setQuality, processImage, ready, inputBytes, loadingState }: ComponentCompressTabProps) => {



    return (

        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Paper
                    {...getRootProps()}
                    style={{
                        border: '2px dashed #cccccc8f',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: isDragActive ? '#78909c74' : '#78909C33',
                        overflow: 'hidden',
                        
                    }}
                    elevation={0}
                    
                >
                    <input {...getInputProps()} />

                    {fileName ? (
                        <Typography
                            style={{
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            Ausgewählt: {fileName}
                        </Typography>
                    ) : (
                        <Typography color="textSecondary">
                            {isDragActive
                                ? 'Jetzt loslassen...'
                                : ' drag or click image'}
                        </Typography>
                    )}
                </Paper>
            </Grid>

            <Grid item xs={12}>
                <FormControl fullWidth>
                    <InputLabel>Format</InputLabel>
                    <Select
                        value={imgType}
                        onChange={e => setImgType(e.target.value as string)}
                    >
                        <MenuItem value="jpeg">JPEG</MenuItem>
                        <MenuItem value="png">PNG</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid item xs={12}>
                <Typography gutterBottom>Quality: {quality}%</Typography>
                <Slider
                    value={quality}
                    onChange={(_, val) => setQuality(val as number)}
                    min={1}
                    max={100}
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
                    {loadingState ? 'Verarbeite...' : 'Start'}
                </Button>
            </Grid>
        </Grid>

    )
}