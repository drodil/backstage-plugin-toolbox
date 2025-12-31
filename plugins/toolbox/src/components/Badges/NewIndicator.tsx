import Chip, { ChipProps } from '@material-ui/core/Chip';
import { useTheme } from '@material-ui/core/styles';

type NewIndicatorProps = {
  className?: string;
  ariaLabel?: string;
  size?: ChipProps['size'];
};

export const NewIndicator = ({
  className,
  ariaLabel,
  size = 'small',
}: NewIndicatorProps) => {
  const theme = useTheme();
  const backgroundColor = theme.palette.info.dark;
  const color = theme.palette.getContrastText(backgroundColor);
  const label = 'New';

  return (
    <Chip
      label={label}
      size={size}
      className={className}
      style={{
        margin: 0,
        backgroundColor,
        color,
      }}
      color="default"
      aria-label={ariaLabel ?? label}
    />
  );
};

export default NewIndicator;
