import React from "react";
import SearchBar from "./form.input";

export default function SearchForm(){
    return (
        <form className="flex flex-col w-2/3 md:w-1/2 self-center items-center justify-center mt-4">
            <div className="flex flex-col w-full items-start justify-center mt-4">
                <label className="self-start mb-1 xl:mb-4 text-base xl:text-4xl" htmlFor="building">Building*</label>
                <SearchBar 
                    lists={{"one": "test1", "two": "test2", "three": "test3"}}
                />
            </div>
            <div className="flex flex-col w-full items-start justify-center mt-4">
                <label  className="self-start mb-1 xl:mb-4 text-base xl:text-4xl" htmlFor="floor">Floor(Optional)</label>
                <input className="self-center w-full border-2 rounded-3xl border-black bg-transparent text-sm xl:text-3xl" list="floorlist" type="text" name="" id="" />
                <datalist id="floorlist">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </datalist>
            </div>
            <div className="flex flex-col w-full items-start justify-center mt-4">
                <label  className="self-start mb-1 xl:mb-4 text-base xl:text-4xl"  htmlFor="Room">Room*</label>
                <input className="self-center w-full border-2 rounded-3xl border-black bg-transparent text-sm xl:text-3xl" list="roomlist" type="text" name="" id="" />
                <datalist id="roomlist">
                    <option value="101">101</option>
                    <option value="201">201</option>
                    <option value="301">301</option>
                </datalist>
            </div>
            <button className="rounded-3xl bg-p_border px-5 py-1 mt-8">Let's go</button>
        </form> 
    )
}