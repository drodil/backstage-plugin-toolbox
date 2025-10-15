import { Select, SelectProps } from '@material-ui/core';

export const DefaultSelect = (props: SelectProps) => {
  const { children, ...otherProps } = props;

  return (
    <Select
      {...otherProps}
      MenuProps={{
        MenuListProps: {
          style: {
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {children}
    </Select>
  );
};
