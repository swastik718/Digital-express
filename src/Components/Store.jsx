import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase'; // Ensure this path matches your firebase config
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { FiShare, FiX, FiTag } from 'react-icons/fi';
import Header from "./Header";
import Footer from "./Footer";

const Store = () => {
    const [uploadedItems, setUploadedItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Fetch real-time data from Firestore
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const q = query(collection(db, 'uploads'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const items = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setUploadedItems(items);
            } catch (error) {
                console.error("Error fetching images:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    // 2. Flatten and filter images based on category
    const filteredImages = useMemo(() => {
        let list = [];
        uploadedItems.forEach(item => {
            if (activeCategory === "All" || item.category === activeCategory) {
                const urls = item.imageUrls || [];
                urls.forEach((url) => {
                    list.push({
                        url,
                        id: item.id,
                        category: item.category,
                        price: item.price,
                        title: item.category // Using category as title
                    });
                });
            }
        });
        return list;
    }, [uploadedItems, activeCategory]);

    const categories = ['Invitation', 'Customized Gift', 'Digital Print'];

    return (
        <div className="min-h-screen bg-[#FCFBF7]">
            <Header />
            
            <main className="pt-28 pb-12">
                {/* CATEGORY BUTTONS */}
                <div className="flex flex-wrap justify-center gap-4 py-8 px-4">
                    <button
                        onClick={() => setActiveCategory("All")}
                        className={`px-6 py-2 rounded-full text-xs font-black tracking-widest border-2 transition-all duration-300 ${
                            activeCategory === "All" 
                            ? "bg-[#3ABEF9] border-[#3ABEF9] text-white shadow-lg shadow-blue-100" 
                            : "bg-white border-gray-100 text-gray-400 hover:border-[#3ABEF9] hover:text-[#3ABEF9]"
                        }`}
                    >
                        ALL DESIGNS
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full text-xs font-black tracking-widest border-2 transition-all duration-300 ${
                                activeCategory === cat 
                                ? "bg-[#3ABEF9] border-[#3ABEF9] text-white shadow-lg shadow-blue-100" 
                                : "bg-white border-gray-100 text-gray-400 hover:border-[#3ABEF9] hover:text-[#3ABEF9]"
                            }`}
                        >
                            {cat.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* IMAGE GRID */}
                <div className="p-4 sm:p-6 lg:p-8">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3ABEF9]"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-[1600px] mx-auto">
                            {filteredImages.map((img, index) => (
                                <div 
                                    key={`${img.id}-${index}`}
                                    className="group relative bg-white p-2 rounded-2xl shadow-sm border border-gray-50 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                                    onClick={() => setSelectedImage(img)}
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-50">
                                        <img
                                            src={img.url}
                                            alt={img.category}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        
                                        {/* Price Tag Overlay - Brand Orange */}
                                        <div className="absolute top-3 right-3">
                                            <div className="bg-[#FF8C32] text-white px-3 py-1 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                                                <span className="text-[10px] font-black tracking-tighter">₹{img.price || '0'}</span>
                                            </div>
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute bottom-3 left-3">
                                            <span className="bg-white/90 backdrop-blur-md text-[#3ABEF9] text-[8px] font-black px-2 py-0.5 rounded-md uppercase border border-blue-50">
                                                {img.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Professional Price Footer */}
                                    <div className="mt-3 px-1 flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Starting from</p>
                                            <p className="text-[#FF8C32] font-black text-sm">₹{img.price || '0'}</p>
                                        </div>
                                        <p className="text-[8px] font-black text-gray-300 uppercase leading-none text-right">Per<br/>Piece</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && filteredImages.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 italic">No designs found in this category.</p>
                        </div>
                    )}
                </div>

                {/* IMAGE PREVIEW MODAL */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div 
                            className="relative bg-white p-3 rounded-[2rem] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl animate-in zoom-in-95 duration-300"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button 
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-6 right-6 z-10 bg-white shadow-xl text-gray-800 rounded-full p-2 hover:bg-[#3ABEF9] hover:text-white transition-all"
                            >
                                <FiX size={20} />
                            </button>

                            {/* Left: Image */}
                            <div className="md:w-1/2 bg-gray-50 rounded-2xl overflow-hidden">
                                <img
                                    src={selectedImage.url}
                                    alt="Preview"
                                    className="w-full h-full object-contain max-h-[50vh] md:max-h-full"
                                />
                            </div>

                            {/* Right: Info & Actions */}
                            <div className="md:w-1/2 p-8 flex flex-col justify-center">
                                <span className="text-[#3ABEF9] text-xs font-black uppercase tracking-[0.2em] mb-2">{selectedImage.category}</span>
                                <h2 className="text-2xl font-black text-gray-800 mb-4 tracking-tight uppercase">Premium Design Reference</h2>
                                
                                <div className="flex items-baseline gap-2 mb-8">
                                    <span className="text-3xl font-black text-[#FF8C32]">₹{selectedImage.price || '0'}</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase">per Piece</span>
                                </div>

                                <div className="space-y-4">
                                    <Link 
                                        to="/confirmation" 
                                        state={{ image: selectedImage }}
                                        className="flex items-center justify-center gap-3 w-full bg-[#FF8C32] text-white py-4 rounded-2xl font-black tracking-widest uppercase shadow-lg shadow-orange-100 hover:shadow-orange-200 transition-all active:scale-95"
                                    >
                                        <FiShare size={18} /> Proceed to Order
                                    </Link>
                                    <button 
                                        onClick={() => setSelectedImage(null)}
                                        className="w-full py-4 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                                    >
                                        Return to Gallery
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            
            <Footer />
        </div>
    );
};

export default Store;