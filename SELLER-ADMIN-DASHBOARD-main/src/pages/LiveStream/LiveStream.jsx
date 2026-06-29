import React, { useContext, useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import { UserContext } from "../../components/context/UserContext";

const SellerLiveStream = () => {
  const [authenticated] = useContext(UserContext);
  const [search] = useSearchParams();
  const roomID = search.get("roomID");
  const containerRef = useRef(null);
  const recorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const socket = useRef(null);
  const [sellerId, setSellerId] = useState("653ce437b3b44b12a4776cde");

  const startRecording = (stream) => {
    console.log("Attempting to start recording...");
    if (stream && stream.getTracks().length > 0) {
      console.log("Stream is valid, initializing MediaRecorder...");
      console.log("Stream tracks:", stream.getTracks());

      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp8,opus", // Use a more common format
      });

      recorderRef.current = recorder;

      const buffer = [];
      recorder.ondataavailable = (event) => {
        console.log("Data available from recorder:", event.data);
        if (event.data && event.data.size > 0) {
          buffer.push(event.data);
        } else {
          console.warn("Received empty data chunk.");
        }
      };

      recorder.onstop = () => {
        console.log("Recorder stopped, saving recording...");
        saveRecording(buffer);
      };

      try {
        recorder.start(1000); // Collect data in 1-second intervals
        setIsRecording(true);
        console.log("Recording started");
      } catch (error) {
        console.error("Error starting MediaRecorder:", error);
      }
    } else {
      console.error("Invalid stream or no tracks available.");
    }
  };

  const saveRecording = (buffer) => {
    console.log("Saving recording, buffer length:", buffer.length);

    if (buffer.length > 0) {
      const blob = new Blob(buffer, { type: "video/webm" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "recording.webm";
      a.click();
      console.log("Recording saved and download initiated");
    } else {
      console.error("No data available for recording.");
    }
  };

  const stopRecording = () => {
    console.log("Stopping recording...");

    try {
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
        setIsRecording(false);
        console.log("Recording stopped");
      } else {
        console.log("Recorder is not in 'recording' state.");
      }
    } catch (error) {
      console.error("Error stopping MediaRecorder:", error);
    }
  };

  const randomID = (len) => {
    const chars =
      "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP";
    let result = "";
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  useEffect(() => {
    if (!roomID) return;
    console.log("Connecting to socket.current...");
    socket.current = io(import.meta.env.VITE_API_ENDPOINT);

    const startMeeting = async () => {
      const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
      const serverSecret = import.meta.env.VITE_ZEGO_SECRET;

      console.log("Generating kit token...");
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        authenticated.user._id ? authenticated.user?._id : randomID(5), //userId
        authenticated.user.firstName
          ? authenticated.user?.firstName
          : randomID(5) //userName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);

      console.log("Joining room...");
      zp.joinRoom({
        container: containerRef.current,
        showRoomTimer: true,
        branding: {
          logoURL: "/images/tr_logo_white.png",
        },
        // showPreJoinView: false,
        showLeaveRoomConfirmDialog: true,
        onLeaveRoom: () => {
          console.log(`Room Live end ${roomID} left`);
          socket.current.emit("endLiveStream", { roomId: roomID });
          socket.current.disconnect();
        },
        onLiveStart: () => {
          console.log("Live stream started");
          socket.current.emit("startLiveStream", { sellerId, roomId: roomID });
          const stream = zp.localStream;
          console.log(stream, "stream");
          try {
            if (stream) {
              startRecording(stream);
            } else {
              console.error("Unable to access local stream.");
            }
          } catch (error) {
            console.error("Error starting recording:", error);
          }
        },
        onLiveEnd: () => {
          console.log("Live stream ended");
          socket.current.emit("endLiveStream", { roomId: roomID });
          stopRecording();
        },
        onLocalStreamAdded: (stream) => {
          console.log("Local stream added");
          startRecording(stream);
        },
        scenario: {
          mode: ZegoUIKitPrebuilt.LiveStreaming,
          config: {
            role: ZegoUIKitPrebuilt.Host,
          },
        },
      });
    };

    startMeeting();

    return () => {
      console.log("Cleaning up...");
      socket.current.emit("endLiveStream", { roomId: roomID });
      socket.current.disconnect();
      stopRecording();
    };
  }, [roomID]);

  return (
    <div ref={containerRef} className="w-auto h-screen myCallContainer"></div>
  );
};

export default SellerLiveStream;
