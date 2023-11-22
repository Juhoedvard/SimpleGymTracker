import { db } from "@/db";
import { Prisma } from "@prisma/client";

interface SetData {
  reps: number;
  sets: number;
  weight: number;
}

interface ExerciseData {
  userId: string;
  exerciseId: string;
  finished: boolean;
  sets: SetData[];
}

///Create testUser workouts
export async function CreateTestWorkouts(id: string) {

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
        
    ]

    const workoutCount = 60


    const workoutname = () => {

        const randomIndex1 = Math.floor(Math.random() * bodyparts.length)
        const BodyPart1 = bodyparts[randomIndex1]
        const remainingBodyParts = bodyparts.filter((part, index) => index !== randomIndex1)
        const randomIndex2 = Math.floor(Math.random() * remainingBodyParts.length)
        const BodyPart2 = remainingBodyParts[randomIndex2]

        return [BodyPart1.label, BodyPart2.label]
    }


    const workoutData = Array.from({ length: workoutCount }, (_, index) => {
      const testDate = new Date()
      testDate.setDate(testDate.getDate() + index)
      const name = workoutname()
      const workoutDay = name[0] + '/' + name[1]

    
      return {
        name: workoutDay,
        date: testDate,
        finished: true,
        userId: id,
      }
    })
    
    try {
      const result = await db.$transaction(async (tx) => {
        const createdWorkouts: Prisma.WorkOutCreateManyInput[] = workoutData.map((workout) => ({
          name: workout.name,
          date: workout.date,
          finished: workout.finished,
          userId: workout.userId,
        }))
      
        const createdWorkoutsResult = await tx.workOut.createMany({
          data: createdWorkouts,
        })
      
        if (createdWorkoutsResult) {
          console.log("Workouts created succesfully")
          return true
        } else {
          console.error("Something went wrong creating workouts")
          return false
        }
      })
      
      
    } catch (error) {
      console.error('Virhe tiedon tallennuksessa tietokantaan:', error)
      return false
    }
  
}    