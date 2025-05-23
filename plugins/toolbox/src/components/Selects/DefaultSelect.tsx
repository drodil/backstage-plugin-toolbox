import Select, { SelectProps } from '@mui/material/Select';

export const DefaultSelect = (props: SelectProps) => {
  const { children, ...otherProps } = props;

  return (
    <Select
      {...otherProps}
      MenuProps={{
        MenuListProps: {
          sx: {
            'li.MuiButtonBase-root': {
              display: 'flex',
              flexDirection: 'column',
            },
          },
        },
      }}
    >
      {children}
    </Select>
  );
};
