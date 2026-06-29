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
    <>
      <section>
        <h2 className="font-semibold mt-5">Pictures</h2>

        <section className="flex sm:mt-4 items-start flex-col">
          <p className="text-[#FF0000] mb-2 font-bold">
            You can Upload multiple images*
          </p>
          <input
            type="file"
            accept="image/*"
            name="images"
            multiple
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
      </section>
    </>
  );
};

export default Pictures_Basic_info;
