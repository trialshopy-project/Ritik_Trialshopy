import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom"; 

const Categ_box = ({title,logo}) => {
  const navigate=useNavigate();
  const handleClick=()=>{
    navigate(`/support/issue`,{state:{title}});
  }
  return (
    <>
    <div>
        <div className="border-gray-500 border-[1px] m-2 rounded-md ">
          <div className="flex flex-row space-x-2 "> 
          </div>
          <div>  
              <button onClick={handleClick} className="flex items-center justify-between w-full p-3 hover:bg-slate-200 hover:text-blue-600">
                <div className="flex flex-row items-center space-x-2">
                <div className="">{logo}</div>
                <div className="font-medium text-[16px]">{title}</div>
                </div> 
                    <div className="flex "><IoIosArrowForward className=""/></div>
                </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Categ_box;
