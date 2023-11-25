"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ChevronLeftIcon, ChevronRightIcon, Loader2 } from "lucide-react"
import SelectExercises from "./SelectExercises"
import { trpc } from "@/app/_trpc/client"
import { useRouter } from "next/navigation"

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

] as const

const FormSchema = z.object({
  bodyparts: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

const AddWorkOut = () => {

    const [open, setOpen] = useState<boolean>(false)
    const [slideState, setSlideState] = useState<number>(1)
    const [workoutSaved, setWorkoutSaved] = useState<boolean>(false)
    const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([])
    const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])
    const router = useRouter()

    const {mutate, isLoading: startingWorkout} = trpc.startWorkOut.useMutation({
        onSuccess: (newWorkout) =>{
            setOpen(false)
            router.push(`/UserPage/${newWorkout.id}`)
        }
    })

    const {mutate:saveWorkout, isLoading:savingWorkout} = trpc.saveWorkout.useMutation({
        onSuccess: () => {
            setWorkoutSaved(true)
        }
    })

    const saveChosenWorkout = () => {

        const workoutname = selectedMuscleGroups.join("/")
        saveWorkout({name: workoutname, exercise:selectedExercises})
    }
    
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
    })
    
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
                <Button size={"sm"}>Start a new workout</Button>
            </DialogTrigger>
       
            <DialogContent>            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                 { slideState === 1 ?  (
                 <FormField
                    control={form.control}
                    name="bodyparts"
                    render={() => (
                        <FormItem>
                        <div className="mb-4">
                            <FormLabel className="text-base">     
                                   Workout
                            </FormLabel>
                            <FormDescription>
                            Select the bodyparts you are doing in the workout.
                            </FormDescription>
                        </div>
                        {bodyparts.map((item) => (
                            <FormField
                            key={item.id}
                            control={form.control}
                            name="bodyparts"
                            render={({ field }) => {
                                return (
                                <FormItem
                                    key={item.id}
                                    className="flex flex-row bodyparts-start space-x-3 space-y-0"
                                >
                                    <FormControl>
                                    <Checkbox
                                        checked={Array.isArray(field.value) && field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                            const newValue = Array.isArray(field.value) ? [...field.value] : []
                                            if (checked) {
                                            newValue.push(item.id)
                                            } else {
                                            const index = newValue.indexOf(item.id)
                                            if (index !== -1) {
                                                newValue.splice(index, 1)
                                            }
                                            }
                                            setSelectedMuscleGroups(newValue)
                                            field.onChange(newValue)
                                        }}
                                    />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal">
                                    {item.label}
                                    </FormLabel>
                                </FormItem>
                                )
                            }}
                            />
                        ))}
                        <FormMessage />
                        </FormItem>
                    )}
                    />) : slideState === 2 && (
                        <FormItem>
                             <div className="mb-4 ">
                                <FormLabel className="flex w-full justify-between text-base pr-5 pt-5 ">
                                    <h3>
                                        Workout
                                    </h3>             
                                    </FormLabel>
                                <FormDescription > 
                                    Select your exercises.                                      
                                </FormDescription>
                            </div>
                            <div className={selectedMuscleGroups.length < 2 ? "flex items-start" : "flex justify-evenly"}>
                            {selectedMuscleGroups.map((muscle) => (
                                <SelectExercises key={muscle} bodypart = {muscle} selectedExercises={selectedExercises}/>
                            ))}
                            </div>
                        </FormItem>
                    )}

                    <div className={slideState === 1 ? "flex w-full justify-end" : "flex w-full justify-between"}>
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
                                onClick={() => setSlideState(slideState +1)}
                                >
                                <div className="w-4 h-4">
                                    <ChevronRightIcon />
                                </div>
                            </Button>
                            ) 
                        }
                        {slideState === 2 &&  !startingWorkout ? <div className="flex gap-2">
                            {!savingWorkout ?<Button variant="outline" type="button" disabled={workoutSaved} onClick={saveChosenWorkout}>Save workout</Button> : <div className="flex justify-center"><Loader2 className="animate-spin w- h-4"></Loader2></div>}
                            <Button variant="default" type="submit">Start your workout</Button>
                        </div> : (
                            startingWorkout && (
                                <Loader2 className="animate-spin">Starting workout...</Loader2>
                            )
                        )}
                    </div>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
    )
}

export default AddWorkOut