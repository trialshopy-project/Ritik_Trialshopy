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

const Domain = () => {
  const [data, setData] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [discount, setDiscount] = useState("");
  const [addNew, setAddNew] = useState(false);
  const [updateMany, setUpdateMany] = useState(false);
  const [search, setSearch] = useState("");
  const [newDomain, setNewDomain] = useState({
    couponType: "",
    domain: "",
    discount: ""
  })
  const fetchDomains = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/coupon/domain`
      );
      if (response) {
        setData(response.data.domains);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
      console.error(err);
    }
  };
  useEffect(() => {

    fetchDomains();
  }, [open]);

  const handleClose = () => {
    setOpen(false)
    setAddNew(false);
    setUpdateMany(false);
  };

  const updateDiscount = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/coupon/updateDiscount/${selected._id}`,
        { discount }
      );
      if (response) {
        toast.success("Discount updated");
        setOpen(false);
        fetchDomains();
      }

    } catch (err) {
      toast.error("Failed to update discount");
      console.error(err);
    }
  };

  const filteredData = data
  .filter(item => (selectedDomain ? item.couponType === selectedDomain : true))
  .filter(item => (selectedStatus ? item.status === selectedStatus : true))
  .filter(item =>
    search
      ? (item.domain && item.domain.toLowerCase().includes(search.toLowerCase())) ||
        (item.couponType && item.couponType.toLowerCase().includes(search.toLowerCase()))
      : true
  )
  .sort((a, b) => {
    if (!filter) return 0;
    if (a[filter] < b[filter]) return -1;
    if (a[filter] > b[filter]) return 1;
    return 0;
  });

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/coupon/domain`,
        { newDomain }
      );
      if (response) {
        toast.success("New domain added");
        setAddNew(false);
        fetchDomains();
      }

    } catch (err) {
      toast.error("Failed to submit")
      console.log(err)
    }
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDomain((prevDomain) => ({
      ...prevDomain,
      [name]: value
    }));
  };
  const handledelete = async (id) => {
    try {

      const response = await axios.delete(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/coupon/domain/${id}`,
      );
      if (response) {
        toast.success("Domain deleted successfully");
        setOpen(false);
        fetchDomains();
      }

    } catch (err) {
      toast.error("Failed to delete")
      console.log(err)
    }
  }
  const handleUpdateMany = async () => {
    try {

      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/api/v1/coupon/updateDiscount`,
        { couponType: newDomain.couponType, discount: newDomain.discount }
      );
      if (response) {
        toast.success("Domain updated successfully");
        setOpen(false);
        fetchDomains();
      }

    } catch (err) {
      toast.error("Failed to update")
      console.log(err)
    }
  }
  return (
    <div className='p-4 relative'>
      <h1>Domain</h1>
      <div className='flex justify-between my-4'>
        <input type="text" className='rounded-full px-4 py-1' placeholder='Search domain...' value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className='flex gap-4'>
          <button className='text-center bg-black text-white rounded px-4 py-1' onClick={() => setUpdateMany(true)}>Update Many</button>
          <button className='text-center bg-black text-white rounded px-4 py-1' onClick={() => setAddNew(true)}>Add New</button>
        </div>

      </div>
      <table className="w-full">
        <thead className="w-full">
          <tr className="w-full bg-black text-white">
            <td className='p-2'>S.no</td>
            <td className='p-2' onClick={() => setFilter("couponType")}>
              <select className="border border-gray-300 p-2 rounded-md text-black appearance-none"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}>
                <option value="">Domain Type</option>
                <option value="itsector">IT Sector</option>
                <option value="school">School</option>
                <option value="college">College</option>
              </select>
            </td>
            <td className='p-2' onClick={() => setFilter("domain")}>
              <p className='bg-white text-black rounded px-4 py-[0.6rem] w-fit cursor-pointer'>Domain Name</p>
            </td>
            <td className='p-2' onClick={() => setFilter("discount")}>
              <p className='bg-white text-black rounded px-4 py-[0.6rem] w-fit cursor-pointer'>Discount on MRP</p>
            </td>
            <td className='p-2' onClick={() => setFilter("status")}>
              <select className="border border-gray-300 p-2 rounded-md text-black appearance-none"
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
            <tr key={index}>
              <td className='p-2'>{index + 1}</td>
              <td className='p-2 capitalize'>{item.couponType}</td>
              <td className='p-2'>{item.domain}</td>
              <td className='p-2'>{item.discount} %</td>
              <td className='p-2'>{item.status}</td>
              <td className='p-2'>
                <button className='border-2 border-green-400 hover:bg-green-400 rounded px-4 py-1' onClick={() => { setSelected(item); setOpen(true); }}>Action</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style} className="rounded flex flex-col gap-2">
          <p><span className='font-semibold'>Domain Type:</span> {selected?.couponType}</p>
          <p><span className='font-semibold'>Domain:</span> {selected?.domain}</p>
          <div>
            <span className='font-semibold'>Discount:</span>
            <input type="number" name="discount" value={discount || ""} className='border-2 px-2 rounded'
              onChange={(e) => { setDiscount(Number(e.target.value)); setSelected(prev => ({ ...prev, discount: Number(e.target.value) })) }}
            />
          </div>
          <div className='flex justify-evenly mt-4'>
            <button className='border-2 px-4 py-1 rounded bg-green-500 text-white' onClick={updateDiscount}>Update</button>
            <button className='border-2 px-4 py-1 rounded bg-red-500 text-white' onClick={() => handledelete(selected._id)}>Delete</button>
          </div>
        </Box>
      </Modal>
      <Modal open={addNew} onClose={handleClose}>
        <Box sx={style} className="rounded flex flex-col gap-2">
          <div className='flex justify-between gap-2'>
            <label className="font-medium" htmlFor="domainType">Domain Type</label>
            <select className="border w-60 border-gray-500 p-2 rounded-md text-black appearance-none"
              value={newDomain.domainType}
              name="couponType"
              onChange={handleChange}>
              <option value="">Domain Type</option>
              <option value="itsector">IT Sector</option>
              <option value="school">School</option>
              <option value="college">College</option>
            </select>
          </div>
          <div className='flex justify-between gap-2'>
            <label className="font-medium" htmlFor="domainType">Domain </label>
            <input type="text" name="domain" id="" value={newDomain.domain} onChange={handleChange} placeholder='Enter domain' className='border-gray-500 rounded border-2 w-60 p-2' />
          </div>
          <div className='flex justify-between gap-2'>
            <label className="font-medium" htmlFor="discount">Discount</label>
            <input type="number" name="discount" id="" placeholder='10' value={newDomain.discount} onChange={handleChange} className='border-gray-500 rounded border-2 w-60 p-2' />
          </div>
          <button onClick={handleSubmit} className='border-2 px-4 py-1 mt-3 rounded bg-black hover:scale-105 duration-300 text-white'>Submit</button>
        </Box>
      </Modal>
      <Modal open={updateMany} onClose={handleClose}>
        <Box sx={style} className="rounded flex flex-col gap-2">
          <div className='flex justify-between gap-2'>
            <label className="font-medium" htmlFor="domainType">Domain Type</label>
            <select className="border w-60 border-gray-500 p-2 rounded-md text-black appearance-none"
              value={newDomain.domainType}
              name="couponType"
              onChange={handleChange}>
              <option value="">Domain Type</option>
              <option value="itsector">IT Sector</option>
              <option value="school">School</option>
              <option value="college">College</option>
            </select>
          </div>

          <div className='flex justify-between gap-2'>
            <label className="font-medium" htmlFor="discount">Discount</label>
            <input type="number" name="discount" id="" placeholder='10' value={newDomain.discount} onChange={handleChange} className='border-gray-500 rounded border-2 w-60 p-2' />
          </div>
          <button onClick={handleUpdateMany} className='border-2 px-4 py-1 mt-3 rounded bg-black hover:scale-105 duration-300 text-white'>Submit</button>
        </Box>
      </Modal>
    </div>
  );
};

export default Domain;
