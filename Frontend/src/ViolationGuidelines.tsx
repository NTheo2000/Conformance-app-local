import React, { useState, useRef } from 'react';
import { Slider, Box, Typography, TextField, Select, MenuItem, Button, Tooltip, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import InfoIcon from '@mui/icons-material/Info';

ChartJS.register(CategoryScale, LinearScale, LineElement, BarElement, Title, ChartTooltip, Legend, zoomPlugin);
const resources = Array.from({ length: 70 }, (_, i) => `Resource ${i + 1}`);
const conformanceValues = Array.from({ length: 70 }, () => Math.random());

const initialLineChartData = [
    { x: 0, y: 50000 },
    { x: 0.1, y: 45000 },
    { x: 0.2, y: 40000 },
    { x: 0.3, y: 35000 },
    { x: 0.4, y: 30000 },
    { x: 0.5, y: 25000 },
    { x: 0.6, y: 20000 },
    { x: 0.7, y: 15000 },
    { x: 0.8, y: 10000 },
    { x: 0.9, y: 5000 },
    { x: 1, y: 0 },
];

const ViolationGuidelines: React.FC = () => {
    const [conformance, setConformance] = useState<number>(0);
    const [selectedChart, setSelectedChart] = useState<string>('Case Amount');
    const [resourceInput, setResourceInput] = useState<string>('');
    const [selectedResources, setSelectedResources] = useState<number[]>([]);
    const [filteredLineData, setFilteredLineData] = useState(initialLineChartData);
    const chartRef = useRef<any>(null);
    const navigate = useNavigate();

    const getColorForConformance = (conformance: number): string => {
        const colors = ['#67000d', '#a50f15', '#cb181d', '#ef3b2c', '#fb6a4a', '#fc9272', '#fcbba1', '#fee0d2', '#fff5f0'];
        const index = Math.min(Math.floor(conformance * colors.length), colors.length - 1);
        return colors[index];
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        const threshold = newValue as number;
        setConformance(threshold);

        if (selectedChart === 'Case Amount') {
            const filteredData = initialLineChartData.filter((point) => point.x >= threshold);
            setFilteredLineData(filteredData);
        }
    };

    const handleChartChange = (event: any) => {
        const chartType = event.target.value;
        setSelectedChart(chartType);
        setSelectedResources([]);
        setResourceInput('');
        setConformance(0);

        if (chartType === 'Case Amount') {
            setFilteredLineData(initialLineChartData);
        }
    };

    const handleResourceInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setResourceInput(value);

        const resourceNumbers = value
            .split(',')
            .map((num) => parseInt(num.trim()))
            .filter((num) => !isNaN(num) && num <= 70);
        setSelectedResources(resourceNumbers);
    };

    const handleReset = () => {
        setConformance(0);
        setResourceInput('');
        setSelectedResources([]);
        setFilteredLineData(initialLineChartData);
        if (chartRef.current) {
            chartRef.current.resetZoom();
        }
    };

    const filteredResources = selectedResources.length > 0
        ? selectedResources.filter((resource) => conformanceValues[resource - 1] >= conformance)
        : resources.filter((_, index) => conformanceValues[index] >= conformance && conformanceValues[index] <= 1);

    const filteredConformanceValues = selectedResources.length > 0
        ? selectedResources.map((resource) => conformanceValues[resource - 1]).filter((value) => value >= conformance && value <= 1)
        : conformanceValues.filter((value) => value >= conformance && value <= 1);

    const dataAmount = {
        datasets: [
            {
                label: 'Conformance',
                data: filteredLineData,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 2,
                pointRadius: 5,
            },
        ],
    };

    const dataResource = {
        labels: filteredResources.length > 0
            ? filteredResources.map((resource) => resource)
            : resources,
        datasets: [
            {
                label: 'Conformance',
                data: filteredConformanceValues.length > 0 ? filteredConformanceValues : conformanceValues,
                backgroundColor: filteredConformanceValues.map((value) => getColorForConformance(value)),
                borderColor: filteredConformanceValues.map(() => 'rgba(54, 162, 235, 0)'),
                borderWidth: 0,
            },
        ],
    };

    const lineChartOptions = {
        scales: {
            x: {
                type: 'linear' as const,
                title: {
                    display: true,
                    text: 'Conformance',
                },
                min: 0,
                max: 1,
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Case Amount',
                },
                ticks: {
                    callback: function (value: any) {
                        return value.toLocaleString();
                    },
                },
                suggestedMax: 50000,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
        maintainAspectRatio: false,
    };

    const barChartOptions = {
        indexAxis: 'x' as const,
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Resources',
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
        },
        maintainAspectRatio: false,
    };

    return (
        <Box sx={{ width: 800, height: 900, margin: '0 auto', position: 'relative' }}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                <Typography variant="h5" gutterBottom align="center">
                    Violation Guidelines: Conformance vs Attributes
                </Typography>
                <Tooltip title="What control-flow, data, resource, or time attributes of events, traces, or logs lead to guideline violations?" arrow>
                    <IconButton>
                        <InfoIcon color="primary" />
                    </IconButton>
                </Tooltip>
            </Box>

            <Typography variant="h6" gutterBottom>
                Conformance Threshold
            </Typography>
            <Slider
                value={conformance}
                min={0}
                max={1}
                step={0.01}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                sx={{
                    color: getColorForConformance(conformance),
                    '& .MuiSlider-thumb': {
                        backgroundColor: '#000',
                    },
                }}
            />
            <Typography variant="body1" gutterBottom>
                Current Conformance: {conformance.toFixed(2)}
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 1.5,
                    marginTop: 1,
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleReset}
                    sx={{ marginBottom: 2 }}
                >
                    Reset
                </Button>

                <Select
                    value={selectedChart}
                    onChange={handleChartChange}
                    sx={{ width: '150px', fontSize: '0.9rem', marginBottom: 2 }}
                >
                    <MenuItem value="Resource">Resource</MenuItem>
                    <MenuItem value="Case Amount">Case Amount</MenuItem>
                </Select>
            </Box>

            {selectedChart === 'Resource' && (
                <TextField
                    fullWidth
                    variant="outlined"
                    value={resourceInput}
                    onChange={handleResourceInput}
                    placeholder="Enter Resource Numbers (comma-separated, max 70)"
                    sx={{ marginTop: 2 }}
                />
            )}

            <Box sx={{ height: 500 }}>
                {selectedChart === 'Resource' ? (
                    <Bar ref={chartRef} data={dataResource} options={barChartOptions} />
                ) : (
                    <Line ref={chartRef} data={dataAmount} options={lineChartOptions} />
                )}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/heatmap-aggr')}
                    sx={{
                        fontSize: '1.5rem',
                        minWidth: '50px',
                        height: '50px',
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    ←
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/conformance-outcome')}
                    sx={{
                        fontSize: '1.5rem',
                        minWidth: '50px',
                        height: '50px',
                        fontWeight: 'bold',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    →
                </Button>
            </Box>
        </Box>
    );
};

export default ViolationGuidelines;
















    























