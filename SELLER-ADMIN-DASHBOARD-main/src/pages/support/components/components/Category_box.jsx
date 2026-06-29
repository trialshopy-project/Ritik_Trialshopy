// import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
// import data from "../data/data.json";


const Category_box = ({data,name,logo}) => {
  const navigate = useNavigate();
  const logoIdentifier = "BsReverseLayoutTextSidebarReverse";

  const handleClick = () => {  
      navigate(`/support`, { state: { data, name, logoIdentifier } });
  };
  const handleButton = (title) => {  
    navigate(`/support/issue`, { state: { data, name, logoIdentifier,title } });
};
  return (
    <>
      <div>
        <div className="border-gray-500 border-[1px] m-2 rounded-md ">
          <div className="flex flex-row p-2 space-x-2">
            <div className="flex items-center">{logo}</div>
            <div className="text-black text-[14px] font-semibold">{name}</div>
          </div>
          <div>
            {
              data.slice(0,3).map((item)=>{
                  return(
                    <>
                    <button onClick={()=>handleButton(item.title)} className="flex items-center justify-between w-full p-2 hover:bg-slate-200 hover:text-blue-600">
                      <div key={item.id}>{item.title}</div>
                       <div className="flex "><IoIosArrowForward className=""/></div>
                    </button>
                    </>
                  )
              })
            }
          </div>
          <div className="flex flex-row p-2 space-x-2">
            <button onClick={handleClick} className="text-blue-500 text-[14px] pl-2 font-semibold">View All</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Category_box;
