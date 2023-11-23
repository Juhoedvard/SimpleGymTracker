import { type ClassValue, clsx } from "clsx"
import { Metadata } from "next"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string)  {
  if (typeof window !== "undefined") return path
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}${path}`
  return `https://localhost:${process.env.PORT ?? 3000}${path}`
}


export function constructMetadata({

  title = "SimpleGymTracker",
  description ="SimpleGymTracker is a simple way keep track of your gym progress.",
  image = "",
  icons ="",
  noIndex = false
} : {
  title?: string,
  description? : string,
  image?: string,
  icons?: string,
  noIndex?: boolean
} = {}): Metadata {
  return{
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image
        }
      ]
    },
    icons,
    metadataBase: new URL("https://simple-gym-tracker.vercel.app"),
    themeColor: "#FFF",
    ...(noIndex && {
      robots: {
        index: false,
        follow: false
      }
    })
  }
}