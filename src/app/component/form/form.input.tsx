'use client'
import React from "react";
 
export default function SearchBar({
    lists,
} : {
    lists: { [key: string]: string },
}) {
    
    return (
        <>
            <div className="relative w-full">
                <input className="self-center w-full border-2 rounded-3xl border-black bg-transparent text-sm xl:text-3xl" type="text" />
                <button type="button" className="absolute self-center right-0 top-0">
                    <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </>
    )
}