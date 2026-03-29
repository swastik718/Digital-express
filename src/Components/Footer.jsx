import APP_LOGO from "../assets/Logo PNG.png"

const Footer = () => {
    return (
        <>

            <div className="flex flex-col bg-sky-400 justify-center items-center gap-2 p-10">
                <div >
                    <img className="w-100" src={APP_LOGO} alt="" />
                </div>

                <div className="flex flex-col md:flex md:flex-row md:gap-32 mt-10  items-center  ">
                    <div className="  md:order-2">
                        <div className="flex items-center flex-col  p-2 rounded-lg  cursor-pointer my-4 text-white   ">
                            <i class="fa-solid fa-location-dot"></i>
                            <p>Odisha,Berhampur,Ganjam</p>
                            <i class="fa-solid fa-envelope"></i>
                            <p>digitalxpress1990@gmail.com</p>
                        </div>
                    </div>
                    <div className=" md:order-1">
                        <div className=" ">
                            <div className="flex items-center bg-orange-500 p-2 rounded-lg text-sky-50 cursor-pointer my-4 gap w-36 ">
                                <i class="fa-brands fa-instagram"></i>
                                <span>Instagram</span>
                            </div>
                            <div className="flex items-center bg-orange-500 p-2 rounded-lg text-sky-50 cursor-pointer my-4 gap w-36 ">
                                <i class="fa-brands fa-facebook"></i>
                                <span>Facebook</span>
                            </div>
                        </div>
                    </div>
                    <div className="  md:order-3">
                        <div >
                            <div className="flex items-center bg-orange-500 p-2 rounded-lg text-sky-50 cursor-pointer my-4 gap w-36 ">
                                <i class="fa-brands fa-whatsapp"></i>
                                <span><a href="https://wa.me/919853939706" target="_blank" rel="noopener noreferrer">WhatsApp</a></span>
                            </div>
                            <div className="flex items-center bg-orange-500 p-2 rounded-lg text-sky-50 cursor-pointer my-4 gap w-36 ">
                                <i class="fa-solid fa-phone"></i>
                                <span><a href="tel:+919853939706">Phone Call</a></span>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-black-400">
                        © {new Date().getFullYear()} Digital Express •
                        <a
                            href="https://codesewa.in/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white-500 hover:text-gray-700"
                        >
                            Developed by CodeSewa
                        </a>
                    </p>
                </div>

            </div>

        </>
    )
}
export default Footer