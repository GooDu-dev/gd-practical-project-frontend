'use client'
import React, { useState, useRef, useEffect } from "react";
import formServices, {Room, Building, Floor} from "./form.services";
import common from "@/utils/common";
 
export default function SearchBar({
    lists,
    onFocus,
    onBlur,
} : {
    lists: Room[] | Building[] | Floor[],
    onFocus?: (...args: any) => void,
    onBlur?: (...args: any) => void
}) {

    const [input_value, setInputValue] = useState<string>('')
    const [input_id, setInputID] = useState<string>('')
    const [dropdown_visible, setDropDownVisible] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleInputChange = (event: any) => {
        setInputID(event.target.getAttribute('data-id'))
        setInputValue(event.target.value)
    }

    const handleInputFocus = () => {
        inputRef.current && inputRef.current.focus()
        setDropDownVisible(true)
    }

    const handleInputOnBlur = (event: any) => {
        setTimeout(()=>{
            setDropDownVisible(false)
            if(onBlur) onBlur(event.target.getAttribute("data-id"))
        }, 150)
    }

    return (
        <>
            <div className="relative w-full border-2 rounded-3xl border-black flex justify-center items-center">
                <input 
                    className="self-center w-4/5 bg-transparent text-sm xl:text-3xl focus:outline-none" 
                    type="text"
                    ref={inputRef}
                    value={input_value}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputOnBlur}
                    placeholder="Select Option"
                    data-id={input_id}
                />
                <button 
                    type="button" 
                    className="self-center w-1/12 min-w-fit"
                    onClick={handleInputFocus}
                >
                    <svg 
                        className="-mr-1 h-5 w-5 text-gray-400" 
                        viewBox="0 0 20 20" 
                        fill="currentColor" 
                        aria-hidden="true"
                    >
                    <path 
                        fillRule="evenodd" 
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" 
                        clipRule="evenodd" 
                    />
                    </svg>
                </button>
                {
                    dropdown_visible && (
                        <ul className="absolute w-full border-2 border-black bg-white rounded-b-3xl top-full left-0 z-10">
                            {
                                lists && lists.length > 0 && (
                                    lists
                                        .filter( list => list.name.includes(input_value) )
                                        .map( ele => {
                                            return <li 
                                                key={common.encode(ele.id)}
                                                className="w-4/5 mx-auto hover:bg-p_bg focus:bg-p_bg bg-white"
                                                onClick={event => {
                                                    setInputID(common.encode(ele.id))
                                                    setInputValue(ele.name)
                                                }}  
                                                data-id={common.encode(ele.id)}
                                            >{ele.name}</li>
                                        })
                                )
                            }
                        </ul>
                    )
                }
            </div>
        </>
    )
}