"use client"
import {  Exercise, WorkOut, Set } from "@prisma/client"
import AddExercise from "./AddExercise"
import { Button } from "../ui/button"
import { trpc } from "@/app/_trpc/client"
import { useRouter } from "next/navigation"
import { Loader2, X } from "lucide-react"
import { useToast } from "../ui/use-toast"

import { TooltipContent, TooltipProvider } from "@radix-ui/react-tooltip"
import { Tooltip, TooltipTrigger } from "../ui/tooltip"

import AddWorkOut from "./AddWorkOut"


type WorkOutOnProgressProps ={
    workout: WorkOut
    workoutExercises: workoutExercises[]
  }

type workoutExercises = {
    id: string
    workoutId: string
    exerciseId: string
    finished: boolean
    exercise: Exercise 
    sets: Set[]
  }
///router.refresh() is temporary fix until I figure out something beter
const WorkOutOnProgress = ({ workout, workoutExercises}: WorkOutOnProgressProps) => {

    const router = useRouter()
    const utils = trpc.useUtils()
    const {toast} = useToast()

    ///Finish workout
    const {mutate, isLoading: workOutLoading} = trpc.finishWorkout.useMutation({
        onSuccess: () => {
            localStorage.clear()
            utils.getUserWorkouts.invalidate()   
            router.push("/UserPage")
            return toast({
                title: "Workout finished, great job 🔥! "
            })
        },
        onError(error) {
            console.log(error)
            return toast({
                variant: "destructive",
                title: `Something went wrong ${error}`
            })
        },
    })
    const {mutate:removeExercise, isLoading: removeLoading} = trpc.removeExercise.useMutation({
        onSuccess: () => {
            router.refresh()
            toast({
                title:`Exercise removed succesfully`
            })
        }
    })
    ///Finish workout
    const finishWorkout = () => {
        mutate({id: workout.id })        
    }
    return(
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-1">
            {workoutExercises.map((e) => {
                return(
                <div key={e.id}>
                      <ul className="mt-8 grid grid-cols-1 gap-4 divide-zinc-200">
                        <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition lg pb-4">
                        <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                            <div className="flex-1 truncate">
                                <div className="flex items-center space-x-3">
                                    <h2 className=" font-semibold">{e.exercise.name}</h2>
                                </div>
                            </div>
                            <AddExercise exercise={e.exercise} finished={e.finished} workoutExerciseID={e.id}/>
                            <TooltipProvider>
                                 <Tooltip >
                                    <TooltipTrigger asChild>                            
                                        {!removeLoading ? <X className="w-4 h-4" onClick={() => removeExercise({id: e.id})}/> : <Loader2 className="animate-spin"/>}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Remove exercise
                                    </TooltipContent>
                             </Tooltip>     
                            </TooltipProvider> 
                        </div>            
                        </li>       
                      </ul>                         
                </div>
                )
            })}
            </div>
            <div className=" flex  justify-center items-center py-2 gap-4">
                <AddWorkOut workoutId={workout.id} bodypart={workout.name} workoutExercises={workoutExercises}/>
                {!workOutLoading ?
                <Button variant="outline" size={"lg"}  className="text-blue-600 hover:transform hover:text-blue-600 hover:scale-110" onClick={() => finishWorkout()}>Finish workout</Button> 
                : <Loader2 className="animate-spin">Finishing workout...</Loader2>    
                }
                
            </div>
        </div>      
    )
}

export default WorkOutOnProgress