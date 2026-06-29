
// import React, { useState } from "react";
// import { v4 as uuidv4 } from "uuid";
// import axios from "axios";
// import toast from "react-hot-toast";

// // import { ColorPicker, useColor } from "react-color-palette";
// // import "react-color-palette/css";

// const AddVariant = ({ variants, setVariants }) => {
//   //for image file upload
//   const [currentVariantIndex, setCurrentVariantIndex] = useState(null);
//   // const [color, setColor] = useColor("cyan");
//   const handleAddVariant = () => {
//     setVariants([
//       ...variants,
//       {
//         variantId: uuidv4(),
//         color: color.hex,
//         size: "",
//         stock: 1,
//         price: 0,
//         discount: 0,
//         images: [],
//         sku: "",
//       },
//     ]);
//   };

//   const handleVariantChange = (index, key, value) => {
//     const newVariants = [...variants];
//     newVariants[index][key] = value;
//     setVariants(newVariants);
//   };

//   const [avatarPreview, setAvatarPreview] = useState([]);
//   const [images, setProductImageFile] = useState([]);

//   const handleImageChange = (e, index) => {
//     const files = Array.from(e.target.files);

//     setProductImageFile([]);
//     setAvatarPreview([]);

//     setCurrentVariantIndex(index);

//     files.forEach((file) => {
//       const reader = new FileReader();

//       reader.onload = () => {
//         if (reader.readyState === 2) {
//           setAvatarPreview((old) => [...old, reader.result]);
//           setProductImageFile((old) => [...old, reader.result]);
//         }
//       };

//       reader.readAsDataURL(file);
//     });
//   };

//   const [loading, setLoading] = useState(false);

//   const hanldeUploadProductImages = async () => {
//     if (images.length == 0) {
//       toast.error("Please Upload Images");
//       return;
//     }
//     setLoading(true);
//     try {
//       const responseData = await axios.post(
//         `${import.meta.env.VITE_API_ENDPOINT}/api/upload`,
//         { images }
//       );
//       console.log(responseData.data.urls, "Df");
//       if (responseData.data.urls) {
//         toast.success("Image uploaded successfully");
//         const updatedVariants = [...variants];
//         updatedVariants[currentVariantIndex].images = responseData.data.urls;
//         setVariants(updatedVariants);

//         setAvatarPreview([]);
//         setProductImageFile([]);
//       }
//     } catch (error) {
//       toast.error(error?.response?.data?.message);
//       console.error("Error fetching image data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleColorChange = (index, color) => {
//     const newVariants = [...variants];
//     newVariants[index].color = color.hex;
//     setVariants(newVariants);
//   };

//   return (
//     <div className="p-5 mt-5 bg-white rounded-lg shadow-lg">
//       <h2 className="font-semibold text-center  flex items-center justify-center mb-5">
//         Variants
//       </h2>

//       {variants.map((variant, index) => (
//         <section
//           key={index}
//           className="flex mb-5 border border-b-gray-300 flex-wrap justify-between w-full lg:flex-row flex-col  lg:items-center items-start gap-5"
//         >
//           <section>
//             <div className="flex  items-center justify-center flex-col  my-5 border border-b-slate-300">
//               <h3 className="font-semibold text-center text-sm mb-2">
//                 Product Color <span className="text-[#F60002]">*</span>
//               </h3>
//               <div className="mb-5 flex items-center justify-center ">
//                 <ColorPicker
//                   hideInput={["rgb", "hsv"]}
//                   color={color}
//                   onChange={(newColor) => {
//                     setColor(newColor);
//                     handleColorChange(index, newColor);
//                   }}
//                   height={50}
//                 />
//               </div>
//             </div>
//           </section>
//           <section className=" flex flex-col justify-around gap-1.5">
//             <p className="font-bold text-xs">
//               Size <span className="text-[#F60002]">*</span>
//             </p>
//             <input
//               placeholder="Enter Size (eg. L , M , 8 , 9)"
//               className="bg-transparent border border-b-black text-sm p-2 w-full"
//               type="text"
//               value={variant.size}
//               onChange={(e) =>
//                 handleVariantChange(index, "size", e.target.value)
//               }
//             />
//           </section>{" "}
//           <section className=" flex flex-col justify-around gap-1.5">
//             <p className="font-bold text-xs">
//               Stock <span className="text-[#F60002]">*</span>
//             </p>
//             <input
//               placeholder="Enter Stock"
//               className="bg-transparent border border-b-black text-sm p-2 w-full"
//               type="number"
//               value={variant.stock}
//               onChange={(e) =>
//                 handleVariantChange(index, "stock", parseInt(e.target.value))
//               }
//             />
//           </section>{" "}
//           <section className=" flex flex-col justify-around gap-1.5">
//             <p className="font-bold text-xs">
//               Price <span className="text-[#F60002]">*</span>
//             </p>
//             <input
//               placeholder="Enter price"
//               className="bg-transparent border border-b-black text-sm p-2 w-full"
//               type="number"
//               value={variant.price}
//               onChange={(e) =>
//                 handleVariantChange(index, "price", parseFloat(e.target.value))
//               }
//             />
//           </section>{" "}
//           <section className=" flex flex-col justify-around gap-1.5">
//             <p className="font-bold text-xs">
//               Discount <span className="text-[#F60002]">*</span>
//             </p>
//             <input
//               placeholder="Enter price"
//               className="bg-transparent border border-b-black text-sm p-2 w-full"
//               type="number"
//               value={variant.discount}
//               onChange={(e) =>
//                 handleVariantChange(
//                   index,
//                   "discount",
//                   parseFloat(e.target.value)
//                 )
//               }
//             />
//           </section>{" "}
//           <section className=" flex flex-col items-start justify-start  gap-1.5">
//             <p className="font-bold text-xs">
//               SKU <span className="text-[#F60002]">*</span>
//             </p>
//             <input
//               placeholder="Enter SKU"
//               className="bg-transparent border border-b-black text-sm p-2 w-full"
//               type="text"
//               value={variant.sku}
//               onChange={(e) =>
//                 handleVariantChange(index, "sku", e.target.value)
//               }
//             />
//           </section>
//           <section>
//             <div className="mt-2">
//               <h3 className="font-semibold flex text-left text-sm mb-2">
//                 Pictures (
//                 <p className="text-[#FF0000]  font-bold">
//                   You can Upload multiple images*
//                 </p>
//                 )
//               </h3>
//               <section className="flex items-start justify-start flex-col ">
//                 <div className="flex">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     name="images"
//                     multiple
//                     className="flex items-center justify-center"
//                     onChange={(e) => handleImageChange(e, index)}
//                   />

//                   <button
//                     className="flex mt-5 bg-customPurple justify-end rounded-full text-white items-end px-4 py-1 gap-2 focus:outline-none mb-3"
//                     type="button"
//                     onClick={hanldeUploadProductImages}
//                   >
//                     {loading ? "Uploading..." : "Upload Image"}
//                   </button>
//                 </div>
//                 <div className=" gap-5 flex">
//                   {avatarPreview.map((image, index) => (
//                     <img
//                       key={index}
//                       src={image}
//                       alt="Product Preview"
//                       className="w-10 h-10"
//                     />
//                   ))}
//                 </div>
//               </section>
//             </div>
//           </section>
//         </section>
//       ))}
//       <button
//         className="flex mt-5 bg-customPurple justify-end rounded-full text-white items-end px-4 py-1 gap-2 focus:outline-none mb-3"
//         type="button"
//         onClick={handleAddVariant}
//       >
//         Add Variant
//       </button>
//     </div>
//   );
// };

// export default AddVariant;
