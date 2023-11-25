
import { trpc } from "@/app/_trpc/client"
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import {  XAxis, YAxis,  ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';


interface ExerciseChartProps {
    exercise: string,
  
}


const ExerciseChart = ({exercise} : ExerciseChartProps) => {
    
    const {data, isLoading} = trpc.userChartData.useQuery({exercise})
    if(!exercise || !data) {
        return(
          <></>
        )
    }
    ///Calculating chart values
    const dailyData = data.map((workout) => {

      const sets = workout.sets.filter((set) => set.sets > 0)
      const volume = sets.reduce((sum, set) => sum + set.reps * set.weight * set.sets, 0)
      const workoutDate = workout.workout ?  format(new Date(workout.workout.date).getTime(), "eeee  dd/MM/yyyy"): ""
      return {
        date: workoutDate,
        volume: volume,
      }
    })

    if(dailyData.length < 3 ) {
      return (<div className="flex">Not enought data to create a chart. You need atleast 3 workouts which include the same movement to create a chart.</div>)
    }

    return(
      <>
        <h2 className="p-4 font-semibold text-3xl md:text-5xl">Total volume</h2>
        {!isLoading ? <ResponsiveContainer width="100%" height={350} className="pt-8">
          <LineChart  data={dailyData}>
            <XAxis
              dataKey="date" 
              fontSize={12}
              tickLine={false}
              />
            <YAxis
            dataKey="volume"
            fontSize={12}
            tickLine={false}      
              />
            <Tooltip />
            <Line type="monotone" dataKey="volume" stroke="blue" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer> :
        <div className="flex items-center">
          <Loader2 className="animate-spin">Fetching data...</Loader2>
        </div>}
      </>
    )
}

export default ExerciseChart