import React, { useEffect, useRef, useState } from "react";
import { ZoomMtg } from "@zoom/meetingsdk";

// Pre-load Zoom SDK assets at module level so they're ready
ZoomMtg.setZoomJSLib("https://source.zoom.us/3.11.2/lib", "/av");
ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

const ZoomMeeting = ({
  meetId,
  meetTitle,
  meetZoomId,
  meetZoomPass,
  meetUsername,
  meetStatus,
}) => {
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);

  // Inject Zoom CSS on mount
  useEffect(() => {
    const addLink = (href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = href;
        document.head.appendChild(link);
      }
    };
    addLink("https://source.zoom.us/3.5.1/css/bootstrap.css");
    addLink("https://source.zoom.us/3.5.1/css/react-select.css");

    // Make zmmtg-root visible when Zoom takes over
    const root = document.getElementById("zmmtg-root");
    if (root) {
      root.style.display = "none";
    }
  }, []);

  const joinMeeting = () => {
    setJoining(true);
    setError(null);

    const apiKey = import.meta.env.VITE_ZOOM_SDK_KEY;
    const apiSecret = import.meta.env.VITE_ZOOM_SDK_SECRET;

    const meetConfig = {
      meetingNumber: String(meetZoomId),
      userName: meetUsername || "Seller",
      passWord: meetZoomPass || "",
      leaveUrl: window.location.href,
      role: 1, // 1 = host, 0 = attendee
    };

    ZoomMtg.generateSDKSignature({
      sdkKey: apiKey,
      sdkSecret: apiSecret,
      meetingNumber: meetConfig.meetingNumber,
      role: meetConfig.role,
      success: function (res) {
        const signature = res.result;
        console.log("Zoom signature generated successfully");

        // Show the Zoom root div before init
        const root = document.getElementById("zmmtg-root");
        if (root) root.style.display = "block";

        ZoomMtg.init({
          leaveUrl: meetConfig.leaveUrl,
          isSupportAV: true,
          disableInvite: true,
          success: () => {
            ZoomMtg.join({
              meetingNumber: meetConfig.meetingNumber,
              userName: meetConfig.userName,
              signature: signature,
              sdkKey: apiKey,
              passWord: meetConfig.passWord,
              success: () => {
                console.log("Joined Zoom meeting successfully");
                setJoining(false);
              },
              error: (err) => {
                console.error("Error joining meeting:", err);
                setError("Meeting join karne mein error aaya: " + (err?.errorCode || JSON.stringify(err)));
                setJoining(false);
              },
            });
          },
          error: (err) => {
            console.error("Error initializing Zoom SDK:", err);
            setError("Zoom SDK initialize nahi hua. Browser permissions check karein.");
            setJoining(false);
          },
        });
      },
      error: function (err) {
        console.error("Signature generation failed:", err);
        setError("Signature generate karne mein error aaya.");
        setJoining(false);
      },
    });
  };

  return (
    <>
      {/* Header bar */}
      <div className="fixed mb-5 w-full cursor-pointer hover:text-white text-[#999] bg-[#222] border-b border-[#080808] top-0 min-h-14 z-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <p>Title: {meetTitle}</p>
              <span>|</span>
              <p>Host: {meetUsername}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Meeting join area */}
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900">
        {error && (
          <div className="mb-4 px-6 py-3 bg-red-900 text-red-200 rounded-lg text-center max-w-md">
            {error}
          </div>
        )}

        {meetStatus === "scheduled" || meetStatus === "live" ? (
          <button
            className="bg-blue-600 hover:bg-blue-700 transition-colors w-fit mx-auto rounded-lg my-6 shadow-xl text-2xl px-8 py-4 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={joinMeeting}
            disabled={joining}
          >
            {joining ? "Joining..." : "I'm Ready to Join Meeting"}
          </button>
        ) : (
          <div className="bg-gray-800 w-fit mx-auto rounded-lg my-6 shadow-lg text-2xl px-6 py-3 text-white">
            Meet has been <span className="font-bold capitalize">{meetStatus}</span>
          </div>
        )}

        <p className="text-gray-500 text-sm mt-2">
          Meeting ID: {meetZoomId}
        </p>
      </div>
    </>
  );
};

export default ZoomMeeting;
