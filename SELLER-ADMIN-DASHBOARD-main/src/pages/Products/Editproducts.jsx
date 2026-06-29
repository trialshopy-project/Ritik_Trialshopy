import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Topbar2 from "../../layouts/Topbar2";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../../components/context/UserContext";
// import EditProducts_dynamic from "./editProducts_dynamic";
import Header from "../../layouts/Topbar";
// import DynamicForm from "./Addeditproductfiles/editDynamicForm";
import { useRef } from "react";
import EditProductSize from "./editProduct_size";
import Editproductsize from "./eidt_size";
import EditProductAttributes from "./dynamicAttributes";
const Editproducts = () => {
  const [searchParams] = useSearchParams();
  const [productData, setProductData] = useState({});
  const [authenticated] = useContext(UserContext);
  const sellerId = authenticated.user._id;
  const productId = searchParams.get("productId");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [getDynamicData, setDynamicData] = useState(false);
  const [makeVisible, setVisible] = useState(false);
  const [dynamicAttributes, setdynamicAttributes] = useState(null);
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}/products/${productId}`
        );
        setProductData(response.data.products);
        setDynamicData(true);
      } catch (error) {
        console.error("Error fetching product data:", error);
        toast.error("Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [productId]);

  const [categories, setcategories] = useState("");

  const [availableSizes, setavailablesize] = useState([]);

  const fetch_categories = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/categories/${categories}`
    );
    console.log(response.data);

    if (
      response.data.message === "success" &&
      response.data.result.attributes.length > 0
    ) {
      // setVisible(true);
      const attributes = response.data.result?.attributes || [];
      setdynamicAttributes((attribute) => {
        const filteredAttributes = attributes;
        return filteredAttributes;
      });

      const sizeAttribute = attributes.find((attr) => attr.name === "Size");
      const brandAttribute = attributes.find((attr) => attr.name === "Brand");
      const FabricAttribute = attributes.find((attr) => attr.name === "Fabric");
      const FabricOptions = FabricAttribute ? FabricAttribute.options : [];
      const brandOptions = brandAttribute ? brandAttribute.options : [];
      const sizeOptions = sizeAttribute ? sizeAttribute.options : "free size";
      setavailablesize(sizeOptions);
      // console.log(brandOptions, "brand k oirek d");
      setbrand(brandOptions);
    }
  };
  useEffect(() => {
    console.log(categories, "is ");
    fetch_categories();
  }, [categories]);

  const ProductForm = ({ productData }) => {
    const [productName, setProductName] = useState(
      productData.productName || ""
    );
    const [productImage, setProductImage] = useState(
      productData.productImage || ""
    );
    const [manufacturer, setManufacturer] = useState(
      productData.manufacturerDrop || ""
    );
    const [shortDescription, setShortDescription] = useState(
      productData.shortDescription || ""
    );
    const [fullDescription, setFullDescription] = useState(
      productData.fullDescription || ""
    );
    const [Images, setImages] = useState(productData.Images || []);
    const [Color, setColor] = useState(productData.Color || "");
    const [status, setStatus] = useState(productData.status || "");
    const [weight, setWeight] = useState(productData.Weight || "");
    const [quantity, setQuantity] = useState(productData.quantity || "");
    const [startDate, setStartDate] = useState(productData.startDate || "");
    const [endDate, setEndDate] = useState(productData.endDate || "");
    const [tags, setTags] = useState(productData.tags || "");
    const [sku, setSku] = useState(productData.sku || "");
    const [hsnCode, setHsnCode] = useState(productData.HSNCode || "");
    const [cmlNumber, setCmlNumber] = useState(productData.CMLNumber || "");
    const [rent, setRent] = useState(productData.Rent || "");
    const [rentPerHour, setRentPerHour] = useState(
      productData.RentPerHour || ""
    );
    const [is_save, set_is_save] = useState(false);
    const [showOnHome, setShowOnHome] = useState(
      productData.showonhome || false
    );
    const [markNew, setMarkNew] = useState(productData.marknew || false);
    const [reviewAllow, setReviewAllow] = useState(
      productData.reviewallow || false
    );
    const [attributes, setAttributes] = useState(productData.attributes || []);
    const [size, setSize] = useState(productData.Size || []);
    const [IsNumber, setIsNumber] = useState("");
    const [sgstNumber, setsgstNumber] = useState("");
    const [gstNumber, setgstNumber] = useState("");
    const [countryOfOrigin, setcountryOfOrigin] = useState("");

    useEffect(() => {
      setProductName(productData.productName || "");
      setProductImage(productData.productImage || "");
      setManufacturer(productData.manufacturerDrop || "");
      setShortDescription(productData.shortDescription || "");
      setFullDescription(productData.fullDescription || "");
      setImages(productData.Images || []);
      setColor(productData.Color || "");
      setStatus(productData.status || "");
      setWeight(productData.Weight || "");
      setQuantity(productData.quantity || "");
      setStartDate(productData.startDate || "");
      setEndDate(productData.endDate || "");
      setTags(productData.tags || "");
      setSku(productData.sku || "");
      setHsnCode(productData.HSNCode || "");
      setCmlNumber(productData.CMLNumber || "");
      setIsNumber(productData.IsNumber || "");
      setRent(productData.Rent || "");
      setRentPerHour(productData.RentPerHour || "");
      setShowOnHome(productData.showonhome || false);
      setMarkNew(productData.marknew || false);
      setReviewAllow(productData.reviewallow || false);
      setAttributes(productData.attributes || []);
      setSize(productData.Size || []);
      setsgstNumber(productData.sgstNumber || "");
      setgstNumber(productData.gstNumber || "");
      setcountryOfOrigin(productData.countryOfOrigin || "");
      setcategories(productData.categories[0] || "");
      setData(productData?.Size || "daf");
    }, [productData]);

    // const [makeVisible, setVisible] = useState(false);
    const handleChange = (e) => {
      const { name, value } = e.target;
      switch (name) {
        case "productName":
          setProductName(value);
          break;
        case "productImage":
          setProductImage(value);
          break;
        case "manufacturer":
          setManufacturer(value);
          break;
        case "shortDescription":
          setShortDescription(value);
          break;
        case "fullDescription":
          setFullDescription(value);
          break;
        case "Color":
          setColor(value);
          break;
        case "Weight":
          setWeight(value);
          break;
        case "status":
          setStatus(value);
          break;
        case "sgstNumber":
          setsgstNumber(value);
          break;
        case "gstNumber":
          setgstNumber(value);
          break;
        case "countryOfOrigin":
          setcountryOfOrigin(value);
          break;
        case "type":
          setType(value);
          break;
        case "material":
          setMaterial(value);
          break;
        case "discount":
          setDiscount(value);
          break;
        case "inStock":
          setInStock(e.target.checked);
          break;
        default:
          break;
      }
    };

    const handleProductEdit = async () => {
      setLoading(true);
      if (!productName || !gstNumber) {
        toast.error("Please fill all the details!");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_ENDPOINT}/products/${productId}`,
          {
            productName,
            sellerId,
            productImage,
            storeId: authenticated?.user?.storeId,
            manufacturerDrop: manufacturer,
            shortDescription,
            fullDescription,
            // Images: images.map((img) => ({ url: img })),
            Color: Color,
            Weight: weight,
            status,
            categories,
            sgstNumber,
            gstNumber,
            countryOfOrigin,
            Size: data,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          set_is_save(true);
          toast.success("Product Updated Successfully");
          navigate("/Products");
        }
      } catch (error) {
        toast.error(error || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <img src={`${productImage}`} alt="product image" className="w-56" />
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              label: "Product Name",
              name: "productName",
              required: true,
              placeholder: "Enter Product name",
              value: productName,
            },
            // { label: "Product Image URL", name: "productImage", required: true, placeholder: "Enter Product Image URL", value: productImage },
            {
              label: "Manufacturer",
              name: "manufacturer",
              required: true,
              placeholder: "Enter manufacturer details",
              value: manufacturer,
            },
            {
              label: "Color",
              name: "Color",
              placeholder: "e.g. gray",
              value: Color,
            },
            {
              label: "Weight",
              name: "Weight",
              required: true,
              placeholder: "Net Weight",
              value: weight,
            },
          ].map((field, idx) => (
            <div key={idx} className="flex flex-col">
              <label htmlFor={field.name} className="font-bold text-sm mb-2">
                {field.label}{" "}
                {field.required && <span className="text-[#F60002]">*</span>}
              </label>
              {field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  name={field.name}
                  id={field.name}
                  className="p-2 rounded-lg"
                  checked={field.checked}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type="text"
                  name={field.name}
                  id={field.name}
                  placeholder={field.placeholder}
                  className="bg-gray-50 border border-gray-300 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={field.value}
                  onChange={handleChange}
                />
              )}
            </div>
          ))}

          <h3
            className={`font-bold text-xl lg:text-2xl text-start mt-10 mb-6 ${
              makeVisible ? "" : "hidden"
            }`}
          >
            {/* Attributes */}
          </h3>
          <hr className="mb-6" />
          {/* {
            attributes ? (
              <div className="mt-7">
            <EditProducts_dynamic
              dynamicAttributes={dynamicAttributes}
              setAttributes={setAttributes}
            />
          </div>
            ):''
          } */}
        </section>
        <h3 className="font-bold text-xl lg:text-2xl text-start mt-10 mb-6">
          Description
        </h3>
        <hr className="mb-6" />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="flex flex-col">
            <label
              htmlFor="shortDescription"
              className="font-bold text-sm mb-2"
            >
              Short Description <span className="text-[#F60002]">*</span>
            </label>
            <textarea
              rows={3}
              name="shortDescription"
              id="shortDescription"
              placeholder="Enter a short description"
              className="p-2 bg-gray-50 border border-gray-300 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={shortDescription || ""}
              onChange={handleChange}
            ></textarea>
          </section>

          <section className="flex flex-col">
            <label htmlFor="fullDescription" className="font-bold text-sm mb-2">
              Full Description
            </label>
            <textarea
              rows={3}
              name="fullDescription"
              id="fullDescription"
              placeholder="Enter a full description"
              className="p-2 bg-gray-50 border border-gray-300 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={fullDescription || ""}
              onChange={handleChange}
            ></textarea>
          </section>
        </section>

        {data ? (
          <>
            <h3
              className={`font-bold text-xl lg:text-2xl text-start mt-10 mb-6 `}
            >
              Size Details
            </h3>

            {/* <EditProductSize
              availableSizesProp={availableSizes}
              setData={setData}
              makeVisible={true}
              sizeDetails={data}
              onChange={handleChange}
            /> */}
            <Editproductsize />
            <hr />
            <h3 className="font-bold text-xl lg:text-2xl text-start mt-10 mb-6">
              Add Attributes
            </h3>
            <EditProductAttributes
              categories={categories}
              productId={productId}
              productData={productData}
              submit_it={is_save}
            />
            {/**--------------------------------------------------edit product section size details ------------------------------------- */}
          </>
        ) : (
          ""
        )}

        {/** Additional Details */}
        <h3 className="font-bold text-xl lg:text-2xl text-start mt-10 mb-6">
          Additional Details
        </h3>
        <hr className="mb-6" />

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              label: "GST Number",
              name: "gstNumber",
              required: true,
              placeholder: "Enter GST Number",
              value: gstNumber,
            },
            {
              label: "SGST Number",
              name: "sgstNumber",
              placeholder: "Enter SGST Number",
              value: sgstNumber,
            },
            {
              label: "Country of Origin",
              name: "countryOfOrigin",
              required: true,
              type: "select",
              options: [
                { value: "", label: "Select Country", disabled: true },
                { value: "India", label: "India" },
                { value: "USA", label: "USA" },
                { value: "China", label: "China" },
                { value: "Germany", label: "Germany" },
                { value: "UK", label: "UK" },
                { value: "Other", label: "Other" },
              ],
            },
          ].map((field, idx) => (
            <section key={idx} className="flex flex-col">
              <label htmlFor={field.name} className="font-bold text-sm mb-2">
                {field.label}{" "}
                {field.required && <span className="text-[#F60002]">*</span>}
              </label>
              {field.type === "select" ? (
                <select
                  name={field.name}
                  id={field.name}
                  className="bg-gray-50 border border-gray-300 text-sm p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={[field.name] || ""}
                  onChange={handleChange}
                >
                  {field.options.map((option, i) => (
                    <option
                      key={i}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id={field.name}
                  name={field.name}
                  value={field.value}
                  placeholder={field.placeholder}
                  onChange={handleChange}
                  className="rounded-md border p-2"
                />
              )}
            </section>
          ))}
        </section>

        <button
          type="button"
          onClick={handleProductEdit}
          className="bg-customPurple hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Update Product
        </button>
      </>
    );
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <section className="mt-20">
        {/* <Topbar2 />
         */}
        <Header />
      </section>
      <div className="flex flex-col lg:flex-row w-full justify-evenly items-start lg:items-center p-4 lg:p-8 space-y-6 lg:space-y-0 lg:space-x-6">
        <div className="w-full lg:w-[70%]">
          <section className="w-full p-6 lg:p-8 border border-gray-300 bg-white shadow-lg rounded-lg">
            <h3 className="font-bold text-xl lg:text-2xl text-start mb-6">
              Update the Product
            </h3>
            <hr className="mb-6" />
            <ProductForm productData={productData} />
          </section>
        </div>
      </div>
    </>
  );
};

export default Editproducts;
