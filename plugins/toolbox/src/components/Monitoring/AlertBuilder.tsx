import React, { useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import MetricSelectorModal, { MetricSelector } from './MetricSelectorModal';
import {
  NUMERIC_OPERATORS,
  ALL_OPERATORS,
} from './operators'; // Adjust the path as necessary

interface MetricBlock {
  metricName: string;
  operator: string;
  threshold: string;
  duration: string;
  priority: string;
  namespace: string;
  receiver: string;
  jobName: string;
  groupBy: string;
  metricSelectors: string;
  observationWindow: string;
  timeWindow?: {
    startHour: string;
    endHour: string;
  };
}

const buildTimeWindowExpr = (timeWindow?: { startHour: string; endHour: string }): string => {
  if (!timeWindow) return '';
  return `and ON() hour() > ${timeWindow.startHour}h and <= ${timeWindow.endHour}h`;
};

const ALERT_TEMPLATES = {
  'Absolute Count': {
    metric: 'sum_metric_total',
    operator: '>',
    threshold: '100',
    duration: '5m',
    priority: 'P4',
    namespace: 'default',
    receiver: 'team-a',
    jobName: 'app',
    groupBy: 'job,instance',
    metricSelectors: '{job="app"}',
    observationWindow: '[5m]',
    timeWindow: undefined,
    description: 'Alert on absolute metric count',
    generateRule: (block: MetricBlock, name: string) => `
    ${name || 'absolute_count_alert'}:
      annotations:
        summary: >-
          The metric ${block.metricName} has been meeting the threshold ${block.operator} ${block.threshold} for the last ${block.duration}.
        description: >-
          The job {{ $labels.job }} in ${block.namespace} with metric ${block.metricName} = {{ $value }}, has been meeting the threshold ${block.operator} ${block.threshold} for the last ${block.duration}.
      expr: >-
        sum by (${block.groupBy}) (${block.metricName}${block.metricSelectors}) ${block.operator} ${block.threshold} ${buildTimeWindowExpr(block.timeWindow)}
      for: ${block.duration}
      labels:
        priority: ${block.priority}
        namespace: ${block.namespace}
        receiver: ${block.receiver}
        job_name: ${block.jobName}`
  },
};

const DURATIONS = ['1m', '5m', '10m', '15m', '30m', '1h'];
const PRIORITIES = ['P1', 'P2', 'P3', 'P4', 'P5'];

export const AlertBuilder = () => {
  const [alertName, setAlertName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [metricBlock, setMetricBlock] = useState<MetricBlock>({
    metricName: '',
    operator: '>',
    threshold: '',
    duration: '5m',
    priority: 'P4',
    namespace: 'default',
    receiver: '',
    jobName: '',
    groupBy: 'job,instance',
    metricSelectors: '',
    observationWindow: '[5m]',
    timeWindow: undefined
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [metricSelectors, setMetricSelectors] = useState<MetricSelector[]>([]);

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    if (ALERT_TEMPLATES[template as keyof typeof ALERT_TEMPLATES]) {
      const selectedTemp = ALERT_TEMPLATES[template as keyof typeof ALERT_TEMPLATES];
      setMetricBlock({
        metricName: selectedTemp.metric,
        namespace: selectedTemp.namespace,
        receiver: selectedTemp.receiver,
        jobName: selectedTemp.jobName,
        groupBy: selectedTemp.groupBy,
        metricSelectors: selectedTemp.metricSelectors,
        observationWindow: selectedTemp.observationWindow,
        operator: selectedTemp.operator,
        threshold: selectedTemp.threshold,
        duration: selectedTemp.duration,
        priority: selectedTemp.priority,
        timeWindow: selectedTemp.timeWindow,
      });
    }
  };

  const handleTimeWindowToggle = (enabled: boolean) => {
    setMetricBlock({
      ...metricBlock,
      timeWindow: enabled ? { startHour: '8', endHour: '18' } : undefined
    });
  };

  const handleMetricSelectorsOpen = () => {
    setModalOpen(true);
  };

  const handleMetricSelectorsClose = (selectors: MetricSelector[]) => {
    const formattedSelectors = selectors.map(selector => 
      `${selector.key}${selector.operator}${selector.value}`
    ).join(', ');

    // Wrap the formatted selectors in braces
    const wrappedSelectors = `{${formattedSelectors}}`;

    setMetricSelectors(selectors);
    setMetricBlock({ ...metricBlock, metricSelectors: wrappedSelectors }); // Store as a formatted string
    setModalOpen(false);
  };

  const generateAlertRule = () => {
    if (selectedTemplate === 'Absolute Count') {
      return ALERT_TEMPLATES['Absolute Count'].generateRule(metricBlock, alertName);
    }
    return '';
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateAlertRule());
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            MasStack Alert Builder
          </Typography>
          
          <Box mb={3}>
            <FormControl fullWidth>
              <InputLabel>Alert Template</InputLabel>
              <Select
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                label="Alert Template"
              >
                {Object.keys(ALERT_TEMPLATES).map(template => (
                  <MenuItem key={template} value={template}>{template}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Alert Name"
                value={alertName}
                onChange={(e) => setAlertName(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Metric Name"
                value={metricBlock.metricName}
                onChange={(e) => setMetricBlock({...metricBlock, metricName: e.target.value})}
              />
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Operator</InputLabel>
                <Select
                  value={metricBlock.operator}
                  onChange={(e) => setMetricBlock({...metricBlock, operator: e.target.value})}
                  label="Operator"
                >
                  {(selectedTemplate === 'Absolute Count' ? NUMERIC_OPERATORS : ALL_OPERATORS).map(op => (
                    <MenuItem key={op} value={op}>{op}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Threshold"
                type="number"
                value={metricBlock.threshold}
                onChange={(e) => setMetricBlock({...metricBlock, threshold: e.target.value})}
              />
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select
                  value={metricBlock.duration}
                  onChange={(e) => setMetricBlock({...metricBlock, duration: e.target.value})}
                  label="Duration"
                >
                  {DURATIONS.map(duration => (
                    <MenuItem key={duration} value={duration}>{duration}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={metricBlock.priority}
                  onChange={(e) => setMetricBlock({...metricBlock, priority: e.target.value})}
                  label="Severity"
                >
                  {PRIORITIES.map(priority => (
                    <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {selectedTemplate === 'Absolute Count' && (
              <>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Namespace"
                    value={metricBlock.namespace}
                    onChange={(e) => setMetricBlock({...metricBlock, namespace: e.target.value})}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Receiver"
                    value={metricBlock.receiver}
                    onChange={(e) => setMetricBlock({...metricBlock, receiver: e.target.value})}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Job Name"
                    value={metricBlock.jobName}
                    onChange={(e) => setMetricBlock({...metricBlock, jobName: e.target.value})}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Group By"
                    value={metricBlock.groupBy}
                    onChange={(e) => setMetricBlock({...metricBlock, groupBy: e.target.value})}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Metric Selectors"
                    value={metricBlock.metricSelectors}
                    onChange={(e) => setMetricBlock({...metricBlock, metricSelectors: e.target.value})}
                    placeholder='Click to edit'
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={handleMetricSelectorsOpen}>
                          <EditIcon />
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Observation Time Window</InputLabel>
                    <Select
                      value={metricBlock.timeWindow ? 'enabled' : 'disabled'}
                      onChange={(e) => handleTimeWindowToggle(e.target.value === 'enabled')}
                      label="Observation Time Window"
                    >
                      <MenuItem value="disabled">Disabled</MenuItem>
                      <MenuItem value="enabled">Enabled</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                {metricBlock.timeWindow && (
                  <>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Start Hour (0-23)"
                        value={metricBlock.timeWindow.startHour}
                        onChange={(e) => setMetricBlock({
                          ...metricBlock,
                          timeWindow: {
                            ...metricBlock.timeWindow!,
                            startHour: e.target.value
                          }
                        })}
                        inputProps={{ min: 0, max: 23 }}
                        helperText="e.g., 8 for 8:00 AM"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="End Hour (0-23)"
                        value={metricBlock.timeWindow.endHour}
                        onChange={(e) => setMetricBlock({
                          ...metricBlock,
                          timeWindow: {
                            ...metricBlock.timeWindow!,
                            endHour: e.target.value
                          }
                        })}
                        inputProps={{ min: 0, max: 23 }}
                        helperText="e.g., 18 for 6:00 PM"
                      />
                    </Grid>
                  </>
                )}
              </>
            )}
          </Grid>

          <MetricSelectorModal
            open={modalOpen}
            onClose={handleMetricSelectorsClose}
            initialSelectors={metricSelectors}
          />

          <Box mt={3}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Generated Alert Rule</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    wordBreak: 'break-word',
                    color: '#000000',
                    margin: 0
                  }}>
                    {generateAlertRule()}
                  </pre>
                  <Button
                    variant="contained"
                    startIcon={<ContentCopyIcon />}
                    onClick={copyToClipboard}
                    sx={{ mt: 2 }}
                  >
                    Copy to Clipboard
                  </Button>
                </Paper>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default AlertBuilder; 