import React, { useState, useEffect } from "react";
import { AiFillFileExcel } from "react-icons/ai";
import { BsCloudUploadFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Topbar from "../../layouts/Topbar";
import CreateExcelFile from "./CreateExcelFile";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";

function BulkUpload() {
  const [fileData, setFileData] = useState([]);

  const handleFileUpload = (e) => {
    console.log("object");
    const file = e.target.files[0];
    console.log(file);
    const reader = new FileReader();

    reader.onload = async (event) => {
      const binaryString = event.target.result;
      const workbook = XLSX.read(binaryString, { type: "binary" });

      // Assume first sheet is the target
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Assuming the email string is in the first cell of the first row

      setFileData(data.slice(1));
    };

    reader.readAsBinaryString(file);
  };

  const [fileLoading, setFileLoading] = useState(false);

  const handleAddDocuments = async () => {
    setFileLoading(true);
    if (fileData.length === 0) {
      toast.error("Please upload an Excel file.");
      setFileLoading(false);
      return;
    }

    console.log(fileData, "f");

    const {
      productName,
      shortDescription,
      fullDescription,
      manufacturer,
      status,
      price,
      shippingType,
      metaTitle,
      metaKeywords,
      metaDescription,
    } = fileData[0];

    // if (
    //   !productName ||
    //   !shortDescription ||
    //   !fullDescription ||
    //   !manufacturer ||
    //   !status ||
    //   !price ||
    //   !shippingType ||
    //   !metaTitle ||
    //   !metaKeywords ||
    //   !metaDescription
    // ) {
    //   toast.error("Please fill in all required fields in the Excel file.");
    //   setFileLoading(false);
    //   return;
    // }

    try {
      // const responseData = await axios.post(
      //   `${import.meta.env.VITE_API_ENDPOINT}/api/upload`,
      //   { images: fileData[0].images }
      // );
      // console.log("File uploaded successfully:", responseData.data);

      const uploadPromises = fileData.map(async (row) => {
        console.log(row,"first")
        const response = await axios.post(
          `${import.meta.env.VITE_API_ENDPOINT}/products`,
          {
            ...row,
            images: [],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response;
      });

      const responses = await Promise.all(uploadPromises);
      const allSuccessful = responses.every(
        (response) => response.data.success
      );

      if (allSuccessful) {
        setFileLoading(false);
        toast.success("Products Created Successfully");
        navigate("/Products");
      } else {
        toast.error("Some products could not be created.");
      }
    } catch (error) {
      setFileLoading(false);
      toast.error(error?.response?.data?.message);
      console.error("Error creating products:", error);
    } finally {
      setFileLoading(false);
    }
  };

  return (
    <div className="flex w-screen lg:h-full h-screen lg:w-full  overflow-y-scroll">
      <Topbar />
      <div className=" lg:mt-20">
        <div className="flex items-center mt-24 lg:mt-0 ms-4">
          <BsCloudUploadFill size={25} />
          <h3 className="font-semibold text-[20px] mx-[10px]">Bulk Upload</h3>
        </div>
        <div className="border-t border-gray-300 my-4 mx-4"></div>
        <div className="flex flex-col mt-10 sm:mt-20 ml-4 sm:ml-8">
          <div className="flex items-center mb-6">
            <p className="ml-4 mt-3">
              You can import multiple products into your system from the Excel
              file.
            </p>
          </div>
          <div className="flex items-center mb-6">
            <p className="ml-4 mt-3">
              Download the Excel format file from this link:
            </p>
            <button
              className="bg-customPurple text-white px-4 w-1/4 mr-8 py-2 lg:px-4 lg:py-2 rounded-lg flex items-center space-x-2 ml-2"
              id="downloadButton"
            >
              <AiFillFileExcel size={25} />
              <CreateExcelFile />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 ">
            <p className="ml-4 mt-3 sm:mt-0 mr-4">
              Once you download the above Excel file format, fill in data about
              your products in the Excel file and upload it below. Keep in mind
              not to remove the top header row of the Excel file as it is the
              format for uploading the data. If you change any header column
              text, you will not be able to upload the data.
            </p>
          </div>
          <div className="mt-10">
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileUpload}
              className="mb-12"
            />
            <button
              onClick={handleAddDocuments}
              disabled={!fileData?.length || fileLoading}
              className="bg-customPurple  text-white lg:py-2 py-1 px-4 mb-24 rounded-lg flex items-center space-x-2 "
            >
              {fileLoading ? "Loading..." : "Add Products"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkUpload;
