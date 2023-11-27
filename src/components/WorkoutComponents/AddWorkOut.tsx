"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormDescription,
  FormItem,
  FormLabel,

} from "@/components/ui/form"
import { ChevronLeftIcon, ChevronRightIcon, Loader2 } from "lucide-react"
import SelectExercises from "./SelectExercises"
import { trpc } from "@/app/_trpc/client"
import { useRouter } from "next/navigation"
import SelectBodyPart from "./SelectBodyPart"
import { useToast } from "../ui/use-toast"
import {  Set } from "@prisma/client"



type Exercise = {
    id: string
}

const bodyparts = [
  {
    id: "Chest",
    label: "Chest",
  },
  {
    id: "Back",
    label: "Back",
  },
  {
    id: "Legs",
    label: "Legs",
  },
  {
    id: "Arms",
    label: "Arms",
  },

] 

const FormSchema = z.object({
    bodyparts: z.array(z.string()).refine((value) => value.length > 0, {
        message: 'At least one bodypart must be selected',
      }),
})
type AddWorkoutprops = {
    workoutId?: string,
    bodypart?: string,
    workoutExercises?: workoutExercises[]
}
type workoutExercises = {
    id: string
    workoutId: string
    exerciseId: string
    finished: boolean
    exercise: Exercise 
    sets: Set[]
  }
const AddWorkOut = ({workoutId, bodypart, workoutExercises}: AddWorkoutprops) => {

    const [open, setOpen] = useState<boolean>(false)
    const [slideState, setSlideState] = useState<number>(!bodypart ? 1 : 2)
    const [workoutSaved, setWorkoutSaved] = useState<boolean>(false)
    const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>(!bodypart ?[] : [bodypart])
    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])
    const router = useRouter()
    const {toast} = useToast()

    ///Create a new workout to db
    const {mutate, isLoading: startingWorkout} = trpc.startWorkOut.useMutation({
        onSuccess: (id) =>{
            setOpen(false)
            router.push(`/UserPage/${id}`)
        }
    })
    const {mutate: AddExercise, isLoading: AddExerciseLoading} = trpc.addExercises.useMutation({
        onSuccess: () => {
                setOpen(false)
                router.refresh() 
        }
    })

    ///Save user's workout to db
    const {mutate:saveWorkout, isLoading:savingWorkout} = trpc.saveWorkout.useMutation({
        onSuccess: () => {
            setWorkoutSaved(true)
        }
    })
    ///Save user's workout to db
    const saveChosenWorkout = () => {

        const workoutname = selectedMuscleGroups.join("/")
        saveWorkout({name: workoutname, exercise:selectedExercises})
    }

    const form = useForm({
      resolver: zodResolver(FormSchema),
    })
    
    ///Submit form and start a workout
    function onSubmit() {
        const workoutname = selectedMuscleGroups.join("/")
        mutate({name: workoutname, exercise: selectedExercises })
        setSelectedExercises([])
        setWorkoutSaved(false)
    }
    return (
        <Dialog open={open} onOpenChange={(visible) => {
            if(!visible) {
                setOpen(visible)
            }
            }}>
            <DialogTrigger onClick={() => setOpen(true)} asChild>
                <Button size={workoutId ? "lg" : "sm"}>{!workoutId ? "Start a new workout" : "Add exercise"}</Button>
            </DialogTrigger>
       
            <DialogContent >            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                 { slideState === 1 ?  (
                    <SelectBodyPart bodyparts={bodyparts} form={form} setSelectedMuscleGroups={setSelectedMuscleGroups}/>
                 ) : slideState === 2 && (
                        <FormItem>
                             <div className="mb-4">
                                <FormLabel className="flex w-full justify-between text-base pr-5 pt-5 ">
                                    Workout           
                                    </FormLabel>
                                <FormDescription > 
                                    Select your exercises.                                      
                                </FormDescription>
                            </div>
                            <div className={selectedMuscleGroups.length < 2 ? "flex items-start" : "flex justify-evenly"}>
                            {selectedMuscleGroups.map((muscle) => (
                                <SelectExercises key={muscle} bodypart = {muscle} selectedExercises={selectedExercises} workoutExercises={workoutExercises}/>
                            ))}
                            </div>
                        </FormItem>
                    )}

                    {bodypart ? !AddExerciseLoading && workoutId ? <Button variant="default" type="button" onClick={() => AddExercise({id: workoutId, exercise: selectedExercises})}>Add</Button> : <Loader2 className="animate-spin w-4 h-4"/> : 
                     <div className={slideState === 1 ? "flex w-full justify-end px-4" : "flex w-full justify-between px-5"}>
                        {slideState !== 1 && 
                            <Button variant="outline" size="icon" type="button"
                            onClick={() => setSlideState(slideState -1)}
                            >
                                <div className="w-4 h-4">
                                <ChevronLeftIcon />
                                </div>
                            </Button>
                        
                            } 
                        {slideState === 1 && (        
                            <Button variant="outline" size="icon" type="button"
                                onClick={() =>{form.formState.isValid ?  setSlideState(slideState +1) :  toast({title:"Please choose atleast one bodypart to continue.", variant:"destructive"})}}
                                >
                                <div className="w-4 h-4">
                                    <ChevronRightIcon />
                                </div>
                            </Button>
                            ) 
                        }
                        {slideState === 2 &&  !startingWorkout ?
                         <div className="flex gap-2 pr-4">
                            {!savingWorkout ?<Button variant="outline" type="button" disabled={workoutSaved} onClick={saveChosenWorkout}>Save workout</Button> : <div className="flex justify-center items-center"><Loader2 className="animate-spin w- h-4"></Loader2></div>}
                            <Button variant="default" type="submit">Start your workout</Button>
                        </div> 
                        :(
                            startingWorkout && (
                                <Loader2 className="animate-spin">Starting workout...</Loader2>
                            )
                        )}
                    </div> }
                </form>
            </Form>
        </DialogContent>
    </Dialog>
    )
}

export default AddWorkOut