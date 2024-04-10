import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Grid, Typography, Card, CardContent } from '@mui/material';
import { useParams } from 'react-router-dom';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const CummulativeDisplay = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [lastUpdatedDate, setLastUpdatedDate] = useState('');
  const [cumulativeFlow, setCumulativeFlow] = useState('');
  const [dailyFlows, setDailyFlows] = useState([]);
  const [totalFlowDifference, setTotalFlowDifference] = useState(0);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const { dev_phone_no , site_name } = useParams();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5005/api/getlastdatecum/${dev_phone_no}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const responseData = await response.json();
      setLastUpdatedDate(responseData.data.max_date);
      setCumulativeFlow(responseData.data.cum_flow_m3);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const fetchReportData = async () => {
    try {
      const response = await fetch(`http://localhost:5005/api/getdate/${startDate}/${endDate}/${dev_phone_no}`);
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }
      const responseData = await response.json();
      if (responseData && responseData.data) {
        setDailyFlows(responseData.data.dailyFlows);
        setTotalFlowDifference(responseData.data.totalFlowDifference);
        setShowDownloadButton(true);
      } else {
        throw new Error('Invalid report data');
      }
    } catch (error) {
      console.error('Error fetching report data:', error.message);
    }
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleButtonClick = () => {
    fetchReportData();
  };

  const handleDownloadExcel = () => {
    const downloadUrl = `http://localhost:5005/api/downloadExcelReport/${startDate}/${endDate}/${dev_phone_no}`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <Grid container spacing={5} marginTop={12}>
      <Grid item xs={5} textAlign="center" marginLeft={55} >
        <Typography variant='h4' component="h1" fontSize={45}>{site_name}</Typography>
        <Box border={1} padding={3} marginBottom={3} marginTop={7}>
          <Typography variant="h5" component="h2">Dashboard</Typography>
          <Typography>Last Updated Date: {formatDate(lastUpdatedDate)}</Typography>
          <Typography>Cumulative Flow: {cumulativeFlow}</Typography>
        </Box>
      </Grid>
      <Grid container item xs={5} spacing={3} marginLeft={52}>
        <Grid item xs={6}>
          <TextField
            id="start-date"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            id="end-date"
            label="End Date"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Button variant="contained" color="primary" onClick={handleButtonClick}>
            Generate Report
          </Button>
        </Grid>
      </Grid>
      {dailyFlows.length > 0 && (
      <Grid container item xs={12} spacing={3}>
        {dailyFlows.map((flow) => (
          <Grid item xs={5} key={flow.date} style={{marginLeft: '75px'}}>
            <Card style={{ marginBottom: '10px' }}>
              <CardContent>
                <Typography variant="h6">{formatDate(flow.date)}</Typography>
                <Typography>
                  Flow Difference: {flow.flowDifference !== null ? JSON.stringify(flow.flowDifference) : 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} textAlign="center">
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Total Flow Difference: {totalFlowDifference}
          </Typography>
          <Typography>Last Updated Date: {formatDate(lastUpdatedDate)}</Typography>
          <Typography>Cumulative Flow: {cumulativeFlow}</Typography>
        </Grid>
      </Grid>
    )}

    {showDownloadButton && (
      <Grid item xs={12} textAlign="center" style={{marginBottom: '20px'}}>
        <Button variant="outlined" color="secondary" onClick={handleDownloadExcel}>
          Download Excel
        </Button>
      </Grid>
    )}
    </Grid>
  );
};

export default CummulativeDisplay;
