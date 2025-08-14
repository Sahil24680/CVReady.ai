'use client'
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-lg font-black text-red-800 text-center">
      <h2 className="text-2xl mb-4">Homepage failed!</h2>
      <button
        onClick={() => reset()}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
  
}