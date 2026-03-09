import { InfoCard } from '@backstage/core-components';
import { Box, Typography } from '@material-ui/core';
import {
	ReactCompareSlider,
	ReactCompareSliderImage,
} from 'react-compare-slider';

interface ComponentPreviewCardProps {
	imageUrl: string | null;
	resultUrl: string | null;
	stats: {
		original: number;
		compressed: number;
	} | null;
}

export const ComponentPreviewCard = ({
	imageUrl,
	resultUrl,
	stats,
}: ComponentPreviewCardProps) => {
	return (
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
	);
};
