import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Stack, TextField, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFileContext } from './FileContext';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import VisibilityIcon from '@mui/icons-material/Visibility';

const WelcomePage: React.FC = () => {
  const [bpmnFile, setBpmnFile] = useState<File | null>(null);
  const [xesFile, setXesFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const navigate = useNavigate();
  const { setBpmnFileContent, setXesFileContent, setFitnessData, setConformanceBins, setActivityDeviations } = useFileContext();

  useEffect(() => {
    const preselectedBpmnPath = 'Model_InternationalDeclarations.bpmn';
    fetch(preselectedBpmnPath)
      .then((response) => response.text())
      .then((content) => {
        const file = new File([content], 'Model_InternationalDeclarations.bpmn', {
          type: 'application/xml',
        });
        setBpmnFile(file);
        setBpmnFileContent(content);
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

  const handleUploadOrNavigate = async () => {
    if (uploadComplete) {
      handleNavigateToViewBPMN();
      return;
    }

    if (!bpmnFile || !xesFile) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append('bpmn', bpmnFile);
    formData.append('xes', xesFile);

    try {
      const uploadResponse = await fetch('http://127.0.0.1:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadResponse.json();
      console.log('Upload Response:', uploadData);

      const fitnessResponse = await fetch('http://127.0.0.1:5000/api/fitness');
      const fitnessJson = await fitnessResponse.json();
      setFitnessData(fitnessJson);
      console.log('Fitness Data:', fitnessJson);

      const binResponse = await fetch('http://127.0.0.1:5000/api/conformance-bins');
      const binJson = await binResponse.json();
      setConformanceBins(binJson);
      console.log('Conformance Bins:', binJson);

      const deviationResponse = await fetch('http://127.0.0.1:5000/api/activity-deviations');
      const deviationJson = await deviationResponse.json();
      setActivityDeviations(deviationJson);
      console.log('Activity Deviations:', deviationJson);

      setUploadComplete(true);
    } catch (error) {
      console.error('Error uploading files or fetching data:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 700, margin: '0 auto', textAlign: 'center', padding: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Welcome to the Conformance Analysis App
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ marginBottom: 3 }}>
        Upload your BPMN and XES files to start analyzing process conformance.
      </Typography>

      <Stack spacing={3}>
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
              bpmnFile ? `Selected File: ${bpmnFile.name}` : (
                <Typography variant="body2" color="text.secondary">
                  A preloaded file "Model_InternationalDeclarations.bpmn" is ready. You can upload another file if needed.
                </Typography>
              )
            }
          />
        </Paper>

        <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3, textAlign: 'left' }}>
          <Typography variant="h6" gutterBottom>
            <UploadFileIcon sx={{ marginRight: 1, verticalAlign: 'middle' }} />
            Upload XES File
          </Typography>
          <TextField
            type="file"
            inputProps={{ accept: '.xes' }}
            onChange={(event) => handleFileChange(event, setXesFile, setXesFileContent)}
            fullWidth
            variant="outlined"
            helperText={
              xesFile ? `Selected File: ${xesFile.name}` : (
                <Typography variant="body2" color="text.secondary">
                  Please upload a valid `.xes` file
                </Typography>
              )
            }
          />
        </Paper>

        <Button
          variant="contained"
          color={uploadComplete ? 'primary' : 'secondary'}
          onClick={handleUploadOrNavigate}
          disabled={!bpmnFile || !xesFile || isUploading}
          startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : uploadComplete ? <VisibilityIcon /> : <UploadFileIcon />}
          sx={{
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 'bold',
            width: '100%',
            maxWidth: 300,
            backgroundColor: !bpmnFile || !xesFile ? 'grey.400' : undefined,
            '&:hover': {
              backgroundColor: !bpmnFile || !xesFile ? 'grey.400' : undefined,
            },
            alignSelf: 'center',
            marginTop: 2,
          }}
        >
          {isUploading ? 'Processing...' : uploadComplete ? 'View BPMN' : 'Upload & Process'}
        </Button>
      </Stack>
    </Box>
  );
};

export default WelcomePage;







