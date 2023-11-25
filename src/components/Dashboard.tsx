
import AddWorkOut from "./WorkoutComponents/AddWorkOut"
import Link from "next/link"
import { format } from "date-fns"
import { AlertTriangle, Check } from "lucide-react"
import { db } from "@/db"
import StartExistingWorkout from "./WorkoutComponents/StartExistingWorkout"

type DashboardProps = {
    userId: string
}
const Dashboard = async ({userId} : DashboardProps) => {
    
    const workouts = await db.workOut.findMany({
        where: {
            userId: userId
        },
        include: {
            WorkoutExercises: true,
          },
        orderBy: {
            date: "desc"
        }
    })
    const savedWorkouts = await db.savedWorkout.findMany({
        where: {
            userId: userId
        },
        include: {
            exercises: true
        }
    })
    console.log(savedWorkouts)
    return (
        <main className="mx-auto p-4 max-w-7xl md:p-10">
            <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                <h1 className="mb-3 font-bold text-5xl">Your workouts</h1>
                <div className="flex gap-2">
                    <AddWorkOut/>
                    <StartExistingWorkout savedWorkouts={savedWorkouts} />
                </div> 
            </div>

            {/*Show user's workouts */}

            {workouts && workouts.length > 0 ? (
                <div>
                    <ol className="mt-8 grid grid-cols-1 gap-6 divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
                        {workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((workout) => (
                            <li key={workout.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg pb-4 hover:bg-slate-200 ">
                                <Link href={`/UserPage/${workout.id}`} className="flex gap-2">
                                   <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                                    <div className="flex-1 truncate">
                                        <div className="flex items-center space-x-3">
                                            <h3 className="truncate text-lg font-medium ">{workout.name}</h3>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <p>{format(new Date(workout.date), "eeee  dd/MM/yyyy")}</p>
                                        {!workout.finished ?  <AlertTriangle color="blue"className="h-4 w-4 animate-bounce" />  : <Check color="green" className="h-6 w-6"/> }                                       
                                        </div> 
                                   </div>
                                </Link>
                            </li>
                        ))}
                    </ol>
                </div>
               ) :  (
                <div className="mt-16 flex flex-col items-center gap-2">
                    <h3 className="font-semibold text-xl">No workouts yet</h3>
                    <p>Start your first workout now!</p>
                </div>
                ) 
            }
        </main>
    )
}

export default Dashboard