import { Form, useNavigate, useSearchParams } from '@remix-run/react'
import React, { useState } from 'react'

import { SelectBox } from './selectBox'
import { sortOptions } from '../utils/constants'

export const SearchBar = () => {
  const [sortValue, setSortValue] = useState(sortOptions[0].value)
  const [filterValue, setFilterValue] = useState('')

  let [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const clearFilters = () => {
    searchParams.delete('filter')
    searchParams.delete('sort')
    setFilterValue('')
    navigate('/home')
  }

  return (
    <Form className="w-full px-6 flex items-center gap-x-4 border-b-4 border-b-blue-900 border-opacity-30 h-20">
      <div className="flex items-center w-2/5">
        <input
          type="text"
          name="filter"
          className="w-full rounded-xl px-3 py-2"
          placeholder="Search for a message or name"
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />

        <svg
          className="w-4 h-4 fill-current text-gray-400 -ml-8"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
        >
          <path
            fill="#000"
            fillRule="evenodd"
            d="M15.7 13.3l-3.81-3.83A5.93 5.93 0 0 0 13 6c0-3.31-2.69-6-6-6S1 2.69 1 6s2.69 6 6 6c1.3 0 2.48-.41 3.47-1.11l3.83 3.81c.19.2.45.3.7.3.25 0 .52-.09.7-.3a.996.996 0 0 0 0-1.41v.01zM7 10.7c-2.59 0-4.7-2.11-4.7-4.7 0-2.59 2.11-4.7 4.7-4.7 2.59 0 4.7 2.11 4.7 4.7 0 2.59-2.11 4.7-4.7 4.7z"
          />
        </svg>
      </div>
      <SelectBox
        className="w-full rounded-xl px-3 py-2 text-gray-400"
        containerClassName="w-40"
        name="sort"
        options={sortOptions}
        value={sortValue}
        onChange={(e) => setSortValue(e.target.value)}
      />
      <button
        type="submit"
        className="rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400 hover:translate-y-1"
      >
        Search/Filter
      </button>
      {filterValue && (
        <button
          type="submit"
          className="rounded-xl bg-red-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-red-400 hover:translate-y-1"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      )}
    </Form>
  )
}
