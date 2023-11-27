import Skeleton from "react-loading-skeleton"



export default function Loading() {

    return (
        <div className="mx-auto p-4 max-w-7xl md:p-10">
             <Skeleton height={100} className="my-2" count={3}/>
        </div>
        
    )
}