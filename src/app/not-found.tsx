import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex flex-col justify-center items-center min-h-screen gap-2 '>
      <h2 className='font-semibold text-3xl pb-4'>Page not found 😞</h2>
      <p>Could not find requested page</p>
      <Link href="/" className={buttonVariants({variant:"outline"})}>Return Home</Link>
    </div>
  )
}