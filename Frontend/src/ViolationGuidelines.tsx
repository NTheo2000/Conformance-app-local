import React, { useState, useRef } from 'react';
import {
  Slider, Box, Typography, TextField,
  Button, Tooltip, IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip as ChartTooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import InfoIcon from '@mui/icons-material/Info';
import { useFileContext } from './FileContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend, zoomPlugin);

const ViolationGuidelines: React.FC = () => {
  const [conformance, setConformance] = useState<number>(0);
  const [resourceInput, setResourceInput] = useState<string>('');
  const [selectedResources, setSelectedResources] = useState<number[]>([]);
  const chartRef = useRef<any>(null);
  const navigate = useNavigate();

  const { roleConformance } = useFileContext();
  const formatRoleLabel = (role: string) => {
    return role
      .toLowerCase()
      .replace(/_/g, ' ')           // Replace underscores with spaces
      .replace(/\b\w/g, c => c.toUpperCase());  // Capitalize each word
  };
  
  const getColorForConformance = (value: number): string => {
    const colors = ['#67000d', '#a50f15', '#cb181d', '#ef3b2c', '#fb6a4a', '#fc9272', '#fcbba1', '#fee0d2', '#fff5f0'];
    const index = Math.min(Math.floor(value * colors.length), colors.length - 1);
    return colors[index];
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setConformance(newValue as number);
  };

  const handleResourceInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setResourceInput(value);

    const numbers = value
      .split(',')
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n));
    setSelectedResources(numbers);
  };

  const handleReset = () => {
    setConformance(0);
    setResourceInput('');
    setSelectedResources([]);
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  const filteredRoles = roleConformance.filter((item, index) =>
    item.averageConformance >= conformance &&
    (selectedResources.length === 0 || selectedResources.includes(index + 1))
  );

  const data = {
    labels: filteredRoles.map((r) => formatRoleLabel(r.role)),

    datasets: [
      {
        label: 'Average Conformance',
        data: filteredRoles.map((role) => ({
            x: formatRoleLabel(role.role),
            y: role.averageConformance,
            traceCount: role.traceCount
          })),
          
        backgroundColor: filteredRoles.map((r) => getColorForConformance(r.averageConformance)),
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    indexAxis: 'x' as const,
    scales: {
        x: {
            ticks: {
              maxRotation: 0,
              minRotation: 0,
            },
            title: {
              display: true,
              text: 'Roles',
            },
          },
          
          
      y: {
        beginAtZero: true,
        max: 1,
        title: {
          display: true,
          text: 'Conformance',
        },
      },
    },
    plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              const traceCount = context.raw.traceCount ?? 'N/A';
              return `Conformance: ${context.raw.y}, Trace Count: ${traceCount}`;
            },
          },
        },
      },
      
    maintainAspectRatio: false,
  };

  return (
    <Box sx={{ width: 800, height: 900, margin: '0 auto', position: 'relative' }}>
      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
        <Typography variant="h5" gutterBottom align="center">
          Violation Guidelines: Conformance per Role
        </Typography>
        <Tooltip title="What resource roles tend to deviate from the expected process?" arrow>
          <IconButton>
            <InfoIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Box>

      <Typography variant="h6" gutterBottom>Conformance Threshold</Typography>
      <Slider
        value={conformance}
        min={0}
        max={1}
        step={0.01}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        sx={{
          color: getColorForConformance(conformance),
          '& .MuiSlider-thumb': { backgroundColor: '#000' },
        }}
      />
      <Typography variant="body1" gutterBottom>
        Current Conformance: {conformance.toFixed(2)}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleReset}
        sx={{ mb: 2 }}
      >
        Reset
      </Button>

      <TextField
        fullWidth
        variant="outlined"
        value={resourceInput}
        onChange={handleResourceInput}
        placeholder="Enter Role Index Numbers (comma-separated, e.g., 1,2)"
        sx={{ marginBottom: 2 }}
      />

      <Box sx={{ height: 500 }}>
        <Bar ref={chartRef} data={data} options={barOptions} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <Button variant="contained" color="primary" onClick={() => navigate('/heatmap-aggr')}>←</Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/conformance-outcome')}>→</Button>
      </Box>
    </Box>
  );
};

export default ViolationGuidelines;

















    























