export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI0N2NhY2IzMy1lMDNjLTRiOGUtODBhNy05OTViMTUyMjc2ODgiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY5ODkxMjU3NSwiZXhwIjoxNjk4OTk4OTc1fQ.1Qm4HtAJjmIyvbaHNAPZWxy-kqKwemoGrtjHSe6xYXg";

// API call to create meeting
export const createMeeting = async () => {
  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI0N2NhY2IzMy1lMDNjLTRiOGUtODBhNy05OTViMTUyMjc2ODgiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY5OTEwMTUzNiwiZXhwIjoxNjk5NzA2MzM2fQ.rR0Fci8YDKzg_94uqT7wQr0nGxvSSdBxldeMza9Xokc',
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const { roomId } = await res.json();
  return roomId;
};