import PropTypes from 'prop-types';
import { useState, useEffect,useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthInfo } from '../../../useAuthInfo';
// import { Storage } from 'aws-amplify';
import {

  Button 
} from '@mui/material'

import {
  MeetingProvider,
  useMeeting,
  useParticipant,
  MeetingConsumer
} from "@videosdk.live/react-sdk";
import ReactPlayer from "react-player";
import {createMeeting } from "../../../API";

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';
import AWS from 'aws-sdk';
import awsConfig from '../../../aws-exports';

// import { ApolloClient, InMemoryCache, split, HttpLink , gql } from '@apollo/client';
// import { WebSocketLink } from '@apollo/client/link/ws';
// import { getMainDefinition } from '@apollo/client/utilities';

// third-party
// import ApexCharts from 'apexcharts';
// import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';

// chart data
// import chartData from './chart-data/total-growth-bar-chart';

// Configure AWS SDK with your credentials
AWS.config.update({
  accessKeyId: awsConfig.aws_access_key_id,
  secretAccessKey: awsConfig.aws_secret_access_key,
  region: awsConfig.aws_region
});


function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = useState(null);
  const onClick = async () => {
    await getMeetingAndToken(meetingId);
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Enter Meeting Id"
        onChange={(e) => {
          setMeetingId(e.target.value);
        }}
      />
      <button onClick={onClick}>Join</button>
      {" or "}
      <button onClick={onClick}>Create Meeting</button>
    </div>
  );
}

function ParticipantView(props) {
  const micRef = useRef(null);
  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(props.participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        micRef.current.srcObject = mediaStream;
        micRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);

  return (
    <div key={props.participantId}>
      <p>
        Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
        {micOn ? "ON" : "OFF"}
      </p>
      <audio ref={micRef} autoPlay  muted={isLocal}>
  <track kind="captions" />
</audio>
      {webcamOn && (
        <ReactPlayer
          //
          playsinline // very very imp prop
          pip={false}
          light={false}
          controls={false}
          muted={true}
          playing={true}
          //
          url={videoStream}
          //
          height={"200px"}
          width={"300px"}
          onError={(err) => {
            console.log(err, "participant video error");
          }}
        />
      )}
    </div>
  );
}

function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting();
  return (
    <div>
      <button onClick={() => leave()}>Leave</button>
      <button onClick={() => toggleMic()}>toggleMic</button>
      <button onClick={() => toggleWebcam()}>toggleWebcam</button>
    </div>
  );
}

function MeetingView(props) {
  const [joined, setJoined] = useState(null);
  const { join } = useMeeting();
  const { participants } = useMeeting({
    onMeetingJoined: () => {
      setJoined("JOINED");
    },
    onMeetingLeft: () => {
      props.onMeetingLeave();
    },
  });
  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  return (
    <div className="container">
      <h3>Meeting Id: {props.meetingId}</h3>
      {joined && joined == "JOINED" ? (
        <div>
          <Controls />
          {[...participants.keys()].map((participantId) => (
            <ParticipantView
              participantId={participantId}
              key={participantId}
            />
          ))}
        </div>
      ) : joined && joined == "JOINING" ? (
        <p>Joining the meeting...</p>
      ) : (
        <button onClick={joinMeeting}>Join</button>
      )}
    </div>
  );
}



// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading }) => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const { navType } = customization;
  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const grey200 = theme.palette.grey[200];
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;

  // const [tableData, setTableData] = useState([]);
  // const [walletBalance, setWalletBalance] = useState(null);
  // const [selectedProduct, setSelectedProduct] = useState([]);
  // const [selectedValue, setSelectedValue] = useState(''); 
  // const [depositFunds] = useMutation(DEPOSIT_MUTATION);

  const {logout } = useAuth0();
  const { getUserId, getAuthToken } = useAuthInfo();
  const [userId, setUserId] = useState(null);
  const [authToken, setAuthToken] = useState(null);




  useEffect(() => {
    // Retrieve user ID and token
    const fetchData = async () => {
      const fetchedUserId = getUserId();
      const fetchedAuthToken = await getAuthToken();

      setUserId(fetchedUserId);
      setAuthToken(fetchedAuthToken);
      console.log(authToken);
      console.log(userId);
    };

    fetchData();

         // Define the GraphQL endpoint and headers
        //  const endpoint = 'https://backend.cardiofit.in/v1/graphql'; // Replace with your GraphQL server's endpoint
        //  const headers = {
        //    'Content-Type': 'application/json',
        //    'Authorization': `Bearer ${authToken}` ,
        //    'X-Hasura-Role': "doctor"// Replace with your Hasura Admin Secret
        //    };
     
        //    const httpLink = new HttpLink({
        //      uri: endpoint,
        //      headers: headers
        //    });
           
        //    const wsLink = new WebSocketLink({
        //      uri: `ws://backend.cardiofit.in/v1/graphql`,  // Note: Use wss for https
        //      options: {
        //        reconnect: true,
        //        connectionParams: {
        //          headers: headers
        //        }
        //      }
        //    });
           
        //    const link = split(
        //      ({ query }) => {
        //        const definition = getMainDefinition(query);
        //        return (
        //          definition.kind === 'OperationDefinition' &&
        //          definition.operation === 'subscription'
        //        );
        //      },
        //      wsLink,
        //      httpLink
        //    );
           
        //    const client = new ApolloClient({
        //      link: link,
        //      cache: new InMemoryCache()
        //    });
  

    // Define the GraphQL query
//     const DEPOSIT_MUTATION = gql`
// mutation Deposit($amount: numeric!) {
//   insert_wallet_transactions_one(object: {amount: $amount, type: "Deposit"}) {
//     id
//   }
//   update_wallet(where: {}, _inc: {wallet_balance: $amount}) {
//     affected_rows
//     returning {
//       emailid
//       wallet_balance
//     }
//   }
// }
// `;


  //   const WALLET_BALANCE_SUBSCRIPTION = gql`
  //   subscription MySubscription {
  //     wallet(where: {uid: {_eq: "${userId}"}}) {
  //       id
  //       wallet_balance
  //     }
  //   }
  // `;

  //  const Patients_SUBSCRIPTION = gql`
  //   subscription MySubscription {
  //     device_info(
  //       where: { attached_uid: { _eq:  "${userId}"}, device_status: { _eq: true } }
  //       order_by: { device_info_patients_aggregate: {}, last_active: asc }
  //     ) {
  //       device_info_patients {
  //         name
  //         mobile
  //         is_active
  //         attached_device
  //         duration
  //         uid
  //         updated_at
  //         end_date
  //         payment
  //         report
  //         unread
  //         attached_report
  //       }
  //       added_at
  //       device_type
  //     }
  //   }
  // `;

  // const PRODUCTS_SUBSCRIPTION = gql`
  //   subscription MySubscription {
  //     products(where: {product_type: {_eq: "service"}}) {
  //       id
  //       price
  //       duration
  //     }
  //   }
  // `;





  // const subscription = client.subscribe({ query: WALLET_BALANCE_SUBSCRIPTION }).subscribe({
  //   next(response) {
  //     const walletBalance = response.data.wallet[0].wallet_balance;  // adjusted the access to wallet_balance
  //     setWalletBalance(walletBalance);
  //   },
  //   error(err) { console.error('Error:', err); }
  // });

  
  // const patientsdata = client.subscribe({ query: Patients_SUBSCRIPTION }).subscribe({
  //   next(response) {
  //     // Handle the data from the other subscription here

  //     const tableData = response.data.device_info.map((item) => ({
  //       deviceType: item.device_type,
  //       patients: item.device_info_patients,
  //     }));

  //     setTableData(tableData);
  //     console.log(response.data);
  //   },
  //   error(err) { console.error('Error in AnotherSubscription:', err); }
  // });


  // const productsubscription = client.subscribe({ query: PRODUCTS_SUBSCRIPTION }).subscribe({
  //   next(response) {
  //     setSelectedProduct(response.data.products);
  //     // Optionally set the first item as selected, or another default
  //     setSelectedValue(response.data.products[0].duration + "-" + response.data.products[0].price);
  //     console.log(setSelectedValue);
  //   },
  //   error(err) { console.error('Error:', err); }
  // });






  // const handleDeposit = (amount) => {
  //   depositFunds({ variables: { amount } })
  //     .then((response) => {
  //       // Handle the response if needed
  //       console.log('Wallet deposited successfully', response);
  //     })
  //     .catch((error) => {
  //       // Handle any errors during wallet deposit
  //       console.error('Error depositing wallet', error);
  //     });
  // };



    
  return () => {
        // Cleanup subscription on component unmount
        // subscription.unsubscribe();
        // patientsdata.unsubscribe();
        // productsubscription.unsubscribe();
    };  
  }, [navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500,getUserId, getAuthToken]);
  

  // Subscribe to the wallet_balance subscription
  // const subscribeToWalletBalance = async () => {
    
  // };

  // const handlePayment = () => {
  //   // Check the wallet balance here
  //   if (walletBalance < 100) {
  //     // Open Razorpay
  //     // Implement Razorpay integration here
  //   } else {
  //     // Perform the payment action
  //     // Implement your payment logic here
  //   }
  // }






const [meetingId, setMeetingId] = useState(null);

const getMeetingAndToken = async (id) => {
  const meetingId =
    id == null ? await createMeeting({ token: authToken }) : id;
  setMeetingId(meetingId);
};

const onMeetingLeave = () => {
  setMeetingId(null);
};

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
            { authToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: "C.V. Raman",
      }}
      token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI0N2NhY2IzMy1lMDNjLTRiOGUtODBhNy05OTViMTUyMjc2ODgiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY5OTEwMTUzNiwiZXhwIjoxNjk5NzA2MzM2fQ.rR0Fci8YDKzg_94uqT7wQr0nGxvSSdBxldeMza9Xokc"
    >
      <MeetingConsumer>
        {() => (
          <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
        )}
      </MeetingConsumer>
    </MeetingProvider>
  ) : (
    <JoinScreen getMeetingAndToken={getMeetingAndToken} />
  )
}
  
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">Total Growth</Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3"> Loading...</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                <AnimateButton>
                <Button  onClick={() => logout({ returnTo: window.location.origin })}
                fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Logout
                </Button>
              </AnimateButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              
            </Grid>
            <Grid item xs={12}>
              {/* <Chart {...chartData} /> */}
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



// import "../../../App.css";
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import {
//   MeetingProvider,
//   MeetingConsumer,
//   useMeeting,
//   useParticipant,
// } from "@videosdk.live/react-sdk";
// import ReactPlayer from "react-player";

// function JoinScreen({ getMeetingAndToken }) {
//   const [meetingId, setMeetingId] = useState(null);
//   const onClick = async () => {
//     await getMeetingAndToken(meetingId);
//   };
//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Enter Meeting Id"
//         onChange={(e) => {
//           setMeetingId(e.target.value);
//         }}
//       />
//       <button onClick={onClick}>Join</button>
//       {" or "}
//       <button onClick={onClick}>Create Meeting</button>
//     </div>
//   );
// }

// function ParticipantView(props) {
//   const micRef = useRef(null);
//   const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
//     useParticipant(props.participantId);

//   const videoStream = useMemo(() => {
//     if (webcamOn && webcamStream) {
//       const mediaStream = new MediaStream();
//       mediaStream.addTrack(webcamStream.track);
//       return mediaStream;
//     }
//   }, [webcamStream, webcamOn]);

//   useEffect(() => {
//     if (micRef.current) {
//       if (micOn && micStream) {
//         const mediaStream = new MediaStream();
//         mediaStream.addTrack(micStream.track);

//         micRef.current.srcObject = mediaStream;
//         micRef.current
//           .play()
//           .catch((error) =>
//             console.error("videoElem.current.play() failed", error)
//           );
//       } else {
//         micRef.current.srcObject = null;
//       }
//     }
//   }, [micStream, micOn]);

//   return (
//     <div key={props.participantId}>
//       <p>
//         Participant: {displayName} | Webcam: {webcamOn ? "ON" : "OFF"} | Mic:{" "}
//         {micOn ? "ON" : "OFF"}
//       </p>
//       <audio ref={micRef} autoPlay  muted={isLocal}>
//   <track kind="captions" />
// </audio>

//       {webcamOn && (
//         <ReactPlayer
//           //
//           playsinline // very very imp prop
//           pip={false}
//           light={false}
//           controls={false}
//           muted={true}
//           playing={true}
//           //
//           url={videoStream}
//           //
//           height={"200px"}
//           width={"300px"}
//           onError={(err) => {
//             console.log(err, "participant video error");
//           }}
//         />
//       )}
//     </div>
//   );
// }

// function Controls() {
//   const { leave, toggleMic, toggleWebcam } = useMeeting();
//   return (
//     <div>
//       <button onClick={() => leave()}>Leave</button>
//       <button onClick={() => toggleMic()}>toggleMic</button>
//       <button onClick={() => toggleWebcam()}>toggleWebcam</button>
//     </div>
//   );
// }

// function MeetingView(props) {
//   const [joined, setJoined] = useState(null);
//   const { join } = useMeeting();
//   const { participants } = useMeeting({
//     onMeetingJoined: () => {
//       setJoined("JOINED");
//     },
//     onMeetingLeft: () => {
//       props.onMeetingLeave();
//     },
//   });
//   const joinMeeting = () => {
//     setJoined("JOINING");
//     join();
//   };

//   return (
//     <div className="container">
//       <h3>Meeting Id: {props.meetingId}</h3>
//       {joined && joined == "JOINED" ? (
//         <div>
//           <Controls />
//           {[...participants.keys()].map((participantId) => (
//             <ParticipantView
//               participantId={participantId}
//               key={participantId}
//             />
//           ))}
//         </div>
//       ) : joined && joined == "JOINING" ? (
//         <p>Joining the meeting...</p>
//       ) : (
//         <button onClick={joinMeeting}>Join</button>
//       )}
//     </div>
//   );
// }

// function TotalGrowthBarChart() {
//   const [meetingId, setMeetingId] = useState(null);

//   const getMeetingAndToken = async () => {
//     const meetingId =
//      "0e5j-ah1f-gmyq"
//     setMeetingId(meetingId);
//   };

//   const onMeetingLeave = () => {
//     setMeetingId(null);
//   };

//   return meetingId ? (
//         <>
//       {isLoading ? (
//         <SkeletonTotalGrowthBarChart />
//       ) : (
//         <MainCard>
//     <MeetingProvider
//       config={{
//         meetingId,
//         micEnabled: true,
//         webcamEnabled: true,
//         name: "C.V. Raman",
//       }}
//       token={"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI0N2NhY2IzMy1lMDNjLTRiOGUtODBhNy05OTViMTUyMjc2ODgiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY5OTAyNTQ5MCwiZXhwIjoxNjk5NjMwMjkwfQ.70E0mdo5YXy0aak6V9-VENuU8Hk9b34-pG8FdEevpu"}
//     >
//       <MeetingConsumer>
//         {() => (
//           <MeetingView meetingId={meetingId} onMeetingLeave={onMeetingLeave} />
//         )}
//       </MeetingConsumer>
//     </MeetingProvider>
//   ) : (
//     <JoinScreen getMeetingAndToken={getMeetingAndToken} />
//   );
//       </MainCard>
//       )}
//     </>
//   )
// }

// export default TotalGrowthBarChart;