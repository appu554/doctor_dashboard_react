// Inside BookedSlotDetails.js
import { useEffect, useState } from "react";
import React from 'react';
import {
    CallControls,
    StreamCall,
    StreamTheme,
    StreamVideo,
    SpeakerLayout,
    StreamVideoClient
  } from "@stream-io/video-react-sdk";
  import "@stream-io/video-react-sdk/dist/css/styles.css";



  const callId = "demo-call-123-nurse"
  const user_id = "csb-user";
  const user = { id: user_id };
  
  const apiKey = "hd8szvscpxvd";
  const tokenProvider = async () => {
    const { token } = await fetch(
      "https://stream-calls-dogfood.vercel.app/api/auth/create-token?" +
        new URLSearchParams({
          api_key: apiKey,
          user_id: user_id
        })
    ).then((res) => res.json());
    return String(token);
  };
  

   

const BookedSlotDetails = () => {
    const [client, setClient] = useState();
    const [call, setCall] = useState();
    const [isStreamActive, setIsStreamActive] = useState(false);
  
    useEffect(() => {
      const myClient = new StreamVideoClient({ apiKey, user, tokenProvider });
      setClient(myClient);
      return () => {
        myClient.disconnectUser();
        setClient(undefined);
      };
    }, []);
  
    useEffect(() => {
      if (!client) return;
      const myCall = client.call("default", callId);
      myCall.join({ create: true }).catch((err) => {
        console.error(`Failed to join the call`, err);
      });
  
      setCall(myCall);
  
      return () => {
        setCall(undefined);
        myCall.leave().catch((err) => {
          console.error(`Failed to leave the call`, err);
        });
      };
    }, [client]);
  
    if (!client || !call) return null;
  // Logic to display booked slot details
  return (
  <div className="bg-slate-100 pl-12 pr-7 max-md:px-5">
  <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
    <div className="flex flex-col items-stretch w-[43%] max-md:w-full max-md:ml-0">
      <div className="bg-white flex flex-col items-stretch w-full mt-8 mx-auto pt-10 pb-12 px-10 rounded-3xl max-md:max-w-full max-md:mt-10 max-md:px-5">
        <div className="flex w-full items-stretch justify-between gap-5 max-md:max-w-full max-md:flex-wrap">
          <div className="flex items-stretch justify-between gap-5">
            <img
              loading="lazy"
              srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/2d251b5e-e6e9-465c-b199-002a7fef4c1e?"
                  alt="Reschedule appointment icon" 
              className="aspect-square object-contain object-center w-[87px] overflow-hidden shrink-0 max-w-full"
            />
            <div className="self-center flex grow basis-[0%] flex-col items-stretch my-auto">
              <div className="text-slate-800 text-lg font-extrabold leading-8 whitespace-nowrap">
                Dianne Russell
              </div>
              <div className="text-slate-500 text-base font-medium leading-8 whitespace-nowrap mt-1">
                9008864369 | Bangalore
              </div>
            </div>
          </div>
          <div className="text-slate-600 text-opacity-70 text-xs font-medium leading-6 whitespace-nowrap bg-green-100 self-center my-auto px-5 py-2.5 rounded max-md:pl-0.5">
            New patient
          </div>
        </div>
        <div className="flex items-stretch justify-between gap-5 mt-16 pr-4 max-md:max-w-full max-md:flex-wrap max-md:justify-center max-md:mt-10">
          <div className="flex grow basis-[0%] flex-col items-stretch self-start">
            <div className="text-zinc-400 text-xs font-medium leading-4 whitespace-nowrap">
              Gender
            </div>
            <div className="text-slate-600 text-base font-semibold leading-6 whitespace-nowrap mt-1.5">
              Male
            </div>
          </div>
          <div className="flex grow basis-[0%] flex-col items-stretch">
            <div className="text-zinc-400 text-xs font-medium leading-4 whitespace-nowrap">
              Date of Birth
            </div>
            <div className="text-slate-600 text-base font-semibold leading-6 whitespace-nowrap">
              12/12/1994
            </div>
          </div>
          <div className="flex basis-[0%] flex-col items-stretch self-start">
            <div className="text-zinc-400 text-xs font-medium leading-4 whitespace-nowrap">
              Age
            </div>
            <div className="text-slate-600 text-base font-semibold leading-6 whitespace-nowrap">
              28
            </div>
          </div>
          <div className="flex grow basis-[0%] flex-col items-stretch self-start">
            <div className="text-zinc-400 text-xs font-medium leading-4 whitespace-nowrap">
              Height
            </div>
            <div className="text-slate-600 text-base font-semibold leading-6 whitespace-nowrap">
              5.10 ‘
            </div>
          </div>
          <div className="flex grow basis-[0%] flex-col items-stretch">
            <div className="text-zinc-400 text-xs font-medium leading-4 whitespace-nowrap">
              Weight
            </div>
            <div className="text-slate-600 text-base font-semibold leading-6 whitespace-nowrap">
              78 kg
            </div>
          </div>
        </div>
        <div className="flex items-stretch justify-between gap-5 mt-20 pr-11 max-md:max-w-full max-md:flex-wrap max-md:mt-10 max-md:pr-5">
          <div className="flex grow basis-[0%] flex-col items-stretch">
            <div className="text-zinc-400 text-base font-semibold leading-8 whitespace-nowrap">
              Diagnosis | Problem{" "}
            </div>
            <div className="text-slate-600 text-base font-medium leading-6 whitespace-nowrap mt-2.5">
              Appendico Vesicotomy, Diabetic Neuropathy
            </div>
          </div>
          <div className="flex basis-[0%] flex-col items-stretch self-start">
            <div className="text-zinc-400 text-base font-semibold leading-8 whitespace-nowrap">
              Special Needs
            </div>
            <div className="text-slate-600 text-base font-medium leading-6 whitespace-nowrap mt-3">
              None
            </div>
          </div>
        </div>
        <div className="text-zinc-400 text-base font-semibold leading-8 whitespace-nowrap mt-8 max-md:max-w-full">
          Allergies
        </div>
        <div className="border flex w-full justify-between gap-5 mt-4 pl-6 pr-20 py-5 rounded-md border-solid border-gray-200 max-md:max-w-full max-md:flex-wrap max-md:px-5">
          <div className="flex gap-2.5">
            <div className="stroke-[2px] flex w-2.5 shrink-0 h-2.5 flex-col rounded-[50%]" />
            <div className="text-slate-500 text-base font-medium leading-8 self-stretch grow whitespace-nowrap">
              <span className="font-semibold">Sulphur</span>
              <span className="font-medium"> </span>
              <span className="font-light">(High)</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="stroke-[2px] flex w-2.5 shrink-0 h-2.5 flex-col my-auto rounded-[50%]" />
            <div className="text-slate-500 text-base font-medium leading-8 self-stretch grow whitespace-nowrap">
              <span className="font-semibold">Bee Sting</span>
              <span className="font-medium"> </span>
              <span className="font-light">(Medium)</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-200 flex items-start justify-between gap-5 mt-11 py-0.5 rounded-lg max-md:max-w-full max-md:flex-wrap max-md:justify-center max-md:mt-10">
          <div className="text-indigo-500 text-sm font-semibold leading-6 whitespace-nowrap shadow-sm bg-white self-stretch grow items-center pl-5 pr-32 py-5 rounded-lg">
            Past Visits
          </div>
          <div className="text-slate-600 text-sm font-medium leading-6 self-center my-auto">
            Current Visit{" "}
          </div>
          <img
            loading="lazy"
            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/2d251b5e-e6e9-465c-b199-002a7fef4c1e?"
            alt="Reschedule appointment icon" 
            className="aspect-[0.07] object-contain object-center w-0.5 stroke-[1.5px] stroke-slate-600 stroke-opacity-30 overflow-hidden self-center shrink-0 max-w-full my-auto"
          />
          <div className="text-slate-600 text-sm font-medium leading-6 self-center whitespace-nowrap my-auto">
            Write Prescription
          </div>
        </div>
        <div className="text-zinc-400 text-base font-semibold leading-8 whitespace-nowrap mt-7 max-md:max-w-full">
          Latest Diagnoses
        </div>
        <div className="text-slate-600 text-base font-medium leading-6 whitespace-nowrap mt-3 max-md:max-w-full">
          None
        </div>
        <div className="text-zinc-400 text-base font-semibold leading-8 whitespace-nowrap mt-10 max-md:max-w-full">
          Report
        </div>
        <div className="text-slate-600 text-base font-medium leading-6 whitespace-nowrap mt-3 mb-7 max-md:max-w-full">
          None
        </div>
      </div>
    </div>
    <div className="bg-white flex flex-col items-center pt-10 pb-12 px-5 rounded-3xl max-md:max-w-full">
      <div className="flex w-[814px] max-w-full flex-col mb-12 max-md:mb-10">
        {isStreamActive ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <StreamTheme>
                <SpeakerLayout />
                <CallControls />
              </StreamTheme>
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex w-[255px] max-w-full flex-col mx-auto">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2d251b5e-e6e9-465c-b199-002a7fef4c1e?"
              alt="Reschedule appointment icon" 
              className="aspect-[1.02] object-contain object-center w-[89px] overflow-hidden max-w-full ml-14 mt-20 self-start max-md:ml-2.5 max-md:mt-10"
            />
            <div className="text-slate-800 text-lg font-extrabold leading-8 whitespace-nowrap ml-9 mt-8 self-start max-md:ml-2.5">
              Dianne Russell
            </div>
            <div className="text-slate-500 text-base font-medium leading-8 self-stretch whitespace-nowrap mt-1 max-md:max-w-full">
              9008864369 | Bangalore
            </div>
          </div>
        )}
        <div className="border bg-lime-50 self-stretch flex items-center justify-between gap-5 mt-48 pl-7 pr-20 rounded-2xl border-solid border-lime-300 max-md:max-w-full max-md:flex-wrap max-md:mt-10 max-md:px-5">
          <div className="text-slate-600 text-base font-semibold leading-6 my-auto">
            <span className="font-medium">25 November |</span>
            <span className="font-extrabold"> 20 Min left</span>
          </div>
          <button
            onClick={() => setIsStreamActive(!isStreamActive)}
            className="items-stretch relative appearance-none bg-[black] text-[white] rounded text-center cursor-pointer ml-5 px-6 py-4"
          >
            {isStreamActive ? "Stop Stream" : "Start Stream"}
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default BookedSlotDetails;

