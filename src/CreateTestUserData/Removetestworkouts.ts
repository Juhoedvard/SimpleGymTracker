
import { db } from "@/db";


export async function RemoveTestWorkouts(id: string) {

    ///Remove testworkouts if needed
    if(id){

        await db.workoutExercises.deleteMany({
            where: {
                userId: id
            }
        })
        await db.workOut.deleteMany({
            where: {
                userId: id
            }
        }), 

        await db.user.update({
            where: {
                id: id
            },
            data: {
                testUser: true
            }
        })
    }

    return console.log('removed')

    
}