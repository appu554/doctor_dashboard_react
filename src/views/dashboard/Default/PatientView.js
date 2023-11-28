import { Grid, Link } from '@mui/material';
import MuiTypography from '@mui/material/Typography';
import { gql } from '@apollo/client';
import { useState, useEffect } from 'react';
import axios from "axios";

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import { useApolloClient } from '../../../apollo-client';
import { useAuthInfo } from '../../../useAuthInfo'; 
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
    TextField
  } from '@mui/material';






// ==============================|| TYPOGRAPHY ||============================== //

const WalletView = ({isLoading}) => {
    const { getUserId } = useAuthInfo();
    const [userId, setUserId] = useState(null);
    const [open, setOpen] = useState(false);
    const [amountToAdd, setAmountToAdd] = useState('');
    const [walletBalance, setWalletBalance] = useState(null);
    const [walletTransactions, setWalletTransactions] = useState([]);

    const client = useApolloClient(); 

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
    



    useEffect(() => {
        let subscription_transaction;
        let subscription_balance;
         
    const fetchData = async () => {
        const fetchedUserId = getUserId();
        setUserId(fetchedUserId);
      };
  
      fetchData();
      console.log("Checking client",client)


        // GraphQL subscription for wallet transactions
const WALLET_TRANSACTION_SUBSCRIPTION = gql`
subscription wallet_transaction($userid: String) {
  wallet_transactions(where: {uid: {_eq: $userid}}, order_by: {timestamp: desc}) {
    id
    type
    timestamp
    email
    amount
  }
}
`;

// GraphQL subscription for wallet balance
const WALLET_BALANCE_SUBSCRIPTION = gql`
subscription wallet_balance($userid: String) {
  wallet(where: {uid: {_eq: $userid}}) {
    wallet_balance
    user_type
    uid
    name
    id
  }
}
`;


      if (client && userId) {

        subscription_transaction = client.subscribe({
      query: WALLET_TRANSACTION_SUBSCRIPTION,
      variables: { userid: userId }
    }).subscribe({
      next(response) {
        setWalletTransactions(response.data.wallet_transactions);
      },
      error(err) {
        console.error('Error:', err);
      }
    });

     subscription_balance = client.subscribe({
      query: WALLET_BALANCE_SUBSCRIPTION,
      variables: { userid: userId }
    }).subscribe({
      next(response) {
        const balance = response.data.wallet[0]?.wallet_balance;
        setWalletBalance(balance);
      },
      error(err) {
        console.error('Error:', err);
      }
    });

    }
    return () => {
        subscription_transaction?.unsubscribe();
        subscription_balance?.unsubscribe();
      };  
    }, [getUserId,client,isLoading]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    
  const displayRazorpay = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
  );

  if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
  }

  const balanceAmount = parseFloat(amountToAdd.split('-')[1]) - walletBalance ;
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
            handlePaymentSuccess(result.data.paymentAmount);
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



    return (
        <>
          {isLoading ? (
            <SkeletonTotalGrowthBarChart />
          ) : ( 

  <MainCard title="Patient View" Secondery >
    <Grid container spacing={gridSpacing}>
    <Grid item xs={12}>
    <Button variant="outlined" onClick={handleOpen}>
        Add Balance
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Balance</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the amount to add to the wallet.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            value={amountToAdd}
            onChange={(e) => setAmountToAdd(e.target.value)}
            
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={displayRazorpay} >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {walletTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.email}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Render current wallet balance */}
      <div>
        <h3>Current Wallet Balance: {walletBalance}</h3>
      </div>
      {/* Add Button to add balance (functionality not implemented in this snippet) */}
      <Button variant="contained" color="primary">
        Add Balance
      </Button>
    </Grid>
      <Grid item xs={12} sm={6}>
        <SubCard title="Heading">
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <MuiTypography variant="h1" gutterBottom>
                h1. Heading
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="h2" gutterBottom>
                h2. Heading
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="h3" gutterBottom>
                h3. Heading
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="h4" gutterBottom>
                h4. Heading
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="h5" gutterBottom>
                h5. Heading
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="h6" gutterBottom>
                h6. Heading
              </MuiTypography>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
      <Grid item xs={12} sm={6}>
        <SubCard title="Sub title">
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <MuiTypography variant="subtitle1" gutterBottom>
                subtitle1. Lorem ipsum dolor sit connecter adieu siccing eliot. Quos blanditiis tenetur
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="subtitle2" gutterBottom>
                subtitle2. Lorem ipsum dolor sit connecter adieu siccing eliot. Quos blanditiis tenetur
              </MuiTypography>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
      <Grid item xs={12} sm={6}>
        <SubCard title="Body">
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <MuiTypography variant="body1" gutterBottom>
                body1. Lorem ipsum dolor sit connecter adieu siccing eliot. Quos blanditiis tenetur unde suscipit, quam beatae rerum
                inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="body2" gutterBottom>
                body2. Lorem ipsum dolor sit connecter adieu siccing eliot. Quos blanditiis tenetur unde suscipit, quam beatae rerum
                inventore consectetur, neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
              </MuiTypography>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
      <Grid item xs={12} sm={6}>
        <SubCard title="Extra">
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <MuiTypography variant="button" display="block" gutterBottom>
                button text
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="caption" display="block" gutterBottom>
                caption text
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography variant="overline" display="block" gutterBottom>
                overline text
              </MuiTypography>
            </Grid>
            <Grid item>
              <MuiTypography
                variant="body2"
                color="primary"
                component={Link}
                href="https://berrydashboard.io"
                target="_blank"
                display="block"
                underline="hover"
                gutterBottom
              >
                https://berrydashboard.io
              </MuiTypography>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
    </Grid>
  </MainCard>
      )}
      </>
    );
  };



export default WalletView;
