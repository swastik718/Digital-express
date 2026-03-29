

import { Link } from 'react-router-dom';
import { useState } from 'react';
import APP_LOGO from "../assets/Logo PNG.png";


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="w-full fixed top-0 z-50 py-2 w-[10%]">
            <nav className="bg-gradient-to-r from-sky-400 to-sky-300 fixed top-0 left-0 right-0 z-50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* ⬆ Increased vertical padding */}
                    <div className="flex justify-between items-center py-2 md:py-6">

                        {/* Logo */}
                        <div className="flex-shrink-0 transition-transform hover:scale-105 duration-300">
                            <img
                                className="w-60 cursor-pointer object-cover"   
                                src={APP_LOGO}
                                alt="Company Logo"
                            />
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex space-x-6 lg:space-x-8">
                            <button className="bg-gradient-to-r cursor-pointer from-orange-200 to-orange-500 text-white font-semibold px-7 py-4 rounded-xl shadow-md hover:shadow-xl hover:from-orange-400 hover:to-orange-100 transform hover:-translate-y-1 transition-all duration-300 border-2 border-orange-400">
                                <i className="fa-solid fa-phone"></i> <span>Call Now</span>
                            </button>

                            <Link to={"https://wa.me/919853939706"}>
                                <button className="bg-white cursor-pointer text-orange-600 font-semibold px-7 py-4 rounded-xl shadow-md hover:shadow-xl hover:bg-orange-50 transform hover:-translate-y-1 transition-all duration-300 border-2 border-orange-500">
                                    💬 Message Now
                                </button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-orange-600 bg-white p-3 rounded-lg shadow-md hover:bg-orange-50 transition-colors duration-300"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMenuOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    <div
                        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-56 pb-5' : 'max-h-0'
                            }`}
                    >
                        <div className="flex flex-col space-y-4 px-2">
                            <button className="bg-gradient-to-r from-orange-200 to-orange-400 text-white font-semibold px-6 py-4 rounded-xl shadow-md hover:shadow-lg hover:from-orange-400 hover:to-orange-100 transition-all duration-300 border-2 border-orange-400 w-full">
                                <i className="fa-solid fa-phone"></i> <span>Call Now</span>
                            </button>

                            <Link to={"https://www.whatsapp.com/"}>
                                <button className="bg-white text-orange-600 font-semibold px-6 py-4 rounded-xl shadow-md hover:shadow-lg hover:bg-orange-50 transition-all duration-300 border-2 border-orange-500 w-full">
                                    💬 Message Now
                                </button>
                            </Link>
                        </div>
                    </div>

                </div>
            </nav>
        </header>

    );
};

export default Header;