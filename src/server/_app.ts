import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { router, publicProcedure, privateProcedure} from "./trpc";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";



export const appRouter = router({
    authCallback: publicProcedure.query( async () => {
        const {getUser} = getKindeServerSession()
        const user = getUser()

        if(!user.id || !user.email){
            throw new TRPCError({code: "UNAUTHORIZED"})
        }
        const dbUser = await db.user.findFirst({
            where: {
                id: user.id
            }
        })

        if (!dbUser) {
            await db.user.create({
                data: {
                    id: user.id,
                    email: user.email,
                }
            })
        }
        
        return {success: true}

    }),

    getUserWorkouts: privateProcedure
    .query(async ({ctx}) => {
        const {userId} = ctx 
        const userWorkouts =  await db.workOut.findMany({
            where: {
                userId: userId
            },
            include: {
                WorkoutExercises: true,
              },
            orderBy: {
                date: "desc"
            }
        })
        if(!userWorkouts) throw new TRPCError({code: "NOT_FOUND"})
        else {
            return userWorkouts
        }

    }),
    getExercises: publicProcedure
        .input(z.object({bodypart: z.string()}))
        .query(async({input}) => {
            const exercises =  db.exercise.findMany({
                 where : {
                gategory: input.bodypart
            }
            })
            if (!exercises) throw new TRPCError({code: 'NOT_FOUND'})
            else {
            return exercises
        }                   
    }),

    startWorkOut: privateProcedure

        .input(z.object({
            name: z.string(),
            exercise: z.array(z.object({
                id: z.string()
            })) 
        }))
        .mutation(async ({ctx, input}) => {

            const newWorkout = await db.workOut.create({
                data: {
                  name: input.name,
                  userId: ctx.userId,
                  WorkoutExercises: {
                    createMany: {
                        data:  input.exercise.map((exerciseData) => ({
                            userId: ctx.userId,
                            exerciseId: exerciseData.id
                      })),
                    }
                  },
                },
              })
              return newWorkout
        }),
    saveWorkout: privateProcedure
        .input(z.object({
            name: z.string(),
            exercise: z.array(z.object({
                id: z.string()
            }))
        }))
        .mutation(async ({ctx, input}) => {
            await db.savedWorkout.create({
                data: {
                    name: input.name,
                    userId: ctx.userId,
                    exercises: {
                      connect: 
                          input.exercise.map((exerciseData) => ({
                              id: exerciseData.id
                        })),
                      }
                    },
                  
            })
        }),
    finishExercise: privateProcedure
        .input(z.object({
            id: z.string(),
            sets: z.array(z.object({
                reps: z.number().min(1, {message: "You must have done atleast one rep"}),
                weight: z.number().min(1, {message: "Please add your weight"}),
                sets: z.number()
            }))
        }))
        .mutation(async ({input}) => {

            const finishedExercise = await db.workoutExercises.update({
                where : {
                    id: input.id
                },
                data: {
                    finished: true,
                    sets: {
                        create:  input.sets.map((set) => ({
                            reps: set.reps,
                            sets: set.sets,
                            weight: set.weight
                        }))       
                    }
                },
                include:{
                    sets: true
                }
            })
            if(finishedExercise.sets.length < 1) throw new TRPCError({code: "INTERNAL_SERVER_ERROR"})
            return finishedExercise
        }),

    finishWorkout: privateProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({input}) => {
        const finishedWorkout = await db.workOut.update({
            where : {
                id : input.id
            },
            data: {
                finished: true,

                }
        })
        if (!finishedWorkout) throw new TRPCError({code: "INTERNAL_SERVER_ERROR"})
        revalidatePath("/UserPage")
        return finishedWorkout
            

    }),
    userChartData: privateProcedure
    .input(z.object({exercise: z.string()}))
    .query(async ({ input, ctx }) => {
      const chartExercises = await  db.workoutExercises.findMany({
        where: {
          userId: ctx.userId,
          exercise: {
            name : input.exercise
          }
        },
        select : {
            sets: true,
            workout: {
                select: {
                    date: true
                }
            }
        }
      })
      if(!chartExercises) throw new TRPCError({code: "NOT_FOUND"})
      else{
        return chartExercises
    }
    
      
    }),

})
    
export type appRouter = typeof appRouter