"use client"

import { useEffect } from "react"
import { useRouter } from "@/i18n/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/0c1a619e-f8c5-f011-bbd3-000d3ab455bf")
  }, [router])

  return (
    <div className='w-full h-screen'>
      <p></p>
    </div>
  )
}
