import React, { useState, useEffect } from 'react';
import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';

const SiteDataDisplay = () => {
  const [siteData, setSiteData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5005/api/getSitedata');
        const responseData = await response.json(); // Parse JSON explicitly
        setSiteData(responseData.data); // Assuming the data array is in the "data" property
        console.log(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

    return (
      <TableContainer component={Paper} style={{ marginTop: '100px' ,width: '1100px' , marginLeft: '200px'}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold', fontSize: '18px' }}>Site Name</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '18px' }}>Site Location</TableCell>
              <TableCell style={{ fontWeight: 'bold', fontSize: '18px' }}>Phone Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {siteData.map((site, index) => (
              <TableRow key={index} component={Link} to={`/cummulativeDisplay/${site.dev_phone_no}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <TableCell>{site.site_name}</TableCell>
                <TableCell>{site.site_location}</TableCell>
                <TableCell>{site.dev_phone_no}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
};

export default SiteDataDisplay;
