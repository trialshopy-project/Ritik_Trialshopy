const Popup = ({ message, onCancel, onConfirm }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#00000008] z-50">
      <div className="bg-white border-2 border-[#EB8105] p-7 rounded-md shadow-md z-60">
        <p className="text-black">{message}</p>
        <div className="flex justify-end gap-6">
          <button
            onClick={onCancel}
            className="mt-4 bg-[#EB8105] text-white px-4 py-2 rounded-md hover:bg-[#FAAC06]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-[#FAAC06]"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
