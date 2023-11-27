/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "../ui/dialog"
import React from "react"
import { Button } from "@/components/ui/button"
import {  Check, Loader2, Plus} from "lucide-react"
import { Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { TooltipContent } from "@radix-ui/react-tooltip"
import { trpc } from "@/app/_trpc/client"
import { Exercise} from "@prisma/client"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useToast } from "../ui/use-toast"
import AddSet from "./AddSet"


interface ExerciseProps  {

    exercise: Exercise
    finished : boolean
    workoutExerciseID: string
}

const AddExercise = ({exercise, finished, workoutExerciseID} : ExerciseProps) => {

    const [finish, setFinished] = useState<boolean>(finished)
    const [open, setOpen] = useState<boolean>(false)
    const [sets, setSets] = useState<number>(3)
    const [reps, setReps] = useState<{[index : number] :{reps: number, weight: number, finished: boolean}}>({})
    const {toast} = useToast()

    useEffect(() => {
        if(open) {
            handleOpenDialog()
        }
    }, [open])
    ///Fetch sets from localstorage if sets exist
    const handleOpenDialog = () => {
        if(open){
        const localSets = window.localStorage.getItem(`${workoutExerciseID}name${exercise.name}sets`)
        if (localSets === null || parseInt(localSets) < 1) {
            setSets(3)
        }
        else {
            setSets(JSON.parse(localSets))
        } 
        const localReps: {[index: number]: {reps: number, weight: number, finished: boolean}} = {}
        for (let i = 0; i < sets; i++) {
            const rep = window.localStorage.getItem(`${workoutExerciseID}name${exercise.name}set${i}`)
            if (rep !== undefined && rep !== null && rep !== "undefined") {
                localReps[i] = JSON.parse(rep)
                }
          }
        setReps(localReps)
        }
      }
  ///Save to db
  const {mutate, isLoading: finishingExercise} = trpc.finishExercise.useMutation({
        onSuccess: () =>{
            setOpen(false)
            setFinished(true)
        },
        onError: (error) => {       
                return toast({
                variant: "destructive",
                title: `Something went wrong! Make sure that you have applied weight and reps for each set`
            })             
        }
    })
    ///Add rep
    const updateRep = (index: number, updatedValue: number) => {
        setReps((prevReps) => {
          const updatedReps = { ...prevReps }
          if (!updatedReps[index]) {
            updatedReps[index] = { reps: 0, weight: 0, finished: false }
          }
          updatedReps[index].reps = updatedValue
          return updatedReps
        })
      }
    ///Add weight
    const updateWeight = (index: number, updatedValue: number) => {
    setReps((prevReps) => {
        const updatedReps = { ...prevReps }
        if (!updatedReps[index]) {
        updatedReps[index] = { reps: 0, weight: 0, finished: false }
        }
        updatedReps[index].weight = updatedValue
        return updatedReps
    })
    }
    ///Change set status to not finished
    const changesSet = (index: number) => {
        setReps((prevReps) => {
            const updatedFinished = {...prevReps}
            updatedFinished[index] = {...prevReps[index], finished: false}
            ///Change localstorage finished status to false
            window.localStorage.setItem(`${workoutExerciseID}name${exercise.name}set${index}`, JSON.stringify(updatedFinished[index]))
            return updatedFinished
    })
    }
    /// Add added rep to localstorage and validate that the user has given reps and weigh
    const addRep = (index: number, set : {reps: number, weight: number, finished: boolean}) => {
        if (set && !isNaN(set.reps) && set.reps > 0 && !isNaN(set.weight) && set.weight > 0) {
        setReps((prevReps) => {
            const updatedReps = { ...prevReps }
            updatedReps[index] = { ...updatedReps[index], finished: true }
            window.localStorage.setItem(`${workoutExerciseID}name${exercise.name}set${index}`, JSON.stringify(updatedReps[index]))
            return updatedReps;
         })
        }
        else{
            toast({
                variant: "destructive",
                title: "Please check your rep and weight values",
                description: "Weight and rep must be numbers and more than 0"
            })
        }
    }
    ///Add finished exercise to db.
    const finishExercise = () => {
        mutate({
            id: workoutExerciseID, 
            sets: Object.keys(reps).map((index) => ({
                sets: parseInt(index),
                reps: reps[parseInt(index)].reps,
                weight: reps[parseInt(index)].weight
              })),
        })
    }

    return (
        <Dialog open={open} onOpenChange={(visible) => {
            if(!visible) {
                setOpen(visible)
            }
        }}>
            <DialogTrigger onClick={() => {setOpen(true)} } asChild>
                <Button variant="outline" className="w-40" >{!finish ? "Start exercise" : <Check color="green" className="h-6 w-6"/>  }</Button>
            </DialogTrigger>
       
            <DialogContent style={{maxWidth: 450}} >  
             <TooltipProvider>          
                <DialogHeader>        
                    <DialogTitle className="font-bold ">{exercise.name}   </DialogTitle>               
                    <DialogDescription className="flex justify-between">
                        Add your sets and reps 
                            <Tooltip>
                                <TooltipTrigger asChild>                            
                                        <Plus className="w-4 h-4" onClick={() => {
                                            setSets(sets +1)
                                            window.localStorage.setItem(`${exercise.name}sets`, JSON.stringify(sets +1))
                                            }}/>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Add a new set
                                </TooltipContent>
                            </Tooltip>     
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col justify-evenly px-2 gap-4">
                    {Array(sets).fill(null).map((_, index)=> {
                        return(
                           <AddSet key={index} index={index} reps={reps} updateRep={updateRep} updateWeight={updateWeight} addRep={addRep} changesSet={changesSet} sets={sets} setSets={setSets}/> 
                        )
                })}
                    <DialogFooter className="flex justify-end pt-4">
                        {!finishingExercise ?
                        <Button variant="outline" className=" text-blue-600 hover:transform hover:text-blue-600 hover:scale-110" onClick={() => finishExercise()} >
                            Finish exercise
                        </Button>
                        : <Loader2 className="w-4 h-4 animate-spin"/>}
                    </DialogFooter>
                </div>
             </TooltipProvider>
            </DialogContent>
        </Dialog>
    )
}


export default AddExercise