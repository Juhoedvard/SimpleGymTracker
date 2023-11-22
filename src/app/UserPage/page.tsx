import { RemoveTestWorkouts } from "@/CreateTestUserData/Removetestworkouts"
import { CreateTestWorkouts } from "@/CreateTestUserData/createtestworkouts"
import Dashboard from "@/components/Dashboard"
import { db } from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"


const UserPage = async () => {
    const { getUser } = getKindeServerSession()
    const user = getUser()

    if (!user || !user.id) redirect('/auth-callback?origin=UserPage')

    const dbUser = await db.user.findFirst({
        where: {
            id: user.id
        }
    })

    if(!dbUser) redirect('/auth-callback?origin=UserPage')
    
    return (
        <div>
            <Dashboard/>
        </div>
    )
}

export default UserPage