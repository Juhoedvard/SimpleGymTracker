/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "../ui/dialog"

import React from "react"
import { Button } from "@/components/ui/button"
import {  Check, Loader2, Plus, X } from "lucide-react"
import { Tooltip, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { TooltipContent } from "@radix-ui/react-tooltip"
import { trpc } from "@/app/_trpc/client"
import { Exercise} from "@prisma/client"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { useToast } from "../ui/use-toast"
import { TRPCClientError } from "@trpc/client"




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

    const handleOpenDialog = () => {
        if(open){
        const localSets = window.localStorage.getItem(`${exercise.name}sets`)
        if (localSets === null || parseInt(localSets) < 1) {
            setSets(3)
        }
        else {
            setSets(JSON.parse(localSets))
        } 
        const localReps: {[index: number]: {reps: number, weight: number, finished: boolean}} = {}
        for (let i = 0; i < sets; i++) {
            const rep = window.localStorage.getItem(`${exercise.name}set${i}`)
            if (rep !== undefined && rep !== null && rep !== "undefined") {
                localReps[i] = JSON.parse(rep)
                }
          }
        setReps(localReps)
        }
      }

  const {mutate, isLoading: finishingExercise} = trpc.finishExercise.useMutation({
        onSuccess: () =>{
            setOpen(false)
            setFinished(true)
        },
        onError: () => {       
                return toast({
                variant: "destructive",
                title: `Something went wrong! Make sure that you have applied weight and reps for each set`
            })             
        }
    })

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

    const repFinished = (index: number) => {
        setReps((prevReps) => {
            const updatedFinished = {...prevReps}
            updatedFinished[index] = {...prevReps[index], finished: false}
            window.localStorage.setItem(`${exercise.name}set${index}`, JSON.stringify(updatedFinished[index]))
            return updatedFinished
    })
    }

    const addRep = (index: number, set : {reps: number, weight: number, finished: boolean}) => {
        if (!isNaN(set.reps) && set.reps > 0 && !isNaN(set.weight) && set.weight > 0) {
        setReps((prevReps) => {
            const updatedReps = { ...prevReps }
            updatedReps[index] = { ...updatedReps[index], finished: true }
            window.localStorage.setItem(`${exercise.name}set${index}`, JSON.stringify(updatedReps[index]))
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
                            <div key={index} className={reps[index]?.finished === undefined || reps[index]?.finished === false ? "flex flex-col gap-2" : "flex flex-col  gap-2"}>
                                <Label className="w-fit border-b border-b-slate-400 ">Set {index +1}:</Label>
                                <div className="flex justify-between">
                                    {reps[index]?.finished === false ||  reps[index]?.finished === undefined ? 
                                    <div className="flex gap-2">
                                            <div className="flex flex-col items-center justify-evenly gap-2">
                                                <Label className="w-20">Reps:</Label>
                                                <Input size={2} className="text-center w-20"placeholder={`0`} value={reps[index]?.reps || ""} onChange={(e) =>updateRep(index, parseInt(e.target.value) )} required={true}  type="number" min={1}></Input>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                            <Label className="w-20" >Weight (kg):</Label>
                                            <Input size={2} className="text-center w-20"placeholder={`0`} value={reps[index]?.weight || ""} onChange={(e) =>updateWeight(index, parseInt(e.target.value) )} required={true}  type="number" min={1}></Input>
                                            </div>
                                            <div className="flex items-end">
                                            <Button variant="default"  onClick={() => addRep(index, reps[index])}>Add</Button> 
                                            </div>
                                    </div> :
                                    <div className="flex  items-center justify-evenly gap-2 ">
                                        <div className="flex flex-col">
                                            <Label className="w-20">Reps: </Label>
                                            <span> {reps[index].reps} </span>
                                        </div>
                                        <div className="flex flex-col ">
                                            <Label>Weight (kg): </Label>
                                            <span> {reps[index].weight}</span>
                                        </div>
                                        
                                    <Button variant={"ghost"} onClick={() => repFinished(index)}><Check color="green" /></Button>
                                    </div>
                                
                                    }
                                    {index === sets -1 && 
                                    <Tooltip>
                                        <TooltipTrigger asChild>         
                                                <X className="w-4 h-4" onClick={() => {
                                                    setSets(sets -1)
                                                    window.localStorage.setItem("sets", JSON.stringify(sets -1))
                                                    }}/> 
                                                    
                                        </TooltipTrigger>
                                        <TooltipContent>                                             
                                                Remove last set
                                        </TooltipContent>
                                    </Tooltip>
                                    }
                                </div>     
                            </div>
                        )
                })}
                    <DialogFooter className="flex justify-end pt-4">
                        {!finishingExercise ?<Button variant="outline" className=" text-blue-600 hover:transform hover:text-blue-600 hover:scale-110" onClick={() => finishExercise()} >
                            Finish exercise
                        </Button> : <Loader2 className="w-4 h-4 animate-spin"/>}
                    </DialogFooter>
                </div>
             </TooltipProvider>
            </DialogContent>
        </Dialog>
    )
}


export default AddExercise