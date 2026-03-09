import { ComponentStatsCard } from './ComponentStatsCard.tsx';
import { useEffect, useState, useCallback } from 'react';
import {
  TabbedCard,
  CardTab,
} from '@backstage/core-components';
import {
  Grid,
} from '@material-ui/core';
import init, { pixo_compress, init_hook, pixo_resize } from './pkg/pixo.js';
import { useDropzone } from 'react-dropzone';
import { ComponentCompressTab } from './ComponentCompressTab.tsx';
import { ComponentResizeTab } from './ComponentResizeTab.tsx';
import { ComponentPreviewCard } from './ComponentPreviewCard.tsx';

export const ImageOptimizer = () => {
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
  const [resizeMaintainAspect, setResizeMaintainAspect] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState(0);
  const [origDim, setOrigDim] = useState({ width: 0, height: 0 });
  const [originalResizeWidth, originalSetResizeWidth] = useState<number>(0);
  const [originalResizeHeight, originalSetResizeHeight] = useState<number>(0);

  useEffect(() => {
    init().then(() => {
      init_hook();
      setReady(true);
    });
  }, []);

  /*

      Aufgaben:
      *- Architektur in mehreren Dateien verlegen 
      * Darkmode beachten
      * resize fertig machen und testen
      * filter option einbauen
      * Dev option einbauen
      * nach Toolbox anpassen
      * Nur für PNG und JPEG anpassen also bei compressTab
      * irgendien Name von einem state von maintain aspect stimmt nicht
      * Text verlässt dropZone
      * Layout ändern
      * PNG encoder ändern
      * Rust Code säubern
      * Hight zu Height
      
      

    */

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
      originalSetResizeHeight(h);
      originalSetResizeWidth(w);
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


  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>

        <TabbedCard title="Settings">
          <CardTab label="Compress">
            <ComponentCompressTab
              getInputProps={getInputProps}
              getRootProps={getRootProps}
              isDragActive={isDragActive}
              fileName={fileName}
              imgType={imgType}
              quality={quality}
              setImgType={setImgType}
              setQuality={setQuality}
              processImage={processImage}
              ready={ready}
              inputBytes={!!inputBytes}
              loadingState={loadingState}
            />
          </CardTab>

          <CardTab label="Resize">
            <ComponentResizeTab
              resizeAlgorythm={resizeAlgorythm}
              setResizeAlgorythm={setResizeAlgorythm}
              resizePreset={resizePreset}
              setResizePreset={setResizePreset}
              resizeWidth={resizeWidth}
              setResizeWidth={setResizeWidth}
              resizeHight={resizeHight}
              setResizeHight={setResizeHight}
              resizeMaintainAspect={resizeMaintainAspect}
              setResizeMaintainAspect={setResizeMaintainAspect}
              aspectRatio={aspectRatio}
              processImage={processImage}
              ready={ready}
              inputBytes={inputBytes}
              loadingState={loadingState}
              originalResizeHeight={originalResizeHeight}
              originalResizeWidth={originalResizeWidth}
            />
          </CardTab>

        </TabbedCard>
        {stats && (
          <ComponentStatsCard
            stats={stats}
            ready={ready}
            hasInput={!!inputBytes}
            downloadCompression={downloadCompression}
          />)}
      </Grid>

      <Grid item xs={12} md={8}>
        <ComponentPreviewCard
          imageUrl={imageUrl}
          resultUrl={resultUrl}
          stats={stats}
        />
      </Grid>
    </Grid>
  );
};

export default ImageOptimizer;
