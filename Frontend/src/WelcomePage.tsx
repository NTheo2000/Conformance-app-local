import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Stack, TextField, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFileContext } from './FileContext';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VisibilityIcon from '@mui/icons-material/Visibility';

const WelcomePage: React.FC = () => {
  const [bpmnFile, setBpmnFile] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { setBpmnFileContent, setCsvFileContent } = useFileContext();

  useEffect(() => {
    // Automatically load the BPMN file from the public folder
    const preselectedBpmnPath = 'Model_InternationalDeclarations.bpmn'; // Adjust the path if needed
    fetch(preselectedBpmnPath)
      .then((response) => response.text())
      .then((content) => {
        const file = new File([content], 'Model_InternationalDeclarations.bpmn', {
          type: 'application/xml',
        });
        setBpmnFile(file); // Set the file state for UI
        setBpmnFileContent(content); // Set the file content in the context
      })
      .catch((error) => console.error('Error loading BPMN file:', error));
  }, [setBpmnFileContent]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setFileContent: (content: string | null) => void
  ) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      setFile(file);

      // Read the file as text and set it in context
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        setFileContent(content);
      };
      reader.readAsText(file);
    }
  };

  const handleNavigateToViewBPMN = () => {
    navigate('/view-bpmn');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 700, margin: '0 auto', textAlign: 'center', padding: 4 }}>
      {/* Page Title */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Welcome to the Conformance Analysis App
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ marginBottom: 3 }}>
        Upload your BPMN and CSV files to start analyzing process conformance.
      </Typography>

      <Stack spacing={3}>
        {/* BPMN File Upload */}
        <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3, textAlign: 'left' }}>
          <Typography variant="h6" gutterBottom>
            <UploadFileIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} />
            Upload BPMN File
          </Typography>
          <TextField
            type="file"
            inputProps={{ accept: '.bpmn' }}
            onChange={(event) => handleFileChange(event, setBpmnFile, setBpmnFileContent)}
            fullWidth
            variant="outlined"
            helperText={
              bpmnFile ? (
                `Selected File: ${bpmnFile.name}`
              ) : (
                <Typography variant="body2" color="text.secondary">
                  A preloaded file "Model_InternationalDeclarations.bpmn" is ready. You can upload another file if needed.
                </Typography>
              )
            }
          />
        </Paper>

        {/* CSV File Upload */}
        <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3, textAlign: 'left' }}>
          <Typography variant="h6" gutterBottom>
            <UploadFileIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} />
            Upload CSV File
          </Typography>
          <TextField
            type="file"
            inputProps={{ accept: '.csv' }}
            onChange={(event) => handleFileChange(event, setCsvFile, setCsvFileContent)}
            fullWidth
            variant="outlined"
            helperText={
              csvFile ? (
                `Selected File: ${csvFile.name}`
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Please upload a valid `.csv` file
                </Typography>
              )
            }
          />
        </Paper>

        {/* Action Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleNavigateToViewBPMN}
          disabled={!bpmnFile}
          startIcon={<VisibilityIcon />}
          sx={{
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 'bold',
            width: '100%',
            maxWidth: 300,
            backgroundColor: !bpmnFile ? 'grey.400' : 'primary.main',
            '&:hover': {
              backgroundColor: !bpmnFile ? 'grey.400' : 'primary.dark',
            },
            alignSelf: 'center',
          }}
        >
          View BPMN
        </Button>
      </Stack>
    </Box>
  );
};

export default WelcomePage;







