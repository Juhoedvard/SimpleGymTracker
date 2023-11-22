import { db } from "@/db";



///Connect workoutExercises to testUsers workouts
export async function ConnectExercises(id: string) {

    const workouts = await db.workOut.findMany({
        where: {
            userId: id
        }
    })
    const Exercises = await db.exercise.findMany()
    for (const workoutIndex in workouts) {
        const workout = workouts[workoutIndex]
        const filteredExercises = Exercises.filter((e) => workout.name.includes(e.gategory))
        const randomSelectedExercises = filteredExercises.sort(() => Math.random() - 0.5).slice(0, 4)
        const workoutExercisesWithSets = randomSelectedExercises.map((exercise) => {

            return {
                userId: id,
                exerciseId: exercise.id,
            }
        })
        
        const addExerciseWorkouts = await db.workOut.update({
            where: {
                id: workout.id 
            },
            data: {
                WorkoutExercises: {
                    createMany: {
                        data: workoutExercisesWithSets.map((we) => ({
                            userId: id,
                            exerciseId: we.exerciseId,
                            finished: true
                        })
                        )
                    }
                }
            }
        })
        if(addExerciseWorkouts){
             console.log("WorkoutExercises connected to workout succesfully")
        }
        else{
            console.log("Something went wrong adding workoutexercises to workout")
        }
       



    }
}

///Connect sets to testUsers workoutExercises

export async function ConnecSets(id: string) {

    const workoutExercises = await db.workoutExercises.findMany({
        where: {
            userId: id
        }
    })
    for (const index in workoutExercises){
        const workoutExercise = workoutExercises[index]
        const setsDataArray = []
        for(let i = 0; i < 4; i++){
            const setsData =  {
                reps: Math.floor(Math.random() * 17) + 2,
                sets: i,
                weight: Math.floor(Math.random() * 120) + 10,
            }
            setsDataArray.push(setsData)
        }


      const addedSets = await db.workoutExercises.update({
            where: {
                id: workoutExercise.id
            },
            data: {
                sets: {
                    createMany: {
                        data: setsDataArray.map((sets) => ({
                            reps: sets.reps,
                            sets: sets.sets,
                            weight: sets.weight
                        }))
                    }
                }
            }
        })
        if(addedSets){
            console.log("Sets added succesfully to workoutExercises succesfully")
        }
        else{
            console.log("Something went wrong adding sets to workouts")
        }
        
      

    }
      
}