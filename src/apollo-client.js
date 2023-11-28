import { useState, useEffect, useMemo } from 'react';
import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { useAuthInfo } from './useAuthInfo'; // Import your useAuthInfo hook

export const useApolloClient = () => {
  const { getAuthToken } = useAuthInfo();
  const [authToken, setAuthToken] = useState(null); // Initialize as null to indicate no token yet

  useEffect(() => {
    let isMounted = true;

    // const fetchToken = async () => {
       
    //       const token = await getAuthToken();
    //       if (isMounted) {
    //         setAuthToken(token);
    //         console.log("Token received:", token);
    //       }
       
    //   };
    const fetchToken = async () => {
      const token = await getAuthToken();
      if (isMounted && token !== authToken) {
        setAuthToken(token);
        console.log("Token updated:", token);
      }
    };

    fetchToken();

    return () => {
      isMounted = false;
    };
  }, [getAuthToken]);

  // Memoize the creation of the links and Apollo Client instance to only recompute when authToken changes
  const client = useMemo(() => {
    // If the token isn't yet available, don't create the client
    if (!authToken) return null;

    const httpLink = new HttpLink({
      uri: 'https://helping-swan-32.hasura.app/v1/graphql',
    });

    const authLink = setContext((_, { headers }) => ({
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'X-Hasura-Role': 'doctor',
      },
    }));

    const wsLink = new WebSocketLink({
      uri: 'wss://helping-swan-32.hasura.app/v1/graphql',
      options: {
        reconnect: true,
        connectionParams: {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            'X-Hasura-Role': 'doctor',
          },
        },
      },
    });

    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      authLink.concat(httpLink),
    );

    return new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
    });
  }, [authToken]); // Only recreate the Apollo Client when authToken changes

  return client;
};
