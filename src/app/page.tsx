import Link from "next/link";
import MaxWidthWrapper from "../components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";



export default function Home() {


  return (
    <>
    <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center">
      <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
        Start your gym tracking now with <span className="text-blue-600">SimpleGymTracker</span>
      </h1>
      <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
        SimpleGymTracker works as training diary. You can keep track of your gym progress including what weighs you have used and how many sets you have done. You can also get an access to charts about your workouts
      </p>
      <Link className={buttonVariants({
        size: 'lg',
        className: "mt-5"
      })}href='/SignUp'>
        Start Tracking
      </Link>
    </MaxWidthWrapper>

    <div className="mx-auto mb-32 mt-32 max-w-5xl sm:mt-56">
      <div className="mb-12 px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="mt-2 font-bold text-4xl text-gray-900 sm:text-5xl">Start tracking your progress</h2>
        </div>
      </div>
       <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
        <li className="md:flex-1">
          <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl:0 md:pt-4">
            <span className="text-sm font-medium text-blue-600">Step 1</span>
            <span className="text-xl font-bold">Sign up for an account</span>
            <span className="mt-2 text-zinc-700">You can sign up using your google account or a create an account with your email</span>
          </div>
        </li>
        <li className="md:flex-1">
          <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl:0 md:pt-4">
            <span className="text-sm font-medium text-blue-600">Step 2</span>
            <span className="text-xl font-bold">Select your training movements</span>
            <span className="mt-2 text-zinc-700">You can choose your training movements from existing list or add your own movements</span>
          </div>
        </li>
        <li className="md:flex-1">
          <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl:0 md:pt-4">
            <span className="text-sm font-medium text-blue-600">Step 3</span>
            <span className="text-xl font-bold">Select your training movements</span>
            <span className="mt-2 text-zinc-700">You can choose your training movements from existing list or add your own movements</span>
          </div>
        </li>
        <li className="md:flex-1">
          <div className="flex flex-col space-y-2 border-l-4 border-zinc-300 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl:0 md:pt-4">
            <span className="text-sm font-medium text-blue-600">Step 4</span>
            <span className="text-xl font-bold">Start tracking your progress</span>
            <span className="mt-2 text-zinc-700">Track your progress from session to session. You can find charts about your progress in your dashboard</span>
          </div>
        </li>

       </ol>
    </div>
    </>
  )
}
