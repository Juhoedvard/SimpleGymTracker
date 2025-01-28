import Link from "next/link"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { Button, buttonVariants } from "./ui/button"
import {RegisterLink, LoginLink, LogoutLink,} from "@kinde-oss/kinde-auth-nextjs/components";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server"
import { DropdownMenu,DropdownMenuItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"




const Navbar =  async ()  =>  {

    const { getUser } =  getKindeServerSession()
    const user = await getUser()
    return (
        <nav className="sticky h-14 inset-x-0 top-0 z-30  border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper>
                <div className="flex h-14 items-center w-full justify-between border-b border-zinc-200">
                    <Link href="/" className="flex z-40 font-semibold">
                        <span className="text-blue-600">SimpleGymTracker </span>
                    </Link>
                    <div className=" items-center space-x-4 flex">
                    <>
                        {!user ? <> 
                            <LoginLink className={buttonVariants({
                                variant: "ghost",
                                size: "sm"
                            })}>Sign in</LoginLink>
                            <RegisterLink className={buttonVariants({
                                size: "sm"
                            })}>Start now</RegisterLink>
                        </>
                    : user &&  <>
                        <Link href="/Charts"
                         className={buttonVariants({
                            variant: "ghost",
                            size: "sm",
                            className:"invisible md:visible"
                        })}>
                            Charts
                        </Link>
                        <Link href="/UserPage"
                        className={buttonVariants({
                            variant: "ghost",
                            size: "sm",
                            className:"invisible md:visible"
                        })}>
                            Dashboard
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost"><p className="truncate">Logged in as <span className="text-blue-600 ">{user.given_name}</span></p></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-52">
                                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem ><Link href="/UserPage">Dashboard</Link></DropdownMenuItem>
                                <DropdownMenuItem ><Link href="/Charts">Charts</Link></DropdownMenuItem>
                                <DropdownMenuItem ><LogoutLink>SignOut</LogoutLink></DropdownMenuItem>

                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                    }
                    </>
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar