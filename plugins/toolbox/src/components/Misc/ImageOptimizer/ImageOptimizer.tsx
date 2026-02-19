import { useEffect, useState, useCallback } from 'react';
import {
  Content,
  Header,
  Page,
  InfoCard,
  TabbedCard,
  CardTab,
} from '@backstage/core-components';
import {
  Grid,
  Button,
  Slider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
  Paper,
  TextField,
  CircularProgress,
  /* useTheme,*/
  InputAdornment,
  Switch,
  FormControlLabel,
} from '@material-ui/core';
import init, { pixo_compress, init_hook, pixo_resize } from './pkg/pixo.js';
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from 'react-compare-slider';
import { useDropzone } from 'react-dropzone';

export const ImageOptimizer = () => {
  // const theme = useTheme();
  // const isDarkMode = theme.palette.type === 'dark';
  const [ready, setReady] = useState(false);
  const [inputBytes, setInputBytes] = useState<Uint8Array | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [imgType, setImgType] = useState<string>('jpeg');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    original: number;
    compressed: number;
  } | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingState, setLoading] = useState(false);
  const [resizeAlgorythm, setResizeAlgorythm] = useState<string>('lanczos3');
  const [resizePreset, setResizePreset] = useState<number>(100);
  const [resizeWidth, setResizeWidth] = useState<number | string>('');
  const [resizeHight, setResizeHight] = useState<number | string>('');
  const [resizeMaintainAspect, setResizeMaintainAspect] =
    useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState(0);
  const [origDim, setOrigDim] = useState({ width: 0, height: 0 });

  useEffect(() => {
    init().then(() => {
      init_hook();
      setReady(true);
    });
  }, []);

  /*

      cloudaccess profile -n dxc-develop --pm=false --hl=true

      cloudaccess profile -n dxc-develop -r 3600
      erfan.teymoori@deutschebahn.com

      . ./setup-dev.sh
      yarn install
      yarn dev

      Aufgaben:
      * Architektur in mehreren Dateien verlegen 
      * Darkmode beachten
      * resize fertig machen und testen
      * filter option einbauen
      * Dev option einbauen
      * nach Toolbox anpassen
      
      

    };*/

  const onDrop = useCallback(async (files: File[]) => {
    const file = files[0];

    if (!file) {
      setInputBytes(null);
      setResultUrl(null);
      setStats(null);
      setFileName('');
      return;
    }

    setFileName(file.name);

    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    setInputBytes(bytes);

    // für orginalbild url

    // as any fix für TS
    const blob = new Blob([bytes], { type: file.type });
    const origUrl = URL.createObjectURL(blob);
    setImageUrl(origUrl);

    // Für preset bei resize
    const img = new Image();
    img.src = origUrl;
    img.onload = () => {
      const w = img.width;
      const h = img.height;

      setResizeWidth(w);
      setResizeHight(h);
      setAspectRatio(w / h);
      setOrigDim({ width: w, height: h });
    };

    // Reset bei neuem Bild
    setResultUrl(null);
    setStats(null);
  }, []);

  // Hook initialisieren
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const processImage = useCallback(() => {
    if (!ready || !inputBytes) return;

    setLoading(true);

    setTimeout(() => {
      try {
        let currentBytes = inputBytes;
        const width = Number(resizeWidth);
        const hight = Number(resizeHight);

        if (
          width > 0 &&
          hight > 0 &&
          (width !== origDim.width || hight !== origDim.height)
        ) {
          currentBytes = pixo_resize(currentBytes, width, hight);
        }

        const mimeType = imgType === 'png' ? 'image/png' : 'image/jpeg';

        // jetzt compress
        try {
          let q = quality;
          if (q <= 0) q = 1;
          if (q >= 100) q = 99;

          currentBytes = pixo_compress(currentBytes, q, imgType);
        } catch (e) {
          setLoading(false);
        }

        // Bauen
        // as any fix für TS
        const blob = new Blob([currentBytes as any], { type: mimeType });
        const url = URL.createObjectURL(blob);

        setResultUrl(url);
        setDownloadUrl(url);
        setStats({
          original: inputBytes.length,
          compressed: currentBytes.length,
        });

        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    }, 200);
  }, [
    ready,
    inputBytes,
    resizeWidth,
    resizeHight,
    quality,
    imgType,
    origDim.width,
    origDim.height,
  ]);

  const downloadCompression = () => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `pixo-${fileName || 'optimized-image'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* return fängt hier an ////////////////////////////////////////////////////////////////////////////  */

  return (
    <Page themeId="tool">
      <Header title="Pixo Compressor" subtitle="Rust & WASM" />
      <Content>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TabbedCard title="Settings">
              <CardTab label="Compress">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper
                      {...getRootProps()}
                      style={{
                        border: '2px dashed #cccccc8f',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: isDragActive ? '#6c808d' : '#4a606e',
                      }}
                      elevation={0}
                    >
                      <input {...getInputProps()} />

                      {fileName ? (
                        <Typography style={{ fontWeight: 'bold' }}>
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
                        <MenuItem value="unveraendert">Unverändert</MenuItem>
                        <MenuItem value="jpeg">JPEG</MenuItem>
                        <MenuItem value="png">PNG</MenuItem>
                        <MenuItem value="webp">
                          WebP (gerade noch zu JPEG){' '}
                        </MenuItem>
                        <MenuItem value="avif">
                          AVIF (gerade noch zu JPEG){' '}
                        </MenuItem>
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
              </CardTab>

              {/* Hier geht Resize los //////////////////////////////////////////////////////////////////////////     */}

              <CardTab label="Resize">
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Algorythm</InputLabel>
                      <Select
                        value={resizeAlgorythm}
                        onChange={e =>
                          setResizeAlgorythm(e.target.value as string)
                        }
                      >
                        <MenuItem value="lanczos3">Lanczos3 </MenuItem>
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
                        onChange={e =>
                          setResizePreset(e.target.value as number)
                        }
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
              </CardTab>
            </TabbedCard>
            {stats && (
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
                    disabled={!ready || !inputBytes}
                    fullWidth
                    style={{ marginTop: 10 }}
                  >
                    Download Image
                  </Button>
                </InfoCard>
              </Box>
            )}
          </Grid>

          {/* Hier geht es mit Stats und preview los /////////////////////////////////////////////////////////////////////////////// */}

          <Grid item xs={12} md={8}>
            <InfoCard title="Preview">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="300px"
                style={{ background: '#4a606e5d' }}
              >
                {imageUrl ? (
                  <ReactCompareSlider
                    itemOne={
                      <div style={{ position: 'relative', height: '100%' }}>
                        <ReactCompareSliderImage
                          src={imageUrl}
                          alt="Original"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '600px',
                            objectFit: 'contain',
                          }}
                        />

                        <div
                          style={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            pointerEvents: 'none',
                          }}
                        >
                          Original (
                          {stats?.original
                            ? (stats.original / 1024).toFixed(0)
                            : 0}{' '}
                          KB)
                        </div>
                      </div>
                    }
                    itemTwo={
                      <div style={{ position: 'relative', height: '100%' }}>
                        <ReactCompareSliderImage
                          src={resultUrl || imageUrl}
                          alt="Optimized"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '600px',
                            objectFit: 'contain',
                          }}
                        />

                        <div
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: '#9bf29b',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            pointerEvents: 'none',
                          }}
                        >
                          Compressed (
                          {stats?.compressed
                            ? (stats.compressed / 1024).toFixed(0)
                            : 0}{' '}
                          KB)
                        </div>
                      </div>
                    }
                  />
                ) : (
                  <Typography color="textSecondary">No image</Typography>
                )}
              </Box>
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};

export default ImageOptimizer;
