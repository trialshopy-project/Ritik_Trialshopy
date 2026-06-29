import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import Topbar from '../../layouts/Topbar.jsx';
import { useNavigate } from 'react-router-dom';
const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '500px',
      padding: '20px',
      borderRadius: '8px', 
    },
  };

Modal.setAppElement('#root');

function AnsweredPage() {
    const navigate=useNavigate()
  const [tickets, setTickets] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [responseText, setResponseText] = useState('');
  const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`${apiEndpoint}/api/tickets/answered`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching answered tickets:', error);
      }
    };

    fetchTickets();
  }, [apiEndpoint]);

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setResponseText(ticket.ResponseFromAdmin);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedTicket(null);
    setResponseText('');
  };

  const handleResponseEdit = async () => {
    if (!responseText.trim()) return; 

    try {
      await axios.put(
        `${apiEndpoint}/api/tickets/${selectedTicket._id}`,
        { response: responseText },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setTickets(tickets.map(ticket => ticket._id === selectedTicket._id ? { ...ticket, ResponseFromAdmin: responseText } : ticket));
      closeModal();
    } catch (error) {
      console.error('Error editing response:', error);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      await axios.delete(`${apiEndpoint}/api/tickets/${ticketId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setTickets(tickets.filter(ticket => ticket._id !== ticketId));
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  return (
    <div>
      <div className='mt-16'>
        <Topbar />
      </div>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Answered Tickets</h1>
        <button className="text-2xl font-bold mb-4 bg-customPurple text-white bg-yellow-600 px-4 py-2 rounded-lg hover:bg-yellow-700" onClick={()=>navigate('/ticket')}>UnresolvedTickets</button>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr.No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Regarding</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem Statement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response From Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket, index) => (
                <tr key={ticket._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ticket.Issue_regarding}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{ticket.problem_statement}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ticket.Images && ticket.Images.map((img, idx) => (
                      <img key={idx} src={img} alt="Ticket" className="w-20 h-20 object-cover" />
                    ))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{ticket.ResponseFromAdmin}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => openModal(ticket)}
                      className="bg-yellow-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTicket(ticket._id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Edit Response"
        >
          <h2 className="text-lg font-bold mb-2">Edit Response</h2>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Edit your response here..."
          />
          <div className="flex justify-end">
            <button onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600">
              Cancel
            </button>
            <button onClick={handleResponseEdit} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Submit
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default AnsweredPage;
