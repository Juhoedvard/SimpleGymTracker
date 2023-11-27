"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { trpc } from "@/app/_trpc/client"
import { Loader2 } from "lucide-react"
import { Set } from "@prisma/client"


type bodypartProps = {
    bodypart: string 
    selectedExercises: Exercise[],
    workoutExercises?: workoutExercises[]

    }
type Exercise = {
    id: string

}
type workoutExercises = {
  id: string
  workoutId: string
  exerciseId: string
  finished: boolean
  exercise: Exercise 
  sets: Set[]
}
const SelectExercises = ({bodypart,  selectedExercises, workoutExercises} : bodypartProps) => {
  
  const {data: exercises, isLoading} = trpc.getExercises.useQuery({bodypart})
  console.log(workoutExercises)
  console.log(exercises)
  if (isLoading) return <Loader2 className="animate-spin h-4 w-4"></Loader2>

  const filteredExercises = exercises?.filter((e) => !workoutExercises?.some((we) => we.exerciseId === e.id))
  const newExercises = workoutExercises ? filteredExercises : exercises
  console.log(exercises)
  return (
        <FormField
          name="exercises"
          render={() => (
            <FormItem>
              <div className="flex w-full mb-4 justify-between">
                <FormLabel className="text-base">{bodypart}:</FormLabel>
              </div>
              
              {newExercises?.map((ex) => (
                <FormField
                  key={ex.id}

                  name="exercises"
                  render={({ field }) => {
                    return (
                      <div
                        key={ex.id}
                        className="flex flex-row exercises-start space-x-3 space-y-0"
                      >
                          <Checkbox
                            checked={Array.isArray(field.value) && field.value?.includes(ex.id)}
                            onCheckedChange={(checked) => {
                                const newValue = Array.isArray(field.value) ? [...field.value] : []
                                if (checked) {
                                newValue.push(ex.id);
                                } 
                                else {
                                const index = newValue.indexOf(ex.id)
                                  if (index !== -1) {
                                      newValue.splice(index, 1)
                                  }
                                }
                                selectedExercises.push({id: ex.id})
                                field.onChange(newValue)
                              }}
                          />
                        <FormLabel className="text-sm font-normal">
                          {ex.name}
                        </FormLabel>
                      </div>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
  )
}
export default SelectExercises