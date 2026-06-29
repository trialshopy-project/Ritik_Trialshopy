import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Coupons = () => {
  const [data, setData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [addNew, setAddNew] = useState(false);
  const [search, setSearch] = useState("");
  const [newCoupon, setNewCoupon] = useState({
    title: "",
    description: "",
    code: "",
    discountValue: "",
    validFrom: "",
    validTo: "",
    status: "active",
    minOrderValue: "",
    isVisible: true
  });

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_USER_API_ENDPOINT || 'http://localhost:8000'}/api/v1/coupons/getAll`
      );
      if (response && response.data) {
        setData(response.data);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch coupons");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [open, addNew]);

  const handleClose = () => {
    setOpen(false);
    setAddNew(false);
  };

  const updateCoupon = async () => {
    try {
      const payload = {
        ...selected,
        validity: {
          validFrom: selected.validFrom,
          validTill: selected.validTo
        }
      };
      const response = await axios.put(
        `${import.meta.env.VITE_USER_API_ENDPOINT || 'http://localhost:8000'}/api/v1/coupons/updateCoupon/${selected._id}`,
        payload
      );
      if (response) {
        toast.success("Coupon updated");
        setOpen(false);
        fetchCoupons();
      }
    } catch (err) {
      toast.error("Failed to update coupon");
      console.error(err);
    }
  };

  const filteredData = data
  .filter(item => (selectedStatus ? item.status === selectedStatus : true))
  .filter(item =>
    search
      ? (item.code && item.code.toLowerCase().includes(search.toLowerCase())) ||
        (item.title && item.title.toLowerCase().includes(search.toLowerCase()))
      : true
  );

  const handleSubmit = async () => {
    try {
      const payload = {
        ...newCoupon,
        validity: {
          validFrom: newCoupon.validFrom,
          validTill: newCoupon.validTo
        }
      };
      const response = await axios.post(
        `${import.meta.env.VITE_USER_API_ENDPOINT || 'http://localhost:8000'}/api/v1/coupons/createCoupon`,
        payload
      );
      if (response) {
        toast.success("New coupon added");
        setAddNew(false);
        fetchCoupons();
      }
    } catch (err) {
      toast.error("Failed to submit");
      console.log(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCoupon((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelected((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handledelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_USER_API_ENDPOINT || 'http://localhost:8000'}/api/v1/coupons/deleteCoupon/${id}`,
      );
      if (response) {
        toast.success("Coupon deleted successfully");
        setOpen(false);
        fetchCoupons();
      }
    } catch (err) {
      toast.error("Failed to delete");
      console.log(err);
    }
  };

  return (
    <div className='p-4 relative'>
      <h1>Generic Coupons</h1>
      <div className='flex justify-between my-4'>
        <input type="text" className='rounded-full px-4 py-1' placeholder='Search coupon code...' value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className='flex gap-4'>
          <button className='text-center bg-black text-white rounded px-4 py-1' onClick={() => setAddNew(true)}>Add New Coupon</button>
        </div>
      </div>
      <table className="w-full">
        <thead className="w-full">
          <tr className="w-full bg-black text-white">
            <td className='p-2'>S.no</td>
            <td className='p-2'>Code</td>
            <td className='p-2'>Discount (%)</td>
            <td className='p-2'>Min Purchase</td>
            <td className='p-2'>Visible</td>
            <td className='p-2'>
              <select className="border border-gray-300 p-1 rounded-md text-black appearance-none"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="">Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </td>
            <td className='p-2'>Action</td>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index} className="border-b">
              <td className='p-2'>{index + 1}</td>
              <td className='p-2'>{item.code}</td>
              <td className='p-2'>{item.discountValue}%</td>
              <td className='p-2'>₹{item.minOrderValue}</td>
              <td className='p-2'>{item.isVisible !== false ? 'Yes' : 'No'}</td>
              <td className='p-2'>{item.status}</td>
              <td className='p-2'>
                <button className='border-2 border-green-400 hover:bg-green-400 rounded px-4 py-1' onClick={() => { 
                  setSelected({
                    ...item,
                    validFrom: item.validity?.validFrom,
                    validTo: item.validity?.validTill
                  }); 
                  setOpen(true); 
                }}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style} className="rounded flex flex-col gap-2 w-96 max-h-[90vh] overflow-y-auto">
          <h2 className="font-bold text-lg mb-2">Edit Coupon</h2>
          
          <label className="font-semibold text-sm">Code</label>
          <input type="text" name="code" value={selected?.code || ""} className='border-2 px-2 py-1 rounded' onChange={handleEditChange} />

          <label className="font-semibold text-sm">Title</label>
          <input type="text" name="title" value={selected?.title || ""} className='border-2 px-2 py-1 rounded' onChange={handleEditChange} />

          <label className="font-semibold text-sm">Description</label>
          <input type="text" name="description" value={selected?.description || ""} className='border-2 px-2 py-1 rounded' onChange={handleEditChange} />

          <label className="font-semibold text-sm">Discount (%)</label>
          <input type="number" name="discountValue" value={selected?.discountValue || ""} className='border-2 px-2 py-1 rounded' onChange={handleEditChange} />

          <label className="font-semibold text-sm">Min Purchase Amount</label>
          <input type="number" name="minOrderValue" value={selected?.minOrderValue || ""} className='border-2 px-2 py-1 rounded' onChange={handleEditChange} />

          <label className="font-semibold text-sm">Valid From</label>
          <input type="date" name="validFrom" value={selected?.validFrom ? new Date(selected.validFrom).toISOString().split('T')[0] : ""} className='border-2 px-2 py-1 rounded' onChange={handleEditChange} />

          <label className="font-semibold text-sm">Valid To</label>
          <input type="date" name="validTo" value={selected?.validTo ? new Date(selected.validTo).toISOString().split('T')[0] : ""} className='border-2 px-2 py-1 rounded' onChange={handleEditChange} />

          <label className="font-semibold text-sm">Status</label>
          <select name="status" value={selected?.status || "active"} onChange={handleEditChange} className='border-2 px-2 py-1 rounded'>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <label className="font-semibold text-sm flex items-center gap-2">
            <input type="checkbox" name="isVisible" checked={selected?.isVisible !== false} onChange={handleEditChange} />
            Visible on Website
          </label>

          <div className='flex justify-evenly mt-4'>
            <button className='border-2 px-4 py-1 rounded bg-green-500 text-white' onClick={updateCoupon}>Update</button>
            <button className='border-2 px-4 py-1 rounded bg-red-500 text-white' onClick={() => handledelete(selected._id)}>Delete</button>
          </div>
        </Box>
      </Modal>

      {/* Add New Modal */}
      <Modal open={addNew} onClose={handleClose}>
        <Box sx={style} className="rounded flex flex-col gap-2 w-96 max-h-[90vh] overflow-y-auto">
          <h2 className="font-bold text-lg mb-2">Add New Coupon</h2>
          
          <label className="font-semibold text-sm">Code</label>
          <input type="text" name="code" value={newCoupon.code} className='border-2 px-2 py-1 rounded' onChange={handleChange} placeholder="e.g. SUMMER10" />

          <label className="font-semibold text-sm">Title</label>
          <input type="text" name="title" value={newCoupon.title} className='border-2 px-2 py-1 rounded' onChange={handleChange} placeholder="Summer special discount" />

          <label className="font-semibold text-sm">Description</label>
          <input type="text" name="description" value={newCoupon.description} className='border-2 px-2 py-1 rounded' onChange={handleChange} placeholder="Login Using ..." />

          <label className="font-semibold text-sm">Discount (%)</label>
          <input type="number" name="discountValue" value={newCoupon.discountValue} className='border-2 px-2 py-1 rounded' onChange={handleChange} placeholder="10" />

          <label className="font-semibold text-sm">Min Purchase Amount</label>
          <input type="number" name="minOrderValue" value={newCoupon.minOrderValue} className='border-2 px-2 py-1 rounded' onChange={handleChange} placeholder="100" />

          <label className="font-semibold text-sm">Valid From</label>
          <input type="date" name="validFrom" value={newCoupon.validFrom} className='border-2 px-2 py-1 rounded' onChange={handleChange} />

          <label className="font-semibold text-sm">Valid To</label>
          <input type="date" name="validTo" value={newCoupon.validTo} className='border-2 px-2 py-1 rounded' onChange={handleChange} />

          <label className="font-semibold text-sm">Status</label>
          <select name="status" value={newCoupon.status} onChange={handleChange} className='border-2 px-2 py-1 rounded'>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <label className="font-semibold text-sm flex items-center gap-2">
            <input type="checkbox" name="isVisible" checked={newCoupon.isVisible} onChange={handleChange} />
            Visible on Website
          </label>

          <button onClick={handleSubmit} className='border-2 px-4 py-1 mt-3 rounded bg-black hover:scale-105 duration-300 text-white'>Submit</button>
        </Box>
      </Modal>
    </div>
  );
};

export default Coupons;
