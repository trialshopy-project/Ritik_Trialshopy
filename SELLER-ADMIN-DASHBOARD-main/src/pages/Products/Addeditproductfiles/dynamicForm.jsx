import React from 'react';

const DynamicForm = ({ attributes, setFormData, setglobalFormData, currentIndex }) => {
  const filteredAttributes = attributes.filter(
    attr => attr.name !== 'Size'
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prevData => {
      const updatedAttributes = {
        ...prevData[currentIndex]?.attributes,
        [name]: value,
      };

      return {
        ...prevData,
        [currentIndex]: {
          ...prevData[currentIndex],
          attributes: updatedAttributes,
        },
      };
    });

    setglobalFormData(prevData => {
      const updatedAttributes = {
        ...prevData[currentIndex]?.attributes,
        [name]: value,
      };

      return {
        ...prevData,
        [currentIndex]: {
          ...prevData[currentIndex],
          attributes: updatedAttributes,
        },
      };
    });
  };

  return (
    <form className="w-full flex flex-wrap gap-5 p-4 rounded-lg justify-evenly">
      {filteredAttributes.map(attr => (
        <div key={attr._id} className="flex flex-col w-full sm:w-1/2 lg:w-1/3 p-2 rounded">
          <label htmlFor={attr._id} className="mb-2 text-lg font-medium text-gray-700">{attr.name}</label>
          {attr.type === 'select' ? (
            <select id={attr._id} name={attr.name} className="w-full p-2 border border-gray-300 rounded" onChange={handleChange}>
              <option value="">Select an option</option>
              {attr.options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : attr.type === 'text' ? (
            <input
              type="text"
              id={attr._id}
              name={attr.name}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder={`Enter ${attr.name}`}
              onChange={handleChange}
            />
          ) : (
            <p className="text-red-500">Unknown field type</p>
          )}
        </div>
      ))}
    </form>
  );
};

export default DynamicForm;
