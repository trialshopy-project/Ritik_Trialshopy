
import { Link } from "react-router-dom";
// import helpData from "../../data/moreHelp.json"

const MoreHelp = ({data}) => {
  return (
    <>
      <div className="m-4 " >
        <div className="">
            <div className="font-medium text-[16px]">Find More Help</div>
            {
                data.map((item)=>{
                    return(
                        <>
                        <div className="space-y-2">
                            <ul className="list-none">
                                <Link to=""><li key={item.id} className="my-1 text-gray-600 hover:text-blue-700 text-[14px]">{item.title}</li></Link>
                            </ul>
                        </div>
                        
                        </>
                    )
                })
            }
        </div>
      </div>
    </>
  );
}

export default MoreHelp;
