import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  REGEX_OPERATORS,
} from './operators'; // Adjust the path as necessary

interface MetricSelector {
  key: string;
  operator: string;
  value: string;
}

interface MetricSelectorModalProps {
  open: boolean;
  onClose: (selectors: MetricSelector[]) => void;
  initialSelectors?: MetricSelector[];
}

const MetricSelectorModal: React.FC<MetricSelectorModalProps> = ({ open, onClose, initialSelectors = [] }) => {
  const [selectors, setSelectors] = useState<MetricSelector[]>(initialSelectors.length > 0 ? initialSelectors : [{ key: '', operator: '=', value: '' }]);

  const handleAddRow = () => {
    setSelectors([...selectors, { key: '', operator: '=', value: '' }]);
  };

  const handleChange = (index: number, field: keyof MetricSelector, value: string) => {
    const newSelectors = [...selectors];
    newSelectors[index][field] = value;
    setSelectors(newSelectors);
  };

  const handleDeleteRow = (index: number) => {
    const newSelectors = selectors.filter((_, i) => i !== index);
    setSelectors(newSelectors);
  };

  const handleSubmit = () => {
    onClose(selectors);
  };

  return (
    <Dialog open={open} onClose={() => onClose(selectors)}>
      <DialogTitle>Metric Selectors</DialogTitle>
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Key</TableCell>
              <TableCell>Operator</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectors.map((selector, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    value={selector.key}
                    onChange={(e) => handleChange(index, 'key', e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={selector.operator}
                    onChange={(e) => handleChange(index, 'operator', e.target.value)}
                    fullWidth
                  >
                    {REGEX_OPERATORS.map((op) => (
                      <MenuItem key={op} value={op}>{op}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <TextField
                    value={selector.value}
                    onChange={(e) => handleChange(index, 'value', e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteRow(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button onClick={handleAddRow} startIcon={<AddIcon />} color="primary">
          Add Row
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(selectors)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MetricSelectorModal;

export type { MetricSelector };