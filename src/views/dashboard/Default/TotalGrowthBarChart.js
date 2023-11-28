import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link
} from '@mui/material'

import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';
import AWS from 'aws-sdk';
import awsConfig from '../../../aws-exports';
import { gql } from '@apollo/client';

// import { ApolloClient, InMemoryCache, split, HttpLink , gql } from '@apollo/client';
// import { WebSocketLink } from '@apollo/client/link/ws';
// import { getMainDefinition } from '@apollo/client/utilities';
import { useApolloClient } from '../../../apollo-client';
import { useAuthInfo } from '../../../useAuthInfo'; 
// import { setContext } from '@apollo/client/link/context';

import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';

AWS.config.update({
  accessKeyId: awsConfig.aws_access_key_id,
  secretAccessKey: awsConfig.aws_secret_access_key,
  region: awsConfig.aws_region
});

const TotalGrowthBarChart = ({ isLoading }) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const { navType } = customization;
  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const grey200 = theme.palette.grey[200];
  const grey500 = theme.palette.grey[500];

  const [tableData, setTableData] = useState([]);
  const [walletBalance, setWalletBalance] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedValue, setSelectedValue] = useState(''); 
  const s3 = new AWS.S3();
  const { logout } = useAuth0();
  const { getUserId } = useAuthInfo();
  const [userId, setUserId] = useState(null);
  const [open, setOpen] = useState(false);

  function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}



  const client = useApolloClient(); 

  useEffect(() => {

    let subscription;
    let patientsdata;
    let productsubscription;

    const fetchData = async () => {
      const fetchedUserId = getUserId();
      setUserId(fetchedUserId);
    };

    fetchData();
    console.log("Checking client",client)
    // // const endpoint = 'http://backend.cardiofit.in/v1/graphql';
    // const headers = {
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${authToken}`,
    //   'X-Hasura-Role': "doctor"
    // };

    // const httpLink = new HttpLink({
    //   uri: endpoint,
    //   headers: headers
    // });

    // const wsLink = new WebSocketLink({
    //   uri: `ws://backend.cardiofit.in/v1/graphql`,
    //   options: {
    //     reconnect: true,
    //     connectionParams: {
    //       headers: headers
    //     }
    //   }
    // });

    // const link = split(
    //   ({ query }) => {
    //     const definition = getMainDefinition(query);
    //     return (
    //       definition.kind === 'OperationDefinition' &&
    //       definition.operation === 'subscription'
    //     );
    //   },
    //   wsLink,
    //   httpLink
    // );

    // const client = new ApolloClient({
    //   link: link,
    //   cache: new InMemoryCache()
    // });

    const WALLET_BALANCE_SUBSCRIPTION = gql`
      subscription MySubscription {
        wallet(where: {uid: {_eq: "${userId}"}}) {
          id
          wallet_balance
        }
      }
    `;

    const Patients_SUBSCRIPTION = gql`
    subscription MySubscription {
      device_info(where: {attached_uid: {_eq: "${userId}"}, device_status: {_eq: true}}, order_by: {last_active: asc}) {
        added_at
        device_type
        patients {
           name
          mobile
          is_active
          attached_device
          duration
          uid
          updated_at
          end_date
          payment
          report
          unread
          attached_report
        }
      }
    }
    
    `;

    const PRODUCTS_SUBSCRIPTION = gql`
      subscription MySubscription {
        products(where: {product_type: {_eq: "service"}}) {
          id
          price
          duration
        }
      }
    `;

    if (client && userId) {

     subscription = client.subscribe({ query: WALLET_BALANCE_SUBSCRIPTION }).subscribe({
      next(response) {
        const walletBalance = response.data.wallet[0].wallet_balance;
        setWalletBalance(walletBalance);
      },
      error(err) { console.error('Error:', err); }
    });

     patientsdata = client.subscribe({ query: Patients_SUBSCRIPTION }).subscribe({
      next(response) {
        const tableData = response.data.device_info.map((item) => ({
          deviceType: item.device_type,
          patients: item.patients,
        }));
        setTableData(tableData);
      },
      error(err) { console.error('Error in AnotherSubscription:', err); }
    });

     productsubscription = client.subscribe({ query: PRODUCTS_SUBSCRIPTION }).subscribe({
      next(response) {
        setSelectedProduct(response.data.products);
        setSelectedValue(response.data.products[0].duration + "-" + response.data.products[0].price);
      },
      error(err) { console.error('Error:', err); }
    });
    }

    

    return () => {
      subscription?.unsubscribe();
      patientsdata?.unsubscribe();
      productsubscription?.unsubscribe();
    };  
  }, [navType, primary, darkLight, grey200, isLoading, grey500, getUserId,client]);

  const displayRazorpay = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
  );

  if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
  }

  const balanceAmount = parseFloat(selectedValue.split('-')[1]) - walletBalance ;
  console.log("Balance amount:", balanceAmount);

  // creating a new order
  const result = await axios.post("http://localhost:5000/payment/orders",{amount: balanceAmount});

  if (!result) {
      alert("Server error. Are you online?");
      return;
  }

  // Getting the order details back
  const { amount, id: order_id, currency } = result.data;

  const options = {
      key: "rzp_test_WUni4vBy2NBp3D", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "Soumya Corp.",
      description: "Test Transaction",
     
      order_id: order_id,
      handler: async function (response) {
          const data = {
              orderCreationId: order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
          };

          const result = await axios.post("http://localhost:5000/payment/success", data);

          if (result.data.paymentAmount) {
            // // Deposit the wallet balance after a successful payment
            // const depositAmount = parseFloat(result.data.paymentAmount);
        
            // Call the depositWallet mutation
          
            // depositFunds({ variables: { amount: depositAmount } })
            //   .then((response) => {
            //     // Handle the response if needed
            //     console.log('Wallet deposited successfully', response);
            //   })
            //   .catch((error) => {
            //     // Handle any errors during wallet deposit
            //     console.error('Error depositing wallet', error);
            //   });
          } else {
            alert('Payment failed');
          }

      },
      prefill: {
          name: "Soumya Dey",
          email: "SoumyaDey@example.com",
          contact: "9999999999",
      },
      notes: {
          address: "Soumya Dey Corporate Office",
      },
      theme: {
          color: "#61dafb",
      },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
  };

  const handleDownload = (key) => {
    var params = {
      Bucket: 'vaidshalareport133928-dev/public',
      Key: key
    };
        s3.getObject(params, (error, data) => {
          if (error) {
              console.error("Error downloading the file:", error);
          } else {
              const blob = new Blob([data.Body], { type: data.ContentType });
      
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
      
              // To prompt the user to download the file:
              link.download = key; // set your desired file name here
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
      
              // OR, to open the PDF in a new tab:
              // window.open(link.href, '_blank');
          }
      });
      
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePrint = (key) => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js';
  const params = {
    Bucket: 'vaidshalareport133928-dev/public',
    Key: key,
    ResponseContentType: 'application/pdf'
  };

  s3.getObject(params, (error, data) => {
    if (error) {
      console.error("Error fetching the PDF:", error);
      return;
    }

    const blob = new Blob([data.Body], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    
    const loadingTask = pdfjsLib.getDocument(blobUrl);

    loadingTask.promise.then(pdf => {
      return pdf.getPage(1); // This is for the first page. You may need to loop for all pages.
    }).then(page => {
      const scale = 1.5;
      const viewport = page.getViewport({ scale: scale });

      // Prepare canvas using PDF page dimensions
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      const renderTask = page.render(renderContext);
      
      renderTask.promise.then(() => {
        const printWindow = window.open('', '_blank');
        printWindow.document.body.appendChild(canvas);
        printWindow.document.close();
        printWindow.print();
        URL.revokeObjectURL(blobUrl);
      });
    });
  });
  };

  const sendEmailWithAttachment = async (pdfKey, recipientEmail) => {
    const s3 = new AWS.S3();

  const params = {
      Bucket: 'vaidshalareport133928-dev/public',
      Key: pdfKey
  };

  try {
      const data = await s3.getObject(params).promise();

      // Create a nodemailer transporter using Gmail SMTP
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: 'sendmail@cardiofit.in', 
              pass: 'kRv9EGeZpFxXbBQacw8M5r' 
          }
      });

      // Setup email data
      const mailOptions = {
          from: '"Sender Name" <sendmail@cardiofit.in>', 
          to: recipientEmail, 
          subject: 'Your Requested PDF', 
          text: 'Please find attached the requested PDF.',
          attachments: [
              {
                  filename: pdfKey,
                  content: data.Body,
                  contentType: 'application/pdf'
              }
          ]
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info);
  } catch (error) {
      console.error("Error sending email:", error);
  }
  };

  function  renderButton (price, wallet_balance) {
    if (price <= wallet_balance) {
      return <Button
      variant="contained"
      color="primary"
      
    > Pay</Button>;
  } else {
      return <Button
      variant="contained"
      color="primary"
      onClick={displayRazorpay}
    >
      Recharge and Pay
    </Button>;
  }
  }


  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">Total Growth</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">
                        {walletBalance ? `₹ ${walletBalance.toFixed(2)}` : 'Loading...'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <AnimateButton>
                    <Button
                      onClick={() => logout({ returnTo: window.location.origin })}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="secondary"
                    >
                      Logout
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Device Details</TableCell>
                      <TableCell>Patients</TableCell>
                      <TableCell>Monitoring Duration</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
   
                            <p>{row.deviceType}</p>
                        </TableCell>
                        <TableCell>
                          <ul>
                            {row.patients.map((patient) => (
                             <>
                               <p>{patient.name}</p>
                                <p>{patient.mobile}</p>
                                <p>{patient.is_active ? 'Yes' : 'No'}</p>
                                <p>{patient.payment ? 'Paid' : 'Not Paid'}</p>
                             </>
                            ))}
                          </ul>
                        </TableCell>
                        <TableCell>
                        {row.patients.map((patient) => (
                              <li key={patient.uid}>
                                <p>Duration: {patient.duration} Days</p>
                                <p>
                                <Link component="button" variant="body2" onClick={handleOpen}>
                                  Extend Duration
                                  </Link> 
                                </p>
                                <Dialog open={open} onClose={handleClose}>
                                  <DialogTitle>Add Balance</DialogTitle>
                                    <DialogContent>
                                      <DialogContentText>Enter the amount to add to the wallet.</DialogContentText>
                                    <TextField
                                      id="standard-select-currency"
                                      select
                                      value={selectedValue}
                                      onChange={(e) => setSelectedValue(e.target.value)}
                                    >
                                      {selectedProduct.map((option, index) => (
                                        <MenuItem
                                          key={index}
                                          value={`${option.duration}-${option.price}`}
                                        >
                                          {`${option.duration} Days + ₹ ${option.price}`}
                                        </MenuItem>
                                      ))}
                                    </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={displayRazorpay} >
            Add
          </Button>
        </DialogActions>
        
        </Dialog>
                                {patient.payment ? '' : (
                                <>
                                  <p>
                                    <TextField
                                      id="standard-select-currency"
                                      select
                                      value={selectedValue}
                                      onChange={(e) => setSelectedValue(e.target.value)}
                                    >
                                      {selectedProduct.map((option, index) => (
                                        <MenuItem
                                          key={index}
                                          value={`${option.duration}-${option.price}`}
                                        >
                                          {`${option.duration} Days + ₹ ${option.price}`}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                  </p>
                                 
                                </>
                              )}
                              </li>
                            ))}
                        </TableCell>
                        <TableCell>
                        {row.patients.map((patient) => (
                        <li key={patient.uid}>
                        {patient.payment ? 'Paid' : (
                         <p>{renderButton(parseFloat(selectedValue.split('-')[1]), walletBalance)}</p>
                         )}
                         </li>
                          ))}
                        </TableCell>
                        <TableCell>
                          {row.patients.map((patient) => (
                            <li key={patient.uid}>
                              {patient.is_active === "report done" ? (
                                <>     
                                  <p>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => handleDownload(patient.attached_report)}
                                    >
                                      View Report
                                    </Button>
                                  </p>
                                  <p>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      onClick={() => handlePrint(patient.attached_report)}
                                    >
                                      Print Report
                                    </Button>
                                  </p>
                                  <p>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => sendEmailWithAttachment(patient.attached_report, "appu.apoorva554@gmail.com")}
                                    >
                                      Send PDF to Email
                                    </Button>
                                  </p>
                                </>
                              ) : (
                                patient.is_active
                              )}
                            </li>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
