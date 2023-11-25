"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog"
import React from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { trpc } from "@/app/_trpc/client"
import { useRouter } from "next/navigation"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import { useToast } from "../ui/use-toast"



type StartExistingWorkoutProps = {
    savedWorkouts: SavedWorkout[]
}
type SavedWorkout = {
    id: string
    name: string
    userId: string
    exercises : {
        id: string             
        name: String             
        gategory: String
    }[]
}
  

const StartExistingWorkout = ({savedWorkouts} : StartExistingWorkoutProps) => {

    console.log(savedWorkouts)
    const [open, setOpen] = useState<boolean>(false)
    const [SelectedWorkout, setSelectedWorkout] = useState<SavedWorkout[] | null>(null)
    const [selectSavedWorkout, setSelectSavedWorkout] = useState<SavedWorkout | null>(null)
    const [selected, setSelected] = useState<{ [id: string]: boolean }>({})
    const {toast} = useToast()
    const router = useRouter()
    const {mutate, isLoading: startingWorkout} = trpc.startWorkOut.useMutation({
        onSuccess: (newWorkout) => {
            setOpen(false)
            router.push(`/UserPage/${newWorkout.id}`)
        }
    })
    const ChooseWorkout = (SavedWorkout: SavedWorkout) => {
      
        setSelectSavedWorkout(SavedWorkout)
        setSelected((prevSelected) => {
            const updatedBoolean = { ...prevSelected }

            Object.keys(updatedBoolean).forEach((key) => {
              updatedBoolean[key] = false
            })
            updatedBoolean[SavedWorkout.id] = !selected[SavedWorkout.id]
        
            return updatedBoolean;
          })

    }
    
    const StartWorkout = () => {
        if(selectSavedWorkout){
            const exercises = selectSavedWorkout.exercises.map((e) =>({id:  e.id}))
        mutate({
            name: selectSavedWorkout?.name, exercise: exercises
        })
        }
        setSelectSavedWorkout(null)

    }


    return (
        <Dialog open={open} onOpenChange={(visible) => {
            if(!visible) {
                setOpen(visible)
            }
            }}>
            <DialogTrigger onClick={() =>{
                savedWorkouts.length > 0 ? setOpen(true) : toast({
                    title:"You don't have any saved workouts yet.",
                    description: "Click start a new workout button to create and save a workout"
                })
            } } asChild>
                <Button size={"sm"} >Start existing workout</Button>
            </DialogTrigger>
       
                <DialogContent >            
                    <DialogHeader>
                        <DialogTitle className="font-medium">Select your workout</DialogTitle>
                        <DialogDescription className="text-sm">Start one of your saved workouts.</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <ul className="flex flex-col mt-8 gap-6 divide-zinc-200">
                            {savedWorkouts.map((workout) => (
                                <Button variant={!selected[workout.id] ? "ghost" : "default"} key={workout.id} onClick={() => ChooseWorkout( workout)} className="divide-y divide-gray-200 rounded-lg  shadow transition hover:shadow-lg p-4 ">
                                    <p className="text-sm">{workout.name}</p>
                                </Button>
                            ))}
                            </ul>
                        </div>
                        <div>
                          {selectSavedWorkout ?  <div className="flex flex-col justify-center items-center mt-8 divide-y divide-gray-200 rounded-lg bg-white shadow transition p-6 w-[200px] h-[350px] ">
                            <h2 className="font-bold">Exercises:</h2>
                                {selectSavedWorkout.exercises.map((e,index) => (
                                    <div key={index} className="pt-4">
                                        {e.name}
                                    </div>
                                ))}   
                            </div>
                            : <div className="flex flex-col justify-center items-center mt-8 divide-y divide-gray-200 rounded-lg bg-white shadow transition p-4 w-[200px] h-[400px] "></div>}
                        </div>
                    </div>
                    <div className="flex justify-center pt-4" >
                        {!startingWorkout ?<div>
                            <Button variant="default" type="button" onClick={() => StartWorkout()}>Start your workout</Button>
                        </div> : (
                            startingWorkout && (
                                <Loader2 className="animate-spin">Starting workout...</Loader2>
                            )
                        )}
                        </div>
          
                </DialogContent>
        </Dialog>
    )
}

export default StartExistingWorkout