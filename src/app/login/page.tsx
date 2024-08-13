import SearchForm from "../component/form/form.component";

export default function LoginPage(){
    return (
        <>
            <div className="flex flex-col justify-center items-center h-1/2 my-auto">
                <h1 className="text-center text-2xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-7xl">Where do you wanna <span className="text-p_text font-bold">GO</span> ?</h1>
                {SearchForm()}
            </div>
        </>
    )
}