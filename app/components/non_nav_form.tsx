import { useFetcher, useLoaderData } from '@remix-run/react'

import React from 'react'

export const NonNavForm = () => {
  const { number } = useLoaderData()
  const newNumberFetcher = useFetcher()

  return (
    <div className="w-full flex flex-row items-center text-yellow-300 font-bold text-2xl justify-center mb-10 border-4 border-yellow-400 p-2">
      <newNumberFetcher.Form method="post" className="w-full">
        <div className="flex flex-row text-center justify-between">
          <button
            name="_action"
            value="decrease"
            className="rounded-xl w-1/4 bg-red-300 font-semibold text-red-900 px-16 py-2 transition duration-300 ease-in-out hover:bg-red-400 hover:translate-y-1"
          >
            Decrease
          </button>
          <div className="w-1/2">{`Some Number: ${number}`}</div>
          <button
            name="_action"
            value="increase"
            className="rounded-xl w-1/4 bg-green-300 font-semibold text-green-900 px-16 py-2 transition duration-300 ease-in-out hover:bg-green-400 hover:translate-y-1"
          >
            Increase
          </button>
        </div>
      </newNumberFetcher.Form>
    </div>
  )
}
