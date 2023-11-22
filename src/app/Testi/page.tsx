
import { ConnecSets, ConnectExercises } from "@/CreateTestUserData/ConnectExercises";
import { CreateTestWorkouts } from "@/CreateTestUserData/createtestworkouts";
import { RemoveTestWorkouts } from "@/CreateTestUserData/Removetestworkouts";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";


const Page = async () => {

    const {getUser} = getKindeServerSession()
    const user = getUser()
    if(user.id && user.given_name === "Testi"){
          /// await RemoveTestWorkouts(user.id)
            await CreateTestWorkouts(user.id)
            await ConnectExercises(user.id)
            await ConnecSets(user.id)
    }



    return (
        <main className="mx-auto p-4 max-w-7xl md:p-10">
        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
            <h1 className="mb-3 font-bold text-5xl">Creating your testworkouts</h1>
        </div>
        <div className="flex flex-col py-8 justify-center items-center ">

            <p>Created testworkouts or removed</p>
        </div>
        </main>
    )
}


export default Page