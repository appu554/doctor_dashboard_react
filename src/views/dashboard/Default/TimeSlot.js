// import React, { useState, useEffect } from 'react';
// import { gql } from '@apollo/client';
// import { useApolloClient } from '../../../apollo-client';

// // GraphQL subscription for doctor's time slots
// const TIME_SLOTS_SUBSCRIPTION = gql`
// subscription MySubscription {
//   time_slots(where: {doctor_id: {_eq: "auth0|64ce63ab460998ee9e1793f8"}}) {
//     start_time
//     is_booked
//     date
//   }
// }
// `;

// const DoctorAvailabilityForm = () => {
//   const [selectedDates, setSelectedDates] = useState({});
//   const [timeSlotsData, setTimeSlotsData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const client = useApolloClient(); 

//   useEffect(() => {
//     let subscription;
//     if (client) {
//       subscription = client.subscribe({
//         query: TIME_SLOTS_SUBSCRIPTION,
//       }).subscribe({
//         next(response) {
//             console.log(response);
//           setTimeSlotsData(response.data.time_slots);
//           setLoading(false);
//         },
//         error(err) {
//           console.error('Error:', err);
//           setError(err);
//           setLoading(false);
//         }
//       });
//     }

//     return () => {
//       subscription?.unsubscribe();
//     };
//   }, [client]);

//   useEffect(() => {
//     if (timeSlotsData) {
//       let updatedDates = {};
//       timeSlotsData.forEach(({ date, start_time, is_booked }) => {
//         if (!updatedDates[date]) {
//           updatedDates[date] = [];
//         }
//         if (!is_booked) {
//           updatedDates[date].push(start_time);
//         }
//       });
//       setSelectedDates(updatedDates);
//     }
//   }, [timeSlotsData]);

//   const handleTimeSlotChange = (date, timeSlot) => {
//     setSelectedDates(prevDates => ({
//       ...prevDates,
//       [date]: prevDates[date].includes(timeSlot) ? 
//               prevDates[date].filter(time => time !== timeSlot) : 
//               [...prevDates[date], timeSlot]
//     }));
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log(selectedDates);
//     // Here, you'd typically send this data to a server
//   };

//   // Generate 24-hour time slots
//   const generateTimeSlots = () => {
//     let slots = [];
//     for (let i = 0; i < 24; i++) {
//       slots.push(`${i}:00`);
//       slots.push(`${i}:30`);
//     }
//     return slots;
//   };

//   const timeSlots = generateTimeSlots();

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error :(</p>;

//   return (
//     <form onSubmit={handleSubmit}>
//       {Object.keys(selectedDates).map(date => (
//         <div key={date}>
//           <h3>{date}</h3>
//           {timeSlots.map(slot => (
//             <label key={slot}>
//               <input
//                 type="checkbox"
//                 checked={selectedDates[date].includes(slot)}
//                 onChange={() => handleTimeSlotChange(date, slot)}
//                 disabled={timeSlotsData && timeSlotsData.some(ts => ts.date === date && ts.start_time === slot && ts.is_booked)}
//               />
//               {slot}
//             </label>
//           ))}
//         </div>
//       ))}
//       <button type="submit">Save Availability</button>
//     </form>
//   );
// };

// export default DoctorAvailabilityForm;


// import React, { useState, useEffect } from 'react';
// import { gql } from '@apollo/client';
// import { useApolloClient } from '../../../apollo-client';

// // GraphQL subscription for doctor's time slots
// const TIME_SLOTS_SUBSCRIPTION = gql`
// subscription MySubscription($currentDate: String!) {
//   time_slots(where: {doctor_id: {_eq: "auth0|64ce63ab460998ee9e1793f8"}, date: {_gte: $currentDate}}) {
//     start_time
//     is_booked
//     date
//   }
// }
// `;

// const DoctorAvailabilityForm = () => {
//   const [selectedDates, setSelectedDates] = useState({});
//   const [newDate, setNewDate] = useState('');
//   const [newTime, setNewTime] = useState('');
//   const [timeSlotsData, setTimeSlotsData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const client = useApolloClient(); 

//   // Get today's date in YYYY-MM-DD format
//   const today = new Date().toISOString().split('T')[0];

//   useEffect(() => {
//     let subscription;
//     if (client) {
//       subscription = client.subscribe({
//         query: TIME_SLOTS_SUBSCRIPTION,
//         variables: { currentDate: today }
//       }).subscribe({
//         next(response) {
//           setTimeSlotsData(response.data.time_slots);
//           setLoading(false);
//         },
//         error(err) {
//           console.error('Error:', err);
//           setError(err);
//           setLoading(false);
//         }
//       });
//     }

//     return () => {
//       subscription?.unsubscribe();
//     };
//   }, [client, today]);

//   useEffect(() => {
//     if (timeSlotsData) {
//       let updatedDates = {};
//       timeSlotsData.forEach(({ date, start_time, is_booked }) => {
//         if (!updatedDates[date]) {
//           updatedDates[date] = [];
//         }
//         if (!is_booked) {
//           updatedDates[date].push(start_time);
//         }
//       });
//       setSelectedDates(updatedDates);
//     }
//   }, [timeSlotsData]);

//   const handleTimeSlotChange = (date, timeSlot) => {
//     setSelectedDates(prevDates => ({
//       ...prevDates,
//       [date]: prevDates[date].includes(timeSlot) ? 
//               prevDates[date].filter(time => time !== timeSlot) : 
//               [...prevDates[date], timeSlot]
//     }));
//   };

//   const handleNewDateChange = (event) => {
//     setNewDate(event.target.value);
//   };

//   const handleNewTimeChange = (event) => {
//     setNewTime(event.target.value);
//   };

//   const addNewTimeSlot = () => {
//     if (newDate && newTime) {
//       setSelectedDates(prevDates => {
//         const updatedDates = { ...prevDates };
//         if (!updatedDates[newDate]) {
//           updatedDates[newDate] = [];
//         }
//         if (!updatedDates[newDate].includes(newTime)) {
//           updatedDates[newDate].push(newTime);
//         }
//         return updatedDates;
//       });
//       // Reset the newDate and newTime fields after adding
//       setNewDate('');
//       setNewTime('');
//     }
//     // Optionally, send this update to the server via a mutation
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log(selectedDates);
//     // Here, you'd typically send this data to a server
//   };

//   // Generate 24-hour time slots
//   const generateTimeSlots = () => {
//     let slots = [];
//     for (let i = 0; i < 24; i++) {
//       slots.push(`${i}:00`);
//       slots.push(`${i}:30`);
//     }
//     return slots;
//   };

//   const timeSlots = generateTimeSlots();

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error :(</p>;

//   return (
//     <form onSubmit={handleSubmit}>
//       {Object.keys(selectedDates).map(date => (
//          <div key={date}>
//                 <h3>{date}</h3>
//                   {timeSlots.map(slot => (
//                      <label key={slot}>
//                        <input
//                          type="checkbox"
//                          checked={selectedDates[date].includes(slot)}
//                          onChange={() => handleTimeSlotChange(date, slot)}
//                          disabled={timeSlotsData && timeSlotsData.some(ts => ts.date === date && ts.start_time === slot && ts.is_booked)}
//                        />
//                        {slot}
//                      </label>
//                    ))}
//                  </div>
//       ))}
//       {/* <div>
//         <label>
//           New Date:
//           <input type="date" value={newDate} onChange={handleNewDateChange} min={today} />
//         </label>
//         <label>
//           New Time:
//           <input type="time" value={newTime} onChange={handleNewTimeChange} />
//         </label>
//         <button type="button" onClick={addNewTimeSlot}>Add New Time Slot</button>
//       </div> */}

// <div>
//   <label>
//     New Date:
//     <input type="date" value={newDate} onChange={handleNewDateChange} min={today} />
//   </label>
//   <label>
//     New Time:
//     <input type="time" value={newTime} onChange={addNewTimeSlot} />
//   </label>
//   <label>
//     <input
//       type="checkbox"
//       checked={selectedDates[newDate]?.includes(newTime)}
//       onChange={() => handleTimeSlotChange(newDate, newTime)}
//       disabled={timeSlotsData && timeSlotsData.some(ts => ts.date === newDate && ts.start_time === newTime && ts.is_booked)}
//     />
//     Add New Time Slot
//   </label>
// </div>
//       <button type="submit">Save Availability</button>
//     </form>
//   );
// };

// export default DoctorAvailabilityForm;


// import React, { useState, useEffect } from 'react';
// import { gql } from '@apollo/client';
// import { useApolloClient } from '../../../apollo-client';

// // GraphQL subscription for doctor's time slots
// const TIME_SLOTS_SUBSCRIPTION = gql`
// subscription MySubscription($currentDate: String!) {
//   time_slots(where: {doctor_id: {_eq: "auth0|64ce63ab460998ee9e1793f8"}, date: {_gte: $currentDate}}) {
//     start_time
//     is_booked
//     date
//   }
// }
// `;

// const DoctorAvailabilityForm = () => {
//   const [selectedDates, setSelectedDates] = useState({});
//   const [newDate, setNewDate] = useState('');
//   const [timeSlotsData, setTimeSlotsData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const client = useApolloClient();

//   // Get today's date in YYYY-MM-DD format
//   const today = new Date().toISOString().split('T')[0];

//   useEffect(() => {
//     let subscription;
//     if (client) {
//       subscription = client.subscribe({
//         query: TIME_SLOTS_SUBSCRIPTION,
//         variables: { currentDate: today }
//       }).subscribe({
//         next(response) {
//           setTimeSlotsData(response.data.time_slots);
//           setLoading(false);
//         },
//         error(err) {
//           console.error('Error:', err);
//           setError(err);
//           setLoading(false);
//         }
//       });
//     }

//     return () => {
//       subscription?.unsubscribe();
//     };
//   }, [client, today]);

//   useEffect(() => {
//     if (timeSlotsData) {
//       let updatedDates = {};
//       timeSlotsData.forEach(({ date, start_time, is_booked }) => {
//         if (!updatedDates[date]) {
//           updatedDates[date] = [];
//         }
//         if (!is_booked) {
//           updatedDates[date].push(start_time);
//         }
//       });
//       setSelectedDates(updatedDates);
//     }
//   }, [timeSlotsData]);

//   const handleTimeSlotChange = (date, timeSlot) => {
//     setSelectedDates(prevDates => ({
//       ...prevDates,
//       [date]: prevDates[date].includes(timeSlot) ? 
//               prevDates[date].filter(time => time !== timeSlot) : 
//               [...prevDates[date], timeSlot]
//     }));
//   };

//   const handleNewDateChange = (event) => {
//     setNewDate(event.target.value);
//     if (!selectedDates[event.target.value]) {
//       setSelectedDates(prevDates => ({
//         ...prevDates,
//         [event.target.value]: generateTimeSlots()
//       }));
//     }
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log(selectedDates);
//     // Here, you'd typically send this data to a server
//   };

//   // Generate 24-hour time slots
//   const generateTimeSlots = () => {
//     let slots = [];
//     for (let i = 0; i < 24; i++) {
//       slots.push(`${i}:00`);
//       slots.push(`${i}:30`);
//     }
//     return slots;
//   };

//   // Function to render time slot checkboxes
//   const renderTimeSlots = (date) => {
//     return (
//       generateTimeSlots().map(slot => (
//         <label key={slot}>
//           <input
//             type="checkbox"
//             checked={selectedDates[date]?.includes(slot)}
//             onChange={() => handleTimeSlotChange(date, slot)}
//             disabled={timeSlotsData && timeSlotsData.some(ts => ts.date === date && ts.start_time === slot && ts.is_booked)}
//           />
//           {slot}
//         </label>
//       ))
//     );
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error :(</p>;

//   return (
//     <form onSubmit={handleSubmit}>
//       {Object.keys(selectedDates).map(date => (
//         <div key={date}>
//           <h3>{date}</h3>
//           {renderTimeSlots(date)}
//         </div>
//       ))}
//       <div>
//         <label>
//           New Date:
//           <input type="date" value={newDate} onChange={handleNewDateChange} min={today} />
//         </label>
//         {newDate && (
//           <div>
//             <h3>New Time Slots for {newDate}:</h3>
//             {renderTimeSlots(newDate)}
//           </div>
//         )}
//       </div>
//       <button type="submit">Save Availability</button>
//     </form>
//   );
// };

// export default DoctorAvailabilityForm;


// import React, { useState, useEffect } from 'react';
// import { gql } from '@apollo/client';
// import { useApolloClient } from '../../../apollo-client';
// import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';

// const TIME_SLOTS_QUERY = gql`
//   query MyQuery {
//     time_slots_grouped(where: {doctor_id: {_eq: "auth0|64ce63ab460998ee9e1793f8"}}) {
//       date
//       doctor_id
//       time_slots
//     }
//   }
// `;

// // const INSERT_TIME_SLOTS = gql`
// //   mutation MyMutation($objects: [time_slots_insert_input!]!) {
// //     insert_time_slots(objects: $objects) {
// //       affected_rows
// //       returning {
// //         date
// //         doctor_id
// //         is_booked
// //         start_time
// //       }
// //     }
// //   }
// // `;

// // const DELETE_TIME_SLOTS = gql`

// // mutation DeleteTimeSlots($conditions: [time_slots_bool_exp!]!) {
// //     delete_time_slots(where: {_and: $conditions}) {
// //       affected_rows
// //     }
// //   }
// //   `;
  

// const DoctorAvailabilityForm = () => {
//     const client = useApolloClient();
//     const [selectedTimeSlots, setSelectedTimeSlots] = useState({});
//     const [newSelections, setNewSelections] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
    
//     // const [initialTimeSlots, setInitialTimeSlots] = useState({});
//     // const [slotsToDelete, setSlotsToDelete] = useState([]);
//     // const today = new Date().toISOString().split('T')[0];
//     const [appointments, setAppointments] = useState([]);
//     const nextThreeDays = Array.from({ length: 3 }, (_, index) => {
//       const date = new Date();
//       date.setDate(date.getDate() + index);
//       return date.toISOString().split('T')[0];
//     });
//     // const [activeTab, setActiveTab] = useState(today);

//     const generateTimeSlots = () => {
//         const slots = [];
//         for (let i = 0; i < 24; i++) {
//           const hour = i < 12 ? i === 0 ? 12 : i : i - 12;
//           const suffix = i < 12 ? 'am' : 'pm';
//           slots.push(`${hour}:00 ${suffix}`);
//         }
//         return slots;
//     };

//     useEffect(() => {
//         let subscription;
//         if (client) {
//             subscription = client.subscribe({ query: TIME_SLOTS_QUERY }).subscribe({
//                 next(response) {
//                     const allSlots = generateTimeSlots();
//                     const fetchedData = response.data.time_slots_grouped;

//                     const newTimeSlots = {};

//                     nextThreeDays.forEach(date => {
//                         const dailyFetchedSlots = fetchedData.find(group => group.date === date)?.time_slots || [];

//                         newTimeSlots[date] = allSlots.map(slot => {
//                             const fetchedSlot = dailyFetchedSlots.find(fetchedSlot => fetchedSlot.startTime.toLowerCase() === slot.toLowerCase());
//                             return {
//                                 time: slot,
//                                 is_booked: !!fetchedSlot,
//                                 isAvailable: fetchedSlot ? fetchedSlot.isBooked : false,
//                             };
//                         });
//                     });

//                     setSelectedTimeSlots(newTimeSlots);
//                     setInitialTimeSlots(newTimeSlots);
//                     setLoading(false);

//                 },
//                 error(err) {
//                     setError(err);
//                     setLoading(false);
//                 }
//             });
//         }

//         return () => {
//             subscription?.unsubscribe();
//         };

//     }, [client]);

//     useEffect(() => {
//         console.log("Updated New Selections:", newSelections);
//     }, [newSelections]);

//     useEffect(() => {
//         console.log("Updated slots to delete: ", slotsToDelete);
//     }, [slotsToDelete]);

//     useEffect(() => {
//         const newAppointments = [];
//         for (const date in selectedTimeSlots) {
//             selectedTimeSlots[date].forEach(slot => {
//                 if (slot.is_booked) {
//                     const startTime = new Date(`${date}T${slot.time}`);
//                     const endTime = new Date(startTime.getTime() + 30 * 60000); // assuming 30 min slots
//                     newAppointments.push({ StartTime: startTime, EndTime: endTime });
//                 }
//             });
//         }
//         setAppointments(newAppointments);
//     }, [selectedTimeSlots]);



//     // const handleTimeSlotSelection = (date, time) => {
//     //     setSelectedTimeSlots((prevSlots) => {
//     //         const updatedSlots = prevSlots[date].map((slot) => {
//     //             if (slot.time === time) {
//     //                 // Toggle the is_booked state
//     //                 return { ...slot, is_booked: !slot.is_booked };
//     //             }
//     //             return slot;
//     //         });
    
//     //         return { ...prevSlots, [date]: updatedSlots };
//     //     });
    
//     //     // Update newSelections based on the toggled state
//     //     setNewSelections((prevSelections) => {
//     //         const updatedSelections = { ...prevSelections };
//     //         if (!updatedSelections[date]) {
//     //             updatedSelections[date] = [];
//     //         }
    
//     //         const slotIndex = updatedSelections[date].findIndex((slot) => slot.time === time);
    
//     //         if (slotIndex >= 0) {
//     //             // Remove slot if it exists
//     //             updatedSelections[date].splice(slotIndex, 1);
//     //         } else {
//     //             // Add new slot
//     //             updatedSelections[date].push({ time, is_booked: true });
//     //         }
    
//     //         return updatedSelections;
//     //     });

//     //    // Determine if the slot was originally booked
//     // const wasInitiallyBooked = initialTimeSlots[date]?.some(slot => slot.time === time && slot.is_booked);

//     // setSlotsToDelete((prev) => {
//     //     // If the slot was initially booked and is now being unbooked, add it to slotsToDelete
//     //     if (wasInitiallyBooked) {
//     //         return prev.some(slot => slot.date === date && slot.time === time) ? 
//     //             prev.filter(slot => !(slot.date === date && slot.time === time)) : 
//     //             [...prev, { date, time }];
//     //     }
//     //     return prev;
//     // });
//     // };
    
    

//     // const insertNewTimeSlots = async () => {
//     //     console.log("New Selections Before Insert:", newSelections);
//     //     const objects = Object.entries(newSelections).flatMap(([date, slots]) => 
//     //         slots.map(slot => ({
//     //             doctor_id: "auth0|64ce63ab460998ee9e1793f8",
//     //             is_booked: false,
//     //             start_time: slot.time,
//     //             date
//     //         }))
//     //     );

//     //     if (objects.length > 0) {
//     //         try {
//     //             await client.mutate({
//     //                 mutation: INSERT_TIME_SLOTS,
//     //                 variables: { objects }
//     //             });
//     //             console.log('New time slots added:', objects);
//     //         } catch (error) {
//     //             console.error('Error adding new time slots:', error);
//     //             setError(error.message);
//     //         }
//     //     } else {
//     //         console.log('No new time slots to add');
//     //     }
//     // };

//     // const saveTimeSlots = async () => {
//     //     console.log("Length of slot o delete",slotsToDelete.length)
//     //     if (slotsToDelete.length > 0) {
//     //         await deleteTimeSlots(slotsToDelete);
//     //         setSlotsToDelete([]);
//     //         // Reset or handle the state after deletion
//     //     } else
//     //     {
//     //         try {
//     //             await insertNewTimeSlots();
//     //             setNewSelections({});
//     //             console.log('Time slots updated successfully');
              
//     //         } catch (error) {
//     //             console.error('Error updating time slots:', error);
//     //             setError(error.message);
//     //         }
//     //     }
    

        
//     // };

//     // const deleteTimeSlots = async (slotsToDelete) => {
//     //     for (const slot of slotsToDelete) {
//     //         const condition = {
//     //             doctor_id: {_eq: "auth0|64ce63ab460998ee9e1793f8"},
//     //             date: {_eq: slot.date},
//     //             start_time: {_eq: slot.time}
//     //         };
    
//     //         try {
//     //             await client.mutate({
//     //                 mutation: DELETE_TIME_SLOTS,
//     //                 variables: { conditions: [condition] }
//     //             });
//     //             // Handle successful deletion (e.g., updating UI or state)
//     //         } catch (error) {
//     //             // Handle error (e.g., logging or displaying an error message)
//     //             console.error('Error deleting time slot:', error);
//     //             // Optionally break the loop or continue with the next deletion
//     //         }
//     //     }
    
//     //     // Additional code to handle post-deletion logic (e.g., state updates, UI refresh)
//     // };

// //     const renderSelectableTimeSlots = (date) => {
// //         return selectedTimeSlots[date]?.map(slot => (
// //             <label key={slot.time}>
// //                 <input
// //     type="checkbox"
// //     checked={slot.is_booked}
// //     onChange={() => handleTimeSlotSelection(date, slot.time)}
// //     disabled={slot.isAvailable} // or any other conditions
// // />
// //                 {slot.time}
// //             </label>
// //         ));
// //     };

//     // const handleTabChange = (date) => {
//     //     setActiveTab(date);
//     // };

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>Error: {error}</p>;

//     return (
//         <div>
//             {/* ... existing UI elements from your component */}
            
//             <ScheduleComponent currentView='Week' eventSettings={{ dataSource: appointments }}>
//                 <ViewsDirective>
//                     <ViewDirective option='Day'/>
//                     <ViewDirective option='Week'/>
//                     <ViewDirective option='WorkWeek'/>
//                     <ViewDirective option='Month'/>
//                     <ViewDirective option='Agenda'/>
//                 </ViewsDirective>
//                 <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
//             </ScheduleComponent>
//         </div>
//     );
// };

// export default DoctorAvailabilityForm;







// import React, { useState, useEffect } from 'react';
// import { gql } from '@apollo/client';
// import { useApolloClient } from '../../../apollo-client';

// // GraphQL subscription for doctor's time slots
// const TIME_SLOTS_SUBSCRIPTION = gql`
// subscription MySubscription($currentDate: String!) {
//   time_slots(where: {doctor_id: {_eq: "auth0|64ce63ab460998ee9e1793f8"}, date: {_gte: $currentDate}}) {
//     start_time
//     is_booked
//     date
//   }
// }
// `;

// const INSERT_TIME_SLOTS_MUTATION = gql`
// mutation MyMutation($objects: [time_slots_insert_input!]!) {
//   insert_time_slots(objects: $objects) {
//     affected_rows
//     returning {
//       date
//       doctor_id
//       start_time
//     }
//   }
// }
// `;


// const DoctorAvailabilityForm = () => {


// const [selectedDates, setSelectedDates] = useState({});
// const [timeSlotsData, setTimeSlotsData] = useState(null);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState(null);
// const [activeTab, setActiveTab] = useState('');

// const client = useApolloClient();

// // Get today's date in YYYY-MM-DD format
// const today = new Date().toISOString().split('T')[0];

// // Generate the next three days from the current date
// const nextThreeDays = Array.from({ length: 3 }, (_, index) => {
//   const date = new Date();
//   date.setDate(date.getDate() + index);
//   return date.toISOString().split('T')[0];
// });

// useEffect(() => {
//   setActiveTab(today); // Set the current date as the initial active tab
//   let subscription;
//   if (client) {
//     subscription = client.subscribe({
//       query: TIME_SLOTS_SUBSCRIPTION,
//       variables: { currentDate: today }
//     }).subscribe({
//       next(response) {
//         setTimeSlotsData(response.data.time_slots);
//         setLoading(false);
//       },
//       error(err) {
//         console.error('Error:', err);
//         setError(err);
//         setLoading(false);
//       }
//     });
//   }

//   return () => {
//     subscription?.unsubscribe();
//   };
// }, [client, today]);

//   useEffect(() => {
//     if (timeSlotsData) {
//       let updatedDates = {};
//       timeSlotsData.forEach(({ date, start_time, is_booked }) => {
//         if (!updatedDates[date]) {
//           updatedDates[date] = [];
//         }
//         if (!is_booked) {
//           updatedDates[date].push(start_time);
//         }
//       });
//       setSelectedDates(updatedDates);
//     }
//   }, [timeSlotsData]);

//   const handleTimeSlotChange = (date, timeSlot) => {
//     setSelectedDates(prevDates => {
//       // Ensure the date array exists, if not, initialize it
//       const updatedDates = { ...prevDates };
//       if (!updatedDates[date]) {
//         updatedDates[date] = [];
//       }
  
//       // Check if the timeSlot is already in the array and add or remove it accordingly
//       if (updatedDates[date].includes(timeSlot)) {
//         updatedDates[date] = updatedDates[date].filter(time => time !== timeSlot);
//       } else {
//         updatedDates[date].push(timeSlot);
//       }
//       return updatedDates;
//     });
//   };

//   // Function to render time slot checkboxes
//   const renderTimeSlots = (date) => {
//     const slots = generateTimeSlots();
//     return slots.map(slot => (
//       <label key={slot}>
//         <input
//           type="checkbox"
//           checked={selectedDates[date]?.includes(slot)}
//           onChange={() => handleTimeSlotChange(date, slot)}
//           disabled={timeSlotsData && timeSlotsData.some(ts => ts.date === date && ts.start_time === slot && ts.is_booked)}
//         />
//         {slot}
//       </label>
//     ));
//   };

//   // Generate 24-hour time slots
//   const generateTimeSlots = () => {
//     let slots = [];
//     for (let i = 0; i < 24; i++) {
//       slots.push(`${i}:00`);
//       slots.push(`${i}:30`);
//     }
//     return slots;
//   };

//   const saveTimeSlots = async () => {
//     const timeSlotsToInsert = Object.entries(selectedDates).flatMap(([date, times]) => {
//       return times.map(start_time => ({
//         doctor_id: "auth0|64ce63ab460998ee9e1793f8", // Replace with actual doctor ID
//         date,
//         start_time
//       }));
//     });
  
//     try {
//       const response = await client.mutate({
//         mutation: INSERT_TIME_SLOTS_MUTATION,
//         variables: { objects: timeSlotsToInsert }
//       });
      
//       const affectedRows = response.data.insert_time_slots.affected_rows;
//       if (affectedRows > 0) {
//         // Handle successful insertion
//         console.log('Time slots saved:', affectedRows);
//       }
//     } catch (error) {
//       // Handle insertion error
//       console.error('Error saving time slots:', error);
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error :(</p>;

  
//   return (
//     <div>
//       {/* Tab headers */}
//       <div className="tabs">
//         {nextThreeDays.map(date => (
//           <button
//             key={date}
//             type="button"
//             className={`tab ${activeTab === date ? 'active' : ''}`}
//             onClick={() => setActiveTab(date)}
//           >
//             {date}
//           </button>
//         ))}
//       </div>

//       {/* Tab content */}
//       <div className="tab-content">
//         {nextThreeDays.map(date => (
//           <div
//             key={date}
//             className={`time-slot ${activeTab === date ? 'active' : 'hidden'}`}
//           >
//             {activeTab === date && renderTimeSlots(date)}
//           </div>
//         ))}
//       </div>
//       <button type="button" onClick={saveTimeSlots}>Save Time Slots</button>
//     </div>
//   );
// };

// export default DoctorAvailabilityForm;



import React, { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { useApolloClient } from '../../../apollo-client';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

const TIME_SLOTS_SUBSCRIPTION = gql`
  subscription MySubscription {
    time_slots_grouped(where: {doctor_id: {_eq: "auth0|64ce63ab460998ee9e1793f8"}}) {
      doctor_id
      date
      time_slots
    }
  }
`;


const INSERT_TIME_SLOTS = gql`
  mutation InsertTimeSlots($objects: [time_slots_insert_input!]!) {
    insert_time_slots(objects: $objects) {
      affected_rows
      returning {
        doctor_id
        date
        is_booked
        start_time
      }
    }
  }
`;

const DELETE_TIME_SLOTS = gql`
  mutation MyMutation($conditions: [time_slots_bool_exp!]!) {
    delete_time_slots(where: { _and: $conditions }) {
      affected_rows
      returning {
        date
        doctor_id
        is_booked
        start_time
      }
    }
  }
`;

  

const DoctorSchedule = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scheduleEvents, setScheduleEvents] = useState([]);
  const [scheduleEventsDelete, setScheduleEventsDelete] = useState([]);
  const [lastSelectedSlot, setLastSelectedSlot] = useState(null);
  const client = useApolloClient();

  const [addedAppointments, setAddedAppointments] = useState([]);
  const [deletedAppointments, setDeletedAppointments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    let subscription;
    if (client) {
      subscription = client.subscribe({ query: TIME_SLOTS_SUBSCRIPTION }).subscribe({
        next(response) {
          const events = response.data.time_slots_grouped.reduce((acc, group) => {
            const slots = group.time_slots.map(slot => {
              const dateTimeString = `${group.date} ${slot.startTime}`;
              const start = moment(dateTimeString, 'YYYY-MM-DD hh:mm A').toDate();
              const end = new Date(start.getTime() + 60 * 60 * 1000); // Adds 1 hour

              // Generate a unique identifier
              const uniqueId = `event-${start.getTime()}-${Math.floor(Math.random() * 10000)}`;

          
              return {
                title: slot.isBooked ? 'Booked' : 'Available',
                start: start,
                end: end,
                allDay: false,
                id: uniqueId,
              };
            });
            return [...acc, ...slots];
          }, []);
          setScheduleEvents(events);
          setScheduleEventsDelete(events);
          setLoading(false);
        },
        error(err) {
          console.error('Subscription error:', err);
          setError(err);
          setLoading(false);
        },
      });
    }
    return () => subscription?.unsubscribe();
  }, [client]);


  useEffect(() => {
    console.log('scheduleEvents updated:', scheduleEvents);
  }, [scheduleEvents]);

  

  const handleSelectSlot = ({ start }) => {
    const end = new Date(start.getTime() + 60 * 60 * 1000); // Adds 1 hour to start

    if (lastSelectedSlot && start.getTime() === lastSelectedSlot.start.getTime()) {
      // Slot clicked again, unselect it
      setLastSelectedSlot(null);
      setAddedAppointments(current => current.filter(appointment => appointment.start !== start));
      // Update scheduleEvents as needed to reflect the unselection
      // ...
    } else {
      // New slot selected, proceed with your existing logic
      const isSlotAvailable = scheduleEvents.every(event => {
        return (start < event.start && end <= event.start) || (start >= event.end);
      });
  
      if (isSlotAvailable) {
        createAppointment({ start, end }).then(newEvent => {
          setScheduleEvents(prevEvents => [...prevEvents, newEvent]);
          setScheduleEventsDelete(prevEvents => [...prevEvents, newEvent]);
          setLastSelectedSlot({ start, end }); // Update the last selected slot
          setAddedAppointments(current => [...current, newEvent]); // Add to addedAppointments
        }).catch(error => {
          console.error("Error creating appointment:", error);
        });
      } else {
        alert("This time slot is not available.");
      }
    }
  };

  const createAppointment = async ({ start, end }) => {
    // Replace this with your actual backend call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: 'New TimeSlot',
          start,
          end,
          allDay: false
        });
      }, 1000);
    });

  
  };

  const deleteAppointment = async (eventId) => {
    // Replace this with your actual backend call
    // This is a placeholder function
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(eventId);
      }, 1000);
    });

  };

  const handleSelectEvent = async (event) => {
    console.log('handleSelectEvent called, Event Start Time:', event.start);
    if (event.title === 'Booked') {
     console.log("Cliked on books ")
     navigate('/appointment/details')
    } else {
        try {
            await deleteAppointment(event.id);
            setScheduleEvents(prevEvents => prevEvents.filter(e => e.start !== event.start));
            const eventDateTime = moment(event.start).format('YYYY-MM-DD-HH-mm');
            setDeletedAppointments(current => [...current, eventDateTime]);
            console.log('Added to deletedAppointments:', eventDateTime);
        } catch (error) {
            console.error("Error deleting appointment:", error);
        }
    }
};

  const handleSaveChanges = async () => {
    // Prepare arrays for new and deleted time slots
    const newTimeSlots = [];
    const deletedTimeSlots = [];

    // Process added appointments
    if (addedAppointments.length > 0) {
      addedAppointments.forEach(appointment => {
        // Create a new time slot object for insertion
        const newTimeSlot = {
          date: moment(appointment.start).format('YYYY-MM-DD'),
          doctor_id: 'auth0|64ce63ab460998ee9e1793f8', // Replace with actual doctor ID
          start_time: moment(appointment.start).format('hh:mm A'),
          is_booked: false, // Assuming it's booked when created
        };
        newTimeSlots.push(newTimeSlot);
      });
    }

    console.log('Current scheduleEvents:', scheduleEvents);
    console.log('Deleted Appointments:', deletedAppointments);
    

    // Process deleted appointments
    if (deletedAppointments.length > 0) {

      deletedAppointments.forEach(eventDateTime => {
          console.log('Processing deletion for event DateTime:', eventDateTime);

          const deletedTimeSlot = scheduleEventsDelete.find(event => 
              moment(event.start).format('YYYY-MM-DD-HH-mm') === eventDateTime
          );

          if (deletedTimeSlot) {

            const condition = {
              doctor_id: { _eq: deletedTimeSlot.doctor_id },
              start_time: { _eq: convertTo12HrFormat(moment(deletedTimeSlot.start).format('HH:mm')) },
              date: { _eq: moment(deletedTimeSlot.start).format('YYYY-MM-DD') }
            };
            deletedTimeSlots.push({ _and: [condition] });
          
              // const deletedTimeSlotObj = {
              //     date: moment(deletedTimeSlot.start).format('YYYY-MM-DD'),
              //     doctor_id: 'auth0|64ce63ab460998ee9e1793f8',
              //     start_time: formattedStartTime,
              // };
              // deletedTimeSlots.push(deletedTimeSlotObj);
              console.log('Deleted time slot object:', condition);
          } else {
              console.log('No matching event found for:', eventDateTime);
          }
      });
  
  }


    try {
      // Only perform mutation if there are new time slots to add
      if (newTimeSlots.length > 0) {
        await client.mutate({
          mutation: INSERT_TIME_SLOTS,
          variables: { objects: newTimeSlots },
        });
        setAddedAppointments([]); // Reset the state after successful mutation
      }
  
      // Only perform mutation if there are time slots to delete
      if (deletedTimeSlots.length > 0) {
        await client.mutate({
          mutation: DELETE_TIME_SLOTS,
          variables: { conditions: deletedTimeSlots },
        });
        setDeletedAppointments([]); // Reset the state after successful mutation
      }
    } catch (error) {
      console.error("Error adding/deleting appointments:", error);
      // Handle error appropriately
    }
  };

  const convertTo12HrFormat = (time24hr) => {
    const timePart = time24hr.split(' ')[0];
    const momentTime = moment(timePart, 'HH:mm');
    return momentTime.format('hh:mm A');
  };
  


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Calendar
  localizer={localizer}
  events={scheduleEvents}
  startAccessor="start"
  endAccessor="end"
  style={{ height: 500 }}
  date={new Date()} // Set to current date
  selectable={true}
  onSelectSlot={handleSelectSlot}
  onSelectEvent={handleSelectEvent} // Add this line
/>
<button onClick={handleSaveChanges}>Save Changes</button>
    </div>
  );
};

export default DoctorSchedule;





  