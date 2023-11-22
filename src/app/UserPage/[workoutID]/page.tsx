
import WorkOutOnProgress from "@/components/WorkoutComponents/WorkOutOnProgress"
import { db } from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { format } from "date-fns"
import { notFound, redirect } from "next/navigation"


interface WorkoutProps {
    params: {
        workoutID: string
    }
}

const Page = async ({params} : WorkoutProps) => {

    const {workoutID} = params
    console.log(workoutID)
    const {getUser} = getKindeServerSession()
    const user = getUser()

    if(!user || !user.id) redirect(`/auth-callback?origin=UsersPage/${workoutID}`)

    const workout = await db.workOut.findFirst({
        where: {
          id: workoutID,
        },
        include: {
          WorkoutExercises: {
            include: {
              sets : true,
              exercise: true
            }
          }
        },
      })
    const exercises = workout?.WorkoutExercises
    if (!workout) notFound()


    return ( 
        <main className="mx-auto max-w-7xl md:p-10">
                    <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center ">
                        <h1 className="mb-3 font-bold text-3xl md:text-5xl">{workout.name} day: </h1>
                        <p>{format(new Date(workout.date), "eeee  dd/MM/yyyy")}</p>
                    </div>
                    <div>
                    {workout.finished ?
                      <ul className="mt-8 flex flex-col gap-8 md:gap-4 sm:gap-2 divide-zinc-200 ">
                      {exercises && exercises.map((e) => {
                              return (
                                  <li key={e.id} className="flex divide-y divide-gray-200 rounded-lg bg-white shadow transition pb-4  ">
                                      <div className="py-6 px-6 flex flex-col md:flex-row w-full items-center space-x-6 gap-4">
                                          <div className="flex-1 truncate">
                                            <div className="flex items-center space-x-3">
                                              <h3 className="truncate text-lg font-medium pb-4 ">{e.exercise.name}</h3>
                                            </div>
                                          </div>
                                          {e.sets.map((s) => {
                                              return(
                                              <div key={s.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow  ">
                                                <div  className="flex flex-col justify-center items-center w-40 gap-4 p-4">
                                                    <p className="border-b">Set {s.sets +1}:</p>                
                                                    <p>{s.reps} reps </p>
                                                    <p>{s.weight} kg</p>
                                                </div>
                                              </div>
                                              )
                                          })
                                        }
                                    </div>
                                  </li>
    
                              )
                          })}
                      </ul> : exercises && 
                      <WorkOutOnProgress workout={workout} workoutExercises={workout.WorkoutExercises} />}
                    </div>
            </main>
            

    )
}

export default Page