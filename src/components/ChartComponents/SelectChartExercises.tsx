"use client"
import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import ExerciseChart from "./ExerciseChart";

interface ChartProps{
    bodypart: string
}

const SelectChartExercises = ({bodypart}: ChartProps) => {

    const [currentBodypart, setCurrentBodypart] = useState<string>("")

    const {data: exercises, isLoading} = trpc.getExercises.useQuery({bodypart}, {enabled: !!bodypart})
    
    const [selected, setSelected] = useState<{ [index: number]: boolean }>(() => {
        const initialState: { [index: number]: boolean } = {}
        exercises?.forEach((_, index) => {
          initialState[index] = false
        });
        return initialState
      })
    const [selectedExercise, setSelectedExercise] = useState<string>('')
    
      useEffect(() => {
        if(bodypart !== currentBodypart){
            setSelectedExercise("")
            setCurrentBodypart(bodypart)
            setSelected((prevSelected) => {
                const updatedBoolean = {...prevSelected}
                Object.keys(prevSelected).forEach((key) => {
                    updatedBoolean[parseInt(key)] = false;
                })
                return updatedBoolean;
            })
        
        }
      }, [bodypart, exercises])

    const selectChartData = (index: number, exercise: string) => {
        setSelected((prevSelected) => {
            const updatedBoolean = { ...prevSelected };
            if(updatedBoolean[index]){
                setSelectedExercise("")
            }

            Object.keys(updatedBoolean).forEach((key) => {
              updatedBoolean[parseInt(key)] = false
            })
            updatedBoolean[index] = !selected[index]
        
            return updatedBoolean;
          })
          setSelectedExercise(exercise)
    }

    
    return (
        <div className="flex flex-col md:flex-row ">
            <div className="flex-1 md:w-1/2 ">
                {!isLoading ? <div className="flex flex-col gap-2">
                    {exercises?.map((e, index) => {
                        return (
                            <div key={index} className="py-2">
                                <Button size={"sm"} variant={selected[index] ? "default" : "ghost"} onClick={() => selectChartData(index, e.name)}>
                                    {e.name}
                                </Button>
                                
                            </div>
                        )
                    })
                }
                </div> :
                <div className="fles justify-center items-center">
                    <Loader2 className="animate-spin"/>
                </div>  }
            </div>
            <div className="flex-2 justify-center items-center md:w-1/2 px-4">
                <ExerciseChart exercise={selectedExercise}/>
            </div>
        </div>     
    )
}
export default SelectChartExercises