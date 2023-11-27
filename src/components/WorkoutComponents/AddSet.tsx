import { Check, X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"


type AddSetProps = {
    index: number,
    reps: { [index: number]: { reps: number, weight: number, finished: boolean } },
    updateRep: (index: number, updatedValue: number) => void,
    updateWeight: (index: number, updatedValue: number) => void,
    addRep: (index: number, set: { reps: number, weight: number, finished: boolean }) => void,
    changesSet: (index: number) => void,
    sets: number,
    setSets: React.Dispatch<React.SetStateAction<number>>,
    handleRemoveSet: () => void
}

const AddSet = (props : AddSetProps)  => {

    const {addRep, reps, updateWeight, updateRep, index, changesSet, sets, handleRemoveSet} = props
    return(
            <div>
                <Label className="w-fit border-b border-b-slate-400 ">Set {index +1}:</Label>
                <div className="flex justify-between">
                    {reps[index]?.finished === false ||  reps[index]?.finished === undefined ? 
                    <div className="flex gap-2">
                            <div className="flex flex-col items-center gap-2">
                               <Label className="w-20" >Weight (kg):</Label>
                                <Input size={2} className="text-center w-20"placeholder={`0`} value={reps[index]?.weight || ""} onChange={(e) =>updateWeight(index, parseInt(e.target.value) )} required={true}  type="number" min={1}></Input>
                            </div>
                            <div className="flex flex-col items-center justify-evenly gap-2">
                                <Label className="w-20">Reps:</Label>
                                <Input size={2} className="text-center w-20"placeholder={`0`} value={reps[index]?.reps || ""} onChange={(e) =>updateRep(index, parseInt(e.target.value) )} required={true}  type="number" min={1}></Input>
                            </div>

                            <div className="flex items-end">
                            <Button variant="default"  onClick={() => addRep(index, reps[index])}>Add</Button> 
                            </div>
                    </div> :
                    <div className="flex  items-center justify-evenly gap-2 ">
                        <div className="flex flex-col ">
                            <Label>Weight (kg): </Label>
                            <span> {reps[index].weight}</span>
                        </div>
                        <div className="flex flex-col">
                            <Label className="w-20">Reps: </Label>
                            <span> {reps[index].reps} </span>
                        </div>
                 
                        
                    <Button variant={"ghost"} onClick={() => changesSet(index)}><Check color="green" /></Button>
                    </div>
                
                    }
                    {index === sets -1 && 
                    <Tooltip>
                        <TooltipTrigger asChild>         
                                <X className="w-4 h-4" onClick={handleRemoveSet}/> 
                                    
                        </TooltipTrigger>
                        <TooltipContent>                                             
                                Remove last set
                        </TooltipContent>
                    </Tooltip>
                    }
                </div>     
            </div>
    )
}

export default AddSet