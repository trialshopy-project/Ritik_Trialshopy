import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const CreateExcelFile = () => {
  const createExcelFile = () => {
    // Example data
    const data = [
      {
        productName: "Product A",
        sellerId: "Seller123",
        manufacturer: "Manufacturer A",
        categories: ["Category 1", "Category 2"],
        subcategories: ["Subcategory 1", "Subcategory 2"],
        status: "Active",
        vendors: ["Vendor 1", "Vendor 2"],
        selectedVendor: "Vendor 1",
        tags: ["Tag 1", "Tag 2"],
        shortDescription: "Short description of Product A",
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        sku: "SKU123",
        fullDescription: "Full description of Product A",
        manufactureDate: "2023-01-01",
        expireDate: "2023-12-31",
        showonhome: true,
        marknew: false,
        reviewallow: true,
        orderMinQuantity: 1,
        orderMaxQuantity: 100,
        price: 100.0,
        oldPrice: 120.0,
        isDiscountAllowed: true,
        discount: 10.0,
        shippingType: "Free",
        shippingCharges: 0.0,
        images: ["url1", "url2"],
        metaTitle: "Meta Title A",
        metaKeywords: ["Keyword1", "Keyword2"],
        metaDescription: "Meta description of Product A",
        attributes: ["Attribute1", "Attribute2"],
        selectedAttribute: "Attribute1",
        priceAdjustmentTypes: ["AdjustmentType1", "AdjustmentType2"],
        selectedPriceAdjustmentType: "AdjustmentType1",
      },
      // Add more product data as needed
    ];

    // Convert arrays to strings before creating the worksheet
    const dataWithArraysConvertedToStrings = data.map((item) => ({
      ...item,
      categories: item.categories.join(", "),
      subcategories: item.subcategories.join(", "),
      vendors: item.vendors.join(", "),
      tags: item.tags.join(", "),
      images: item.images.join(", "),
      metaKeywords: item.metaKeywords.join(", "),
      attributes: item.attributes.join(", "),
      priceAdjustmentTypes: item.priceAdjustmentTypes.join(", "),
    }));

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Convert data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(
      dataWithArraysConvertedToStrings
    );

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Save file using file-saver
    const fileName = "products.xlsx";
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, fileName);
  };

  return (
    <div>
      <button onClick={createExcelFile}>Create Excel File</button>
    </div>
  );
};

export default CreateExcelFile;
