import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react'; 
import { useNavigate } from 'react-router-dom';
import React, { useEffect,useState, } from 'react';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
// Import Amplify and specific modules
import { Amplify } from 'aws-amplify';// Import Amplify from 'core'
import awsConfig from './aws-exports';

// Configure Amplify
Amplify.configure(awsConfig);

// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);  // Introduce loading state

  

  useEffect(() => {
    // Simulate loading delay of 2 seconds before checking authentication
    setTimeout(() => {
      setLoading(false);
      if (!isAuthenticated) {
        console.log("User is NOT authenticated");
        navigate('/pages/login/login3');
      } else {
        console.log("User is authenticated");
        navigate('/');
      }
    }, 2000);
  }, [isAuthenticated]);

  if (loading) {
    // Replace with your preferred loading spinner or component
    return <div>Loading...</div>;
  }

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          <Routes />
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
