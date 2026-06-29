
import { FaSearch } from 'react-icons/fa';
import Category_box from './Category_box';
import data from "../data/data.json";
import { BsReverseLayoutTextSidebarReverse } from 'react-icons/bs';
import Categ_box from './Categ_box';
import moreData from "../data/moreHelp.json"


const MainCatogary = () => {
  return (
    <>
      <div className='m-4'>
        <div className='flex w-full px-4 justify-normal'>
            <div className='font-semibold text-[18px] mr-auto'>Select Issue Category</div>
            <div className="relative flex items-center justify-end">
            <FaSearch className="absolute text-gray-500 left-3" />
            <input
                type="text"
                placeholder="Search for issues or question"
                className="pl-10 py-2 border rounded-md w-full sm:w-[30vw] focus:outline-none focus:ring-1 focus:ring-black"
            />
        </div>
        </div>

        {/* category */}
        <div className='m-4'>
            <div className='grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2'>
                <Category_box data={data} name={"Returns/RTO & Exchange"} logo={<BsReverseLayoutTextSidebarReverse/>}/>
                <Category_box data={moreData} name={"hello"} logo={<BsReverseLayoutTextSidebarReverse/>}/>
                <Category_box data={data} name={"Returns/RTO & Exchange"}  logo={<BsReverseLayoutTextSidebarReverse/>}/>
            </div>
        </div>

        {/* category -2  */}
        <div className='m-4'>
            <div className='grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2'>
                <Categ_box title={"Payments"} logo={<BsReverseLayoutTextSidebarReverse/>}/>
                <Categ_box title={"Inventory"} logo={<BsReverseLayoutTextSidebarReverse/>}/>
                <Categ_box title={"Account"} logo={<BsReverseLayoutTextSidebarReverse/>}/>
                <Categ_box title={"Instant Cash"} logo={<BsReverseLayoutTextSidebarReverse/>}/>
                <Categ_box title={"Advertisements"} logo={<BsReverseLayoutTextSidebarReverse/>}/>
                <Categ_box title={"Others"} logo={<BsReverseLayoutTextSidebarReverse/>}/>
            </div>
        </div>
      </div>
    </>
  );
}

export default MainCatogary;
