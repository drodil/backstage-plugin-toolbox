import { InfoCard } from "@backstage/core-components";
import { Box, Button, Typography } from "@material-ui/core";


interface statsCardProps {
    stats: { original: number; compressed: number };
    ready: boolean;
    hasInput: boolean
    downloadCompression: () => void;

}


export const ComponentStatsCard = ({stats, ready, hasInput, downloadCompression}: statsCardProps) => {



    return (

        <Box mt={3}>
            <InfoCard title="Stats">
                <Typography variant="body2">
                    Original: {(stats.original / 1024).toFixed(2)} KB
                </Typography>
                <Typography variant="body2">
                    New: <b>{(stats.compressed / 1024).toFixed(2)} KB</b>
                </Typography>
                <Typography
                    variant="body2"
                    style={{ color: 'green', marginTop: 5 }}
                >
                    Saved:{' '}
                    {((1 - stats.compressed / stats.original) * 100).toFixed(1)}
                    %
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={downloadCompression}
                    disabled={!ready || !hasInput}
                    fullWidth
                    style={{ marginTop: 10 }}
                >
                    Download Image
                </Button>
            </InfoCard>
        </Box>

    )
}