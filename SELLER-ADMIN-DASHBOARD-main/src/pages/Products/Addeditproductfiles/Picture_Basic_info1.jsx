import React, { useState } from "react";

const Pictures_Basic_info1 = ({
  setOldImages,
  setImages,
  oldImages,
  setIsUploaded,
}) => {
  const [avatarPreview, setAvatarPreview] = useState([]);
  console.log(oldImages);
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setAvatarPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setIsUploaded(true);
          setAvatarPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="ms-44 border border-b-slate-300">
      <section className="ms-5">
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

          <div className=" mt-4 gap-5 flex">
            {oldImages &&
              oldImages.map((image, index) => (
                <img
                  className="w-10 h-10"
                  key={index}
                  src={image.url}
                  alt="Old Product Preview"
                />
              ))}
          </div>
        </section>
      </section>
    </div>
  );
};

export default Pictures_Basic_info1;
