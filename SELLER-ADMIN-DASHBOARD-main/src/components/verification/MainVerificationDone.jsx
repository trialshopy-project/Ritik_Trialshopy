import { NavLink, useNavigate } from "react-router-dom";

const MainVerificationDone = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-4 sm:w-full h-full py-10">
      <div className="flex flex-col items-center">
        <h1 className="max-w-lg p-4 text-2xl font-medium text-center text-black lg:block">
          THANK YOU FOR SUBMITTING YOUR PROFILE
        </h1>
        <h2 className="max-w-lg p-4 text-lg font-normal text-center text-black lg:block">
          We will review your Store details &amp; revert back to you in 2-3 days
        </h2>

        <NavLink to="/become-seller/verification-status">
          <button className="flex justify-center items-center rounded-lg px-4 py-2 gap-2 bg-gradient-to-b from-[#EB8105] to-[#FAAC06]">
            <span className="text-base font-normal text-black">
              CHECK MY STATUS
            </span>
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default MainVerificationDone;
