import React, { useContext, useEffect, useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";

//? document verification api
const MainVerification = ({ initialValues = {} }) => {
  const [authenticated] = useContext(UserContext);
  const sellerId = authenticated.user.storeId;
  const status = authenticated?.user?.storeStatus;
  const [saveAadhar, setSaveAadhar] = useState(false);
  const [savePan, setSavePan] = useState(false);
  const [saveGstin, setSaveGstin] = useState(false);
  const [saveAccount, setSaveAccount] = useState(false);
  const [deletefile, setDeletefile] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (authenticated?.storeStatus == "Submitted") {
      toast.success("Store Under Verification Process");
      navigate("/become-seller/verificationdone");
    }
  }, []);
  const [aadharNumber, setAadharNumber] = useState(
    initialValues.aadharNumber || ""
  );
  const [panNumber, setPanNumber] = useState(initialValues.panNumber || "");
  const [GstinNumber, setGstinNumber] = useState(
    initialValues.GstinNumber || ""
  );
  const [fullName, setFullName] = useState(initialValues.fullName || "");
  const [accountNumber, setAccountNumber] = useState(
    initialValues.accountNumber || ""
  );
  const [reaccountNumber, setReaccountNumber] = useState(
    initialValues.reaccountNumber || ""
  );
  const [ifscNumber, setIfscNumber] = useState(initialValues.ifscNumber || "");

  const [aadharUpload, setAadharUpload] = useState("");
  const [panUpload, setPanUpload] = useState("");
  const [GstinUpload, setGstinUpload] = useState("");
  const [accountUpload, setAccountUpload] = useState("");
  const [forward, setforward] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !aadharNumber ||
      !panNumber ||
      !GstinNumber ||
      !fullName ||
      !accountNumber ||
      !ifscNumber ||
      !aadharUpload ||
      !panUpload ||
      !GstinUpload ||
      !accountUpload
    ) {
      toast.error("All fields are required.");
      return;
    }
    if (accountNumber !== reaccountNumber) {
      toast.error("Account number and re-account number do not match.");
      return;
    }
    const formData = new FormData();
    formData.append("aadharNumber", aadharNumber);
    formData.append("panNumber", panNumber);
    formData.append("GstinNumber", GstinNumber);
    formData.append("fullName", fullName);
    formData.append("accountNumber", accountNumber);
    formData.append("ifscNumber", ifscNumber);
    formData.append("aadharUpload", aadharUpload);
    formData.append("panUpload", panUpload);
    formData.append("GstinUpload", GstinUpload);
    formData.append("accountUpload", accountUpload);
    axios
      .post(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/saveFormData/${sellerId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      )
      .then((response) => {
        navigate("/become-seller/verificationdone");

        console.log("Form data saved successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error saving form data:", error);
      });
  };
  // useEffect(() => {
  // 	console.log(sellerId.sellerId);
  // }
  // , []);

  return (
    <>
      <div className="flex flex-col items-center p-0 gap-30  mx-auto my-5">
        <div className=" w-full  my-10 flex flex-row justify-center items-center gap-0  ">
          <div className="flex flex-col items-center p-0 gap-4 h-[90px]">
            <div className="flex flex-col justify-center items-center p-10 gap-10 w-[50px] h-[50px] rounded-full bg-customPurple shadow-lg text-white font-bold ">
              1
            </div>
            <span className="w-[99px] sm:h-[30px] sm:font-poppins font-normal sm:text-base leading-6 sm:font-semibold text-center text-gray-800">
              Seller Info
            </span>
          </div>
          <div className="hidden sm:inline mt-[-10px] sm:mt-0 w-20  border border-gray-300"></div>
          <div className="flex flex-col items-center p-0 gap-4 h-[90px]">
            <div className="flex flex-col justify-center items-center p-10 gap-10 w-[50px] h-[50px] rounded-full bg-customPurple shadow-lg text-white font-bold ">
              2
            </div>
            <span className="w-[99px] sm:h-[30px] sm:font-poppins font-normal sm:text-base leading-6 sm:font-semibold text-center text-gray-800">
              Store Info
            </span>
          </div>
          <div className="hidden sm:inline mt-[-10px] sm:mt-0 w-20  border border-gray-300"></div>
          <div className="flex flex-col items-center p-0 gap-4 h-[90px]">
            <div className="flex flex-col justify-center items-center p-10 gap-10 w-[50px] h-[50px] rounded-full bg-customPurple shadow-lg text-white font-bold ">
              3
            </div>
            <span className="w-[99px] sm:h-[30px] sm:font-poppins font-normal sm:text-base leading-6 sm:font-semibold text-center text-gray-800">
              Verification
            </span>
          </div>
        </div>
        {/* AADHAR Upload */}
        <div className="flex flex-col items-center justify-center gap-10 w-full mx-auto my-10 overflow-hidden ">
          <form
            onSubmit={handleSubmit}
            className="w-full sm:w-[80%] md:w-[70%] lg:w-[60%] p-4"
          >
            <label className="flex flex-col items-start gap-2">
              <span>Enter Aadhar or VID</span>
              <input
                className="w-[360px] lg:w-[800px] p-2 bg-white border-b border-gray-500 text-gray-700 outline-none"
                type="text"
                placeholder="567431112234"
                value={aadharNumber}
                onChange={(e) => setAadharNumber(e.target.value)}
              />
            </label>
            <br />
            <div className="p-2 flex flex-col justify-center items-start gap-2 w-full ">
              <span>*Upload your AADHAR as a single file</span>
              <div className="flex items-center">
                <label
                  htmlFor="adhaar-upload"
                  className="flex items-center px-4 py-2 rounded bg-gradient-to-b from-primary to-secondary"
                  onClick={() => {
                    setSaveAadhar(false);
                  }}
                >
                  <MdOutlineFileUpload color="white" size={25} />
                  Upload
                  <input
                    id="adhaar-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg"
                    onChange={(e) => {
                      setAadharUpload(e.target.files[0]);
                      console.log(e.target.files[0].name);
                    }}
                  />
                </label>
                {!saveAadhar ? (
                  <span className="text-gray-400 text-sm mx-1">
                    Max File Size 20MB
                  </span>
                ) : (
                  <div className=" ml-2 text-sm mx-1 flex gap-5">
                    <div>{aadharUpload.name}</div>
                    <div>
                      <RxCross1
                        size={20}
                        onClick={() => {
                          // setDeletefile(true)

                          setSaveAadhar(false);
                          setAadharUpload("");
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              {aadharUpload && (
                <div className={saveAadhar ? "hidden" : "block w-full"}>
                  <div className=" w-full mt-1 flex flex-col gap-5">
                    <div>
                      <p className=" underline">Clear files</p>
                    </div>
                    <div className=" border-2 flex justify-between border-black p-2 w-full">
                      <div>{aadharUpload.name}</div>
                      <div>
                        <RxCross1
                          size={20}
                          onClick={() => {
                            // setSaveAadhar(false)
                            setAadharUpload("");
                          }}
                        />
                      </div>
                    </div>
                    <div className=" w-full flex justify-end">
                      <button
                        type="button"
                        className=" bg-[#EB8105] py-1 px-3"
                        onClick={() => {
                          setSaveAadhar(true);
                        }}
                      >
                        Save and continue
                      </button>
                    </div>
                    {/* <DeleteModel filename={aadharUpload.name} deleteFile={deletefile} setDeletefile={setDeletefile} /> */}
                  </div>
                </div>
              )}
            </div>
            <br />
            <label className="flex flex-col items-start gap-2">
              <span>Enter PAN</span>
              <input
                className="w-[360px] lg:w-[800px] p-2 bg-white border-b border-gray-500 text-gray-700 outline-none"
                type="text"
                placeholder="RIKD2844N"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value)}
              />
            </label>
            <br />
            <div className="p-2 flex flex-col justify-center items-start gap-2 w-full ">
              <span>*Upload your PAN as a single file</span>
              <div className="flex items-center">
                <label
                  htmlFor="pan-upload"
                  className="flex items-center px-4 py-2 rounded bg-gradient-to-b from-primary to-secondary"
                  onClick={() => {
                    setSavePan(false);
                  }}
                >
                  <MdOutlineFileUpload color="white" size={25} />
                  Upload
                  <input
                    id="pan-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => {
                      setPanUpload(e.target.files[0]);
                    }}
                  />
                </label>
                {!savePan ? (
                  <span className="text-gray-400 text-sm mx-1">
                    Max File Size 20MB
                  </span>
                ) : (
                  <div className=" ml-2 text-sm mx-1 flex gap-5">
                    <div>{panUpload.name}</div>
                    <div>
                      <RxCross1
                        size={20}
                        onClick={() => {
                          // setDeletefile(true)

                          setSavePan(false);
                          setPanUpload("");
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              {panUpload && (
                <div className={savePan ? "hidden" : "block w-full"}>
                  <div className=" w-full mt-1 flex flex-col gap-5">
                    <div>
                      <p className=" underline">Clear files</p>
                    </div>
                    <div className=" border-2 flex justify-between border-black p-2 w-full">
                      <div>{panUpload.name}</div>
                      <div>
                        <RxCross1
                          size={20}
                          onClick={() => {
                            // setDeletefile(true)
                            setPanUpload("");
                          }}
                        />
                      </div>
                    </div>
                    <div className=" w-full flex justify-end">
                      <button
                        type="button"
                        className=" bg-[#EB8105] py-1 px-3"
                        onClick={() => {
                          setSavePan(true);
                        }}
                      >
                        Save and continue
                      </button>
                    </div>
                    {/* <DeleteModel filename={panUpload.name} deleteFile={deletefile} setDeletefile={setDeletefile} /> */}
                  </div>
                </div>
              )}
            </div>
            <br />
            <label className="flex flex-col items-start gap-2">
              <span>Enter GSTIN</span>
              <input
                className="w-[360px] lg:w-[800px] p-2 bg-white border-b border-gray-500 text-gray-700 outline-none"
                type="text"
                placeholder="6169551651496AG56196"
                value={GstinNumber}
                onChange={(e) => setGstinNumber(e.target.value)}
              />
            </label>
            <br />
            <div className="p-2 flex flex-col justify-center items-start gap-2 w-full ">
              <span>*Upload your GSTIN as a single file</span>
              <div className="flex items-center">
                <label
                  htmlFor="gst-upload"
                  className="flex items-center px-4 py-2 rounded bg-gradient-to-b from-primary to-secondary"
                  onClick={() => {
                    setSaveGstin(false);
                  }}
                >
                  <MdOutlineFileUpload color="white" size={25} />
                  Upload
                  <input
                    id="gst-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => {
                      setGstinUpload(e.target.files[0]);
                    }}
                  />
                </label>
                {!saveGstin ? (
                  <span className="text-gray-400 text-sm mx-1">
                    Max File Size 20MB
                  </span>
                ) : (
                  <div className=" ml-2 text-sm mx-1 flex gap-5">
                    <div>{GstinUpload.name}</div>
                    <div>
                      <RxCross1
                        size={20}
                        onClick={() => {
                          // setDeletefile(true)

                          setSaveGstin(false);
                          setGstinUpload("");
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              {GstinUpload && (
                <div className={saveGstin ? "hidden" : "block w-full"}>
                  <div className=" w-full mt-1 flex flex-col gap-5">
                    <div>
                      <p className=" underline">Clear files</p>
                    </div>
                    <div className=" border-2 flex justify-between border-black p-2 w-full">
                      <div>{GstinUpload.name}</div>
                      <div>
                        <RxCross1
                          size={20}
                          onClick={() => {
                            // setDeletefile(true)
                            setGstinUpload("");
                          }}
                        />
                      </div>
                    </div>
                    <div className=" w-full flex justify-end">
                      <button
                        type="button"
                        className=" bg-[#EB8105] py-1 px-3"
                        onClick={() => {
                          setSaveGstin(true);
                        }}
                      >
                        Save and continue
                      </button>
                    </div>
                    {/* <DeleteModel filename={GstinUpload.name} deleteFile={deletefile} setDeletefile={setDeletefile} /> */}
                  </div>
                </div>
              )}
            </div>

            <br />
            <br />
            <div className="w-full">
              <label className="flex flex-col items-start gap-2">
                <span>Enter Account holder name</span>
                <input
                  className="w-[360px] lg:w-[800px] p-2 bg-white border-b border-gray-500 text-gray-700 outline-none"
                  type="text"
                  placeholder="Account Holder Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <br />
              </label>

              <label className="flex flex-col items-start gap-2">
                <span>Enter Bank account number</span>
                <input
                  className="w-[360px] lg:w-[800px] p-2 bg-white border-b border-gray-500 text-gray-700 outline-none"
                  placeholder="6169551651496AG56196"
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
                <br />
              </label>

              <label className="flex flex-col items-start gap-2">
                <span>RE-Enter Bank account number</span>
                <input
                  className="w-[360px] lg:w-[800px] p-2 bg-white border-b border-gray-500 text-gray-700 outline-none"
                  placeholder="6169551651496AG56196"
                  type="text"
                  value={reaccountNumber}
                  onChange={(e) => setReaccountNumber(e.target.value)}
                />
                <br />
              </label>

              <div>
                <label className="flex flex-col justify-center items-start gap-2">
                  <span>Enter IFSC Code</span>
                  <input
                    className="w-[360px] lg:w-[800px] p-2 bg-white border-b border-gray-500 text-gray-700 outline-none"
                    placeholder="6169551651496AG56196"
                    type="text"
                    value={ifscNumber}
                    onChange={(e) => setIfscNumber(e.target.value)}
                  />
                  <br />
                </label>

                {/* <div>
								Search IFSC Code
							</div> */}
              </div>

              <div className="p-2 flex flex-col justify-center items-start gap-2 w-full ">
                <span>* Upload your Passbook as a single file </span>
                <div className="flex items-center">
                  <label
                    htmlFor="passbook-upload"
                    className="flex items-center px-4 py-2 rounded bg-gradient-to-b from-primary to-secondary"
                    onClick={() => {
                      setSaveAccount(false);
                    }}
                  >
                    <MdOutlineFileUpload color="white" size={25} />
                    Upload
                    <input
                      id="passbook-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={(e) => {
                        setAccountUpload(e.target.files[0]);
                      }}
                    />
                  </label>
                  {!saveAccount ? (
                    <span className="text-gray-400 text-sm mx-1">
                      Max File Size 20MB
                    </span>
                  ) : (
                    <div className=" ml-2 text-sm mx-1 flex gap-5">
                      <div>{accountUpload.name}</div>
                      <div>
                        <RxCross1
                          size={20}
                          onClick={() => {
                            // setDeletefile(true)

                            setSaveAccount(false);
                            setAccountUpload("");
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {accountUpload && (
                  <div className={saveAccount ? "hidden" : "block w-full"}>
                    <div className=" w-full mt-1 flex flex-col gap-5">
                      <div>
                        <p className=" underline">Clear files</p>
                      </div>
                      <div className=" border-2 flex justify-between border-black p-2 w-full">
                        <div>{accountUpload.name}</div>
                        <div>
                          <RxCross1
                            size={20}
                            onClick={() => {
                              setAccountUpload("");
                            }}
                          />
                        </div>
                      </div>
                      <div className=" w-full flex justify-end">
                        <button
                          type="button"
                          className=" bg-[#EB8105] py-1 px-3"
                          onClick={() => {
                            setSaveAccount(true);
                          }}
                        >
                          Save and continue
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* <DeleteModel filename={accountUpload.name} accountUpload={accountUpload} setAccountUpload={setAccountUpload} deleteFile={deletefile} setDeletefile={setDeletefile} /> */}
              </div>
            </div>
            <br />
            <br />
            <div className="w-full flex items-center justify-center">
              {/* <Link href="/confirmation"> */}
              <button
                type="submit"
                className="p-5 flex items-center justify-center w-full sm:w-[150px] h-[40px] rounded-lg bg-gradient-to-b from-[#EB8105] to-[#FAAC06] cursor-pointer text-white font-medium shadow-md hover:shadow-lg transition-shadow"
              >
                SUBMIT
              </button>
              {/* </Link> */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default MainVerification;
