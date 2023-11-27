import { Loader2 } from "lucide-react"




export default function Loading() {

    return (
        <div className="flex justify-items-center min-h-screen justify-center mx-auto p-4 max-w-7xl md:p-10">
             <Loader2 className="animate-spin">Creating workouts</Loader2>
        </div>
        
    )
}