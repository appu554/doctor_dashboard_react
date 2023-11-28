import React, { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { useApolloClient } from '../../../apollo-client';
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// GraphQL Subscription
const DEVICE_INFO_SUBSCRIPTION = gql`
subscription DeviceName {
  device_info {
    device_serial
    device_name
    device_status
    id
  }
}
`;

const DeviceView = () => {
  const [devices, setDevices] = useState([]);


  const client = useApolloClient(); 

  useEffect(() => {

    let subscription;
    if (client) {
        subscription = client.subscribe({ query: DEVICE_INFO_SUBSCRIPTION }).subscribe({
            next(response) {
              setDevices(response.data.device_info);
            },
            error(err) { console.error('Error:', err); }
          });
    }
    return () => {
        subscription?.unsubscribe();

      };  
  }, [client]);

  return (
    <MainCard title="Device View">
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Serial</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>{device.id}</TableCell>
                    <TableCell>{device.device_serial}</TableCell>
                    <TableCell>{device.device_name}</TableCell>
                    <TableCell>{device.device_status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default DeviceView;
