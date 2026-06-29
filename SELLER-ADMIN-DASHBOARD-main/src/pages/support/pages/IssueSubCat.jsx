import { IoIosArrowForward } from "react-icons/io";
import Categ_comp from "../components/issueCategoryComponent/Categ_comp";
import MoreHelp from "../components/issueCategoryComponent/MoreHelp";
import Support from "../components/Support";
import data from "../data/data.json";
import { useLocation } from "react-router-dom";
import { BsReverseLayoutTextSidebarReverse } from "react-icons/bs";
import Header from "../../../layouts/Topbar";

const IssueSubCat = () => {
    const location=useLocation();
  return (
    <>
    <Header />
    <Support />
    <div className="m-4 ">
    <div>
          <div className="flex text-[12px] flex-row items-center space-x-2"><span>Help</span><span ><IoIosArrowForward/></span><span>{location.state.name}</span><span><IoIosArrowForward/></span><span>{location.state.title}</span></div>
      </div>
      <div className="w-full flex sm:flex-row flex-col">
        <div className="sm:w-[50vw] w-full m-4  border-blue-100 border-r-[5px]">
         <div className="text-black text-[18px] font-medium">{location.state.title}</div>
        </div>
        <div className="sm:w-[45vw] w-full sm:pt-8"><MoreHelp data={data} /></div>
      </div>
    </div>
  </>
  );
}

export default IssueSubCat;
