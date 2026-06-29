import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ZoomMeeting from "./ZoomMeeting";

async function fetchBlog(meetingId) {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/api/v1/meeting/${meetingId}`
    );
    const response = res.data;
    return response;
  } catch (err) {
    console.log(err);
  }
}

const Livemeeting = () => {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    const getBlog = async () => {
      const data = await fetchBlog(id);
      setTournament(data);
    };

    getBlog();
  }, [id]);
 console.log(tournament)
  if (!tournament) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <ZoomMeeting
        meetTitle={tournament?.title}
        meetZoomId={tournament?.zoom_meeting_id}
        meetZoomPass={tournament?.zoom_meeting_password}
        meetId={tournament?._id}
        meetStatus={tournament?.status}
        meetUsername={tournament?.storeId?.storeName}

      />
    </>
  );
};

export default Livemeeting;
