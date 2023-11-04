export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI0N2NhY2IzMy1lMDNjLTRiOGUtODBhNy05OTViMTUyMjc2ODgiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY5OTAyNTQ5MCwiZXhwIjoxNjk5NjMwMjkwfQ.70E0mdo5YXy0aak6V9-VENuU8Hk9b34-pG8FdEevpuk";

// API call to create meeting
export const createMeeting = async () => {
  const res = await fetch(`http://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const { roomId } = await res.json();
  return roomId;
};