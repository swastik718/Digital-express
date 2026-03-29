import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useRouteError } from "react-router-dom"
const ErrorComponent = () => {
    const err = useRouteError()
    console.log(err?.statusText);


    return (
        <>
            <div className="flex flex-col items-center h-lvh justify-center">
                <h1 className="text-6xl font-bold my-2">oops!</h1>
                <h1 className="text-2xl font-bold">{err?.status}</h1>
                <h2 className="text-2xl font-bold">{err?.statusText}</h2>
                <button className="p-2 text-center bg-green-700 text-white rounded-lg"> <Link to={useNavigate + "/"}>Go To Home </Link> </button>

            </div>
        </>
    )
}
export default ErrorComponent