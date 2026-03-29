import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUser, FiMail, FiMessageCircle, FiHash, FiCheckCircle } from "react-icons/fi";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import LOGO from "../assets/Logo PNG.png";

const ConfirmationPage = () => {
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [quantity, setQuantity] = useState("1");

    const image = location.state?.image || {
        url: null,
        title: "Untitled Design",
        description: "No description available",
        price: "0" // Defaulting to 0 if null
    };

    const SHOP_OWNER_WHATSAPP = "9853939706";
    const COUNTRY_CODE = "91";

    const CATEGORIES = [
        { id: "invitation", label: "Invitation Card" },
        { id: "customised_gift", label: "Customised Gift" },
        { id: "digital_print", label: "Digital Print" }
    ];

    const sendWhatsAppMessage = (orderData) => {
        const orderTypes = [
            { key: "invitation", label: "Invitation Card" },
            { key: "customised_gift", label: "Customized Gifts" },
            { key: "digital_print", label: "Digital Print" }
        ].filter(type => orderData[type.key]).map(type => type.label);

        const messageLines = [
            "🌟 *NEW PRINT ORDER* 🌟",
            "",
            "👤 *CUSTOMER DETAILS*",
            `Name: ${orderData.name}`,
            `WhatsApp: ${orderData.whatsapp}`,
            `Email: ${orderData.email || "N/A"}`,
            "",
            "📦 *ORDER INFO*",
            `Type: ${orderTypes.join(", ") || "General Printing"}`,
            `Quantity: ${orderData.quantity}`,
            `Design: ${orderData.designTitle}`,
            `Base Price: ₹${image.price || 'N/A'}`,
            "",
            "🖼️ *DESIGN REFERENCE*",
            orderData.designUrl ? orderData.designUrl : "No link provided",
            "",
            "✅ *Please confirm this order.*"
        ];

        const encodedMessage = encodeURIComponent(messageLines.join("\n"));
        const whatsappUrl = `https://wa.me/${COUNTRY_CODE}${SHOP_OWNER_WHATSAPP}?text=${encodedMessage}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const form = e.target;
            const orderData = {
                name: form.name.value.trim(),
                whatsapp: form.whatsapp.value.trim(),
                email: form.email.value.trim(),
                invitation: form.invitation.checked,
                customised_gift: form.customised_gift.checked,
                digital_print: form.digital_print.checked,
                quantity: quantity === "" ? 1 : Math.max(1, parseInt(quantity)),
                designTitle: image.title,
                designUrl: image.url || null
            };

            if (!orderData.name || !orderData.whatsapp) throw new Error("Required fields missing");

            sendWhatsAppMessage(orderData);
            toast.success("✅ Order confirmed! Opening WhatsApp...");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value.replace(/\D/g, "");
        setQuantity(value);
    };

    return (
        <div className="min-h-screen bg-[#FCFBF7] font-sans">
            <Header />
            
            <div className="pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Main Container */}
                    <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                        
                        {/* LEFT: DESIGN PREVIEW */}
                        <div className="md:w-5/12 bg-gray-50 p-8 flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-gray-100">
                            {/* Floating Price Tag */}
                            <div className="absolute top-6 right-6 z-10 animate-bounce">
                                <div className="bg-[#FF8C32] text-white px-6 py-2 rounded-full shadow-xl shadow-orange-200 border-2 border-white font-black text-lg">
                                    ₹{image.price || '0'} 
                                    <span className="text-[10px] font-medium block leading-none">Per Piece</span>
                                </div>
                            </div>

                            <div className="relative group w-full max-w-sm">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#3ABEF9] to-[#FF8C32] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                                <img
                                    src={image.url || "https://placehold.co/300x400?text=Design"}
                                    alt="Selected Design"
                                    className="relative w-full h-auto rounded-2xl shadow-2xl border-4 border-white transform transition duration-500 hover:scale-[1.02]"
                                />
                            </div>

                            <div className="mt-10 text-center space-y-2">
                                <h2 className="text-2xl font-black text-gray-800 tracking-tight uppercase">{image.title}</h2>
                                <p className="text-gray-400 font-medium italic text-sm px-4">{image.description}</p>
                            </div>
                        </div>

                        {/* RIGHT: ORDER FORM */}
                        <div className="md:w-7/12 p-8 lg:p-12 bg-white">
                            {/* Brand Header - UPDATED WITH BACKGROUND FOR LOGO */}
                            <div className="flex flex-col items-center mb-10">
                                {/* New Container for Logo */}
                                <div className="bg-gradient-to-r from-[#3ABEF9] to-[#29a7e0] p-4 rounded-2xl shadow-lg shadow-blue-200/50 mb-4">
                                    <img src={LOGO} alt="Brand Logo" className="h-12 w-auto drop-shadow-sm" />
                                </div>
                                
                                <div className="h-1 w-12 bg-[#3ABEF9] rounded-full"></div>
                                <h3 className="mt-4 text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Confirm Your Selection</h3>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-[#3ABEF9] uppercase ml-1">Your Full Name</label>
                                        <div className="relative">
                                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="text" name="name" required className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#3ABEF9]/20 focus:bg-white outline-none transition-all font-semibold" placeholder="John Doe" />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-[#3ABEF9] uppercase ml-1">WhatsApp Number</label>
                                        <div className="relative">
                                            <FiMessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="tel" name="whatsapp" required className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#3ABEF9]/20 focus:bg-white outline-none transition-all font-semibold" placeholder="91XXXXXXXXXX" />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-[#3ABEF9] uppercase ml-1">Email (Optional)</label>
                                        <div className="relative">
                                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="email" name="email" className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#3ABEF9]/20 focus:bg-white outline-none transition-all font-semibold" placeholder="alex@example.com" />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-[#3ABEF9] uppercase ml-1">Order Quantity</label>
                                        <div className="relative">
                                            <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF8C32]" />
                                            <input 
                                                type="text" 
                                                inputMode="numeric" 
                                                value={quantity} 
                                                onChange={handleQuantityChange} 
                                                onBlur={() => quantity === "" && setQuantity("1")}
                                                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#FF8C32]/20 focus:bg-white outline-none transition-all font-black text-[#FF8C32]" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Category Selection */}
                                <div className="pt-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-4 h-[1px] bg-gray-300"></span> Select Service Type <span className="w-4 h-[1px] bg-gray-300"></span>
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {CATEGORIES.map((item) => (
                                            <label key={item.id} className="relative flex items-center justify-center cursor-pointer group">
                                                <input type="checkbox" id={item.id} name={item.id} className="peer hidden" />
                                                <div className="w-full py-3 px-2 text-center rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-500 font-bold text-xs uppercase tracking-tighter peer-checked:border-[#3ABEF9] peer-checked:bg-blue-50 peer-checked:text-[#3ABEF9] transition-all duration-300">
                                                    {item.label}
                                                </div>
                                                <FiCheckCircle className="absolute top-[-5px] right-[-5px] text-[#3ABEF9] bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="pt-6">
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting} 
                                        className="group relative w-full bg-gradient-to-r from-[#FF8C32] to-[#FFA500] text-white py-5 rounded-2xl font-black text-lg tracking-widest uppercase transition-all duration-300 shadow-[0_10px_30px_rgba(255,140,50,0.3)] hover:shadow-[0_15px_40px_rgba(255,140,50,0.4)] hover:-translate-y-1 active:scale-95 disabled:grayscale"
                                    >
                                        <span className="flex items-center justify-center gap-3">
                                            {isSubmitting ? "Generating Order..." : "Finalize on WhatsApp"}
                                            {!isSubmitting && <FiMessageCircle className="text-2xl group-hover:rotate-12 transition-transform" />}
                                        </span>
                                    </button>
                                    <p className="text-center text-[10px] text-gray-400 mt-4 font-medium italic">
                                        Clicking confirm will open WhatsApp to share details with us.
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop theme="colored" />
        </div>
    );
};

export default ConfirmationPage;