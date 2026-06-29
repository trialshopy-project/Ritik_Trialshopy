import React from "react";

export default function FormFields({
  labelText,
  classes,
  inputType,
  placeholder,
  value,
  onChangeFun,
  name,
}) {
  return (
    <div className="flex flex-col items-center w-full">
      <label className="flex flex-col items-start w-full p-1 gap-[10px]">
        <div className="text-base md:text-xl">{labelText}</div>
        <input
          className={`${classes} w-full border border-black rounded-md border-t-2 border-l-2 border-r-2 border-r-sky-600 border-l-sky-700`}
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChangeFun(e.target.value, name)}
          name={name}
        />
      </label>
    </div>
  );
}
