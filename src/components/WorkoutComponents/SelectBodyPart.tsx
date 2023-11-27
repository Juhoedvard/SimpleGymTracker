import { Checkbox } from "@/components/ui/checkbox"
import { FormField, FormItem, FormControl, FormLabel, FormMessage, FormDescription } from "../ui/form"
import { UseFormReturn } from "react-hook-form"


type SelectBodyPartProps = {
    bodyparts: {
        id: string,
        label: string
    }[]
    form: UseFormReturn,
    setSelectedMuscleGroups: React.Dispatch<React.SetStateAction<string[]>>
}


const SelectBodyPart = ({bodyparts, form, setSelectedMuscleGroups}: SelectBodyPartProps) => {

    return (
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
            { bodyparts.map((item) => (
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
        />
    )
    
}

export default SelectBodyPart