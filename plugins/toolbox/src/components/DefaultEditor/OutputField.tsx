import { CopyToClipboardButton } from '../Buttons';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export const OutputField = (props: {
  label: string;
  value?: string | null;
}) => {
  const { label, value } = props;
  return (
    <Box sx={{ pt: '1rem' }}>
      <TextField
        label={label}
        style={{ width: '100%' }}
        disabled
        value={value ?? ''}
      />
      <CopyToClipboardButton output={value ?? ''} />
    </Box>
  );
};
