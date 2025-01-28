import Dashboard from "@/components/Dashboard"
import { db } from "@/db"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"



const UserPage = async () => {

    const { getUser } =  getKindeServerSession()
    const user = await getUser()
    console.log("Täällä", user)
    if (!user || !user.id) redirect('/auth-callback?origin=UserPage')
        console.log("No user")
    const dbUser = await db.user.findFirst({
        where: {
            id: user.id
        }
    })

    if(!dbUser) redirect('/auth-callback?origin=UserPage')
    
    return (
        <div>
            <Dashboard userId={user.id}/>
        </div>
    )
}

export default UserPage