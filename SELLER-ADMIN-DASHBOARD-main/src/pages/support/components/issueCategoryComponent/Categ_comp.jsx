import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import {  useLocation, useNavigate } from "react-router-dom";


const Categ_comp = () => {
    const location = useLocation();
    const navigate=useNavigate();
    const { data, name, logoIdentifier } = location.state || {};

    let logo;
    if (logoIdentifier === "BsReverseLayoutTextSidebarReverse") {
        logo = <BsReverseLayoutTextSidebarReverse />;
    }
    const handleClick = (title) => {
        navigate(`/support/issue`, { state: { name, title } });
    };
  return (
    <>
      <div className="m-4 border-blue-100 border-r-[5px]">
        
        <div className="flex flex-row space-x-2 mt-2  p-2">
            <div className="flex items-center">{logo}</div>
            <div className="text-black text-[18px] font-bold">{name}</div>
          </div>
        <div>
        {
              data.map((item)=>{
                  return(
                    <>
                    <button  onClick={() => handleClick(item.title)} className="w-full border-gray-200 border-b-[1px] flex justify-between hover:bg-slate-200 hover:text-blue-600 p-2 items-center">
                      <div key={item.index}>{item.title}</div>
                       <div className=" flex  "><IoIosArrowForward className=""/></div>
                    </button>
                    </>
                  )
              })
            }
        </div>
      </div>
    </>
  );
}

export default Categ_comp;
