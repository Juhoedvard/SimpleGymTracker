"use client"

import SelectChartExercises from "@/components/ChartComponents/SelectChartExercises"
import { Button } from "@/components/ui/button"
import { useState } from "react"

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
  

const Charts = () => {

    const [animate, setAnimate] = useState<boolean>(false)
    const [selectedBodypart, setSelectedBodyPart] = useState<string>('')
    const [selected, setSelected] = useState<{ [index: number]: boolean }>(() => {
        const initialState: { [index: number]: boolean } = {}
        bodyparts.forEach((_, index) => {
          initialState[index] = false
        })
        return initialState
      })

    const getExercise = (index: number, bodypart: string) => {
        setSelected((prevSelected) => {
            const updatedBoolean = { ...prevSelected }
            if(updatedBoolean[index]){
              setSelectedBodyPart("")
          }
            Object.keys(updatedBoolean).forEach((key) => {
              updatedBoolean[parseInt(key)] = false
            })
            updatedBoolean[index] = !selected[index]
        
            return updatedBoolean
          })
        setAnimate(true)
        setSelectedBodyPart(bodypart)
    }
    
    return (
        <main className="mx-auto max-w-7xl p-4 md:p-10">
               <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
                 <h1 className="mb-3 font-bold text-5xl text-blue-600">Charts</h1>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex pt-4">
                        {bodyparts.map((b, index) => {
                            return (
                                <div key={index}>
                                    <Button onClick={() => getExercise(index, b.label)} variant={selected[index] ? "default" : "ghost"} className={!animate ? "animate-bounce" : "" }size={"lg"}>
                                        {b.label}
                                    </Button>  
                                </div>        
                            )
                        })}
                    </div>
                    <div>
                       <SelectChartExercises bodypart={selectedBodypart}/> 
                    </div>     
                </div>
        </main>
    )
}
export default Charts