// useAuthInfo.js
import { useAuth0 } from '@auth0/auth0-react';

export const useAuthInfo = () => {
  const { user, getIdTokenClaims , isAuthenticated } = useAuth0();

  const getUserId = () => {
    return isAuthenticated ? user.sub : null;
  };

  const getAuthToken = async () => {
    if (isAuthenticated) {
      try {
        const idToken = await getIdTokenClaims();
        return idToken.__raw;
      } catch (error) {
        console.error('Error obtaining access token:', error);
        return null;
      }
    } else {
      return null;
    }
  };

  return {
    getUserId,
    getAuthToken,
  };
};
