// import React, { useState } from "react";
// import { FaUserCircle } from "react-icons/fa";
// import { MdCircleNotifications } from "react-icons/md";
// import { NavLink } from "react-router-dom";
// import { links } from "./Notificationdata";

// const Topbar2 = () => {
//   const [show, setShow] = useState(false);
//   return (
//     <>
//       <div className="bg-customDark p-4 fixed sm:gap-x-2 w-full top-0 left-0 right-0 z-10">
//         <div className="ml-64  flex flex-row items-center justify-between  ">
//           <div className=" flex flex-row  justify-between items-center  ">
//             <div class="flex items-stretch   "></div>
//           </div>

//           <div className="flex gap-1 items-center">
//             <div className="text-white cursor-pointer">
//               <MdCircleNotifications onClick={() => setShow(!show)} size={25} />{" "}
//             </div>
//             {/* notification section starts here */}
//             <div
//               className={`
//       bg-white rounded-md fixed shadow-lg w-[25%] right-[40px]    z-10    
//         duration-700 ${show ? "top-[65px]" : "top-[-100%]"}
//         `}
//             >
//               <div className="flex font-semibold justify-between mb-3 px-2">
//                 <span>Notifications</span>
//                 <span className="text-customPurple cursor-pointer">
//                   Mark all as Read
//                 </span>
//               </div>
//               <div className="scrollbar-thin text-sm scrollbar-track-white scrollbar-thumb-white max-h-[200px] ">
//                 {links.map((link) => (
//                   <div
//                     className="flex justify-between items-center px-3  "
//                     key={link.id}
//                   >
//                     <div className="flex gap-2 items-center">
//                       <img
//                         src={link.image}
//                         alt=""
//                         className="w-8 h-8 rounded-full"
//                       />
//                       <div>
//                         <h2>{link.heading}</h2>
//                         <p>{link.content}</p>
//                       </div>
//                     </div>
//                     <div className="">
//                       <h3>{link.time}</h3>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className={`text-white cursor-pointer`}>
//               <NavLink to="/dashboard/myaccount">
//                 <FaUserCircle size={22} />
//               </NavLink>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Topbar2;
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { MdCircleNotifications } from "react-icons/md";
import { NavLink } from "react-router-dom";
// Remove or correct import if links is not exported from Notificationdata

const Topbar2 = () => {
  const [show, setShow] = useState(false);

  // Mock data for notifications (replace with actual data if needed)
  const notifications = [
    {
      id: 1,
      image: "/path/to/image.jpg",
      heading: "New Order",
      content: "You have a new order.",
      time: "2 mins ago",
    },
    // Add more notification objects as needed
  ];

  return (
    <>
      <div className="bg-customDark p-4 fixed sm:gap-x-2 w-full top-0 left-0 right-0 z-10">
        <div className="ml-64 flex flex-row items-center justify-between">
          <div className="flex flex-row justify-between items-center">
            {/* Add any additional elements here if needed */}
          </div>

          <div className="flex gap-1 items-center">
            <div className="text-white cursor-pointer">
              <MdCircleNotifications onClick={() => setShow(!show)} size={25} />
            </div>
            {/* Notification section starts here */}
            <div
              className={`bg-white rounded-md fixed shadow-lg w-[25%] right-[40px] z-10 duration-700 ${
                show ? "top-[65px]" : "top-[-100%]"
              }`}
            >
              <div className="flex font-semibold justify-between mb-3 px-2">
                <span>Notifications</span>
                <span className="text-customPurple cursor-pointer">
                  Mark all as Read
                </span>
              </div>
              <div className="scrollbar-thin text-sm scrollbar-track-white scrollbar-thumb-white max-h-[200px]">
                {notifications.map((notification) => (
                  <div
                    className="flex justify-between items-center px-3"
                    key={notification.id}
                  >
                    <div className="flex gap-2 items-center">
                      <img
                        src={notification.image}
                        alt=""
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <h2>{notification.heading}</h2>
                        <p>{notification.content}</p>
                      </div>
                    </div>
                    <div>
                      <h3>{notification.time}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-white cursor-pointer">
              <NavLink to="/dashboard/myaccount">
                <FaUserCircle size={22} />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar2;
