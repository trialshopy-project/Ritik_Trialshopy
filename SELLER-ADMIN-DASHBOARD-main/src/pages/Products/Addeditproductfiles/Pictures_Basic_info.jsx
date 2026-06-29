import React, { useState } from "react";

const Pictures_Basic_info = ({ setProductImageFile }) => {
  const [avatarPreview, setAvatarPreview] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setProductImageFile([]);
    setAvatarPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview((old) => [...old, reader.result]);
          setProductImageFile((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="mt-2">
      <h3 className="font-semibold flex text-left text-sm mb-2">
        Pictures (
        <p className="text-[#FF0000]  font-bold">
          You can Upload multiple images*
        </p>
        )
      </h3>
      <section className="flex items-start justify-start flex-col">
        <input
          type="file"
          accept="image/*"
          name="images"
          multiple
          className="flex items-center justify-center"
          onChange={handleImageChange}
        />

        <div className=" mt-4 gap-5 flex">
          {avatarPreview.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="Product Preview"
              className="w-10 h-10"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Pictures_Basic_info;
