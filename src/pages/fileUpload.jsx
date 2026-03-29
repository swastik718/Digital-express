import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  doc,
  query,
  orderBy,
  updateDoc
} from 'firebase/firestore';
import toast, { Toaster } from 'react-hot-toast';
import { 
  FiUploadCloud, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiFilter, 
  FiTrash2, 
  FiEdit2, 
  FiCheck 
} from 'react-icons/fi';
import JSZip from 'jszip';

const FileUploadAndSelect = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [price, setPrice] = useState('');
  const [uploading, setUploading] = useState(false);
  const [extractingZip, setExtractingZip] = useState(false);
  const [uploadedItems, setUploadedItems] = useState([]);
  
  // Viewing State
  const [viewCategory, setViewCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  // Editing State
  const [editingId, setEditingId] = useState(null);
  const [editPriceValue, setEditPriceValue] = useState('');

  const categories = ['Invitation', 'Customized Gift', 'Digital Print'];
  const uploadsRef = collection(db, 'uploads');

  const showPriceInput = selectedCategory === 'Invitation' || selectedCategory === 'Digital Print' || selectedCategory === 'Customized Gift';

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const q = query(uploadsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUploadedItems(items);
    } catch (error) {
      toast.error('Failed to load uploads');
    }
  };

  // --- COMPREHENSIVE FILE HANDLER (Images + ZIP) ---
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    e.target.value = null;

    const zipFile = files.find(file => file.name.toLowerCase().endsWith('.zip'));

    if (zipFile) {
      setExtractingZip(true);
      try {
        const zip = new JSZip();
        const contents = await zip.loadAsync(zipFile);
        const imageFiles = [];
        const mimeTypes = {
          jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
          gif: 'image/gif', webp: 'image/webp', bmp: 'image/bmp',
          tif: 'image/tiff', tiff: 'image/tiff'
        };
        
        const filePromises = [];
        contents.forEach((relativePath, zipEntry) => {
          if (!zipEntry.dir) {
            const extension = zipEntry.name.split('.').pop().toLowerCase();
            if (mimeTypes[extension]) {
              filePromises.push(
                zipEntry.async('blob').then(blob => {
                  imageFiles.push(new File([blob], zipEntry.name, { type: mimeTypes[extension] }));
                })
              );
            }
          }
        });
        
        await Promise.all(filePromises);
        if (imageFiles.length < 5) return toast.error('ZIP must contain at least 5 images');
        if (imageFiles.length > 30) return toast.error('ZIP max 30 images');
        setSelectedFiles(imageFiles);
      } catch (error) {
        toast.error('Failed to extract ZIP');
      } finally {
        setExtractingZip(false);
      }
    } else {
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tif', 'tiff'];
      const validImages = files.filter(file => {
        const ext = file.name.split('.').pop().toLowerCase();
        return validExtensions.includes(ext);
      });
      setSelectedFiles(prev => [...prev, ...validImages].slice(0, 30));
    }
  };

  // --- FILTERING & PAGINATION LOGIC ---
  const filteredImages = useMemo(() => {
    let list = [];
    uploadedItems.forEach(item => {
      //  CATEGORY FILTERING
      if (viewCategory === 'All' || item.category === viewCategory) {
        const urls = item.imageUrls || [];
        urls.forEach((url, index) => {
          list.push({
            url,
            id: item.id,
            index,
            category: item.category,
            price: item.price,
            allUrls: urls
          });
        });
      }
    });
    return list;
  }, [uploadedItems, viewCategory]);

  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const currentImages = filteredImages.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    const response = await axios.post('https://api.cloudinary.com/v1_1/drwukyfj6/image/upload', formData);
    return response.data.secure_url;
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0 || !selectedCategory) return toast.error('Select files and category');
    setUploading(true);
    const toastId = toast.loading('Uploading images...');

    try {
      const imageUrls = await Promise.all(selectedFiles.map(file => uploadToCloudinary(file)));
      await addDoc(uploadsRef, {
        imageUrls,
        category: selectedCategory,
        price: showPriceInput ? price : null,
        createdAt: serverTimestamp(),
      });
      toast.dismiss(toastId);
      toast.success('Upload Successful');
      setSelectedFiles([]);
      setPrice('');
      fetchUploads();
    } catch (error) {
      console.error("UPLOAD ERROR:", error);
      toast.dismiss(toastId);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSingleImageDelete = async (imgObj) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      const docRef = doc(db, 'uploads', imgObj.id);
      const newUrls = imgObj.allUrls.filter((_, i) => i !== imgObj.index);
      if (newUrls.length === 0) {
        await deleteDoc(docRef);
      } else {
        await updateDoc(docRef, { imageUrls: newUrls });
      }
      fetchUploads();
      toast.success('Image Deleted');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  // --- PRICE EDITING LOGIC ---
  const startEditing = (img) => {
    setEditingId(img.id);
    setEditPriceValue(img.price || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditPriceValue('');
  };

  const handleUpdatePrice = async (id) => {
    if (!editPriceValue) return toast.error('Please enter a price');
    
    try {
      const docRef = doc(db, 'uploads', id);
      await updateDoc(docRef, { price: editPriceValue });
      
      // Update local state to reflect change immediately
      setUploadedItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, price: editPriceValue } : item
        )
      );
      
      toast.success('Price updated');
      setEditingId(null);
    } catch (error) {
      toast.error('Failed to update price');
    }
  };
  

return (
  <div className="max-w-6xl mx-auto p-6 pt-10 space-y-10 font-sans bg-[#fffbf7]">
      
      <Toaster position="top-right" />

      {/* UPLOAD SECTION */}
      <section className="bg-white shadow-sm rounded-xl p-6 border border-orange-100 relative">
        <button onClick={() => { localStorage.removeItem('isLoggedIn'); window.location.href = '/admin'; }} className="absolute top-6 right-6 text-sm bg-red-50 text-red-500 px-3 py-1 rounded-lg hover:bg-red-100 transition">Logout</button>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Click to upload images (max 5) or ZIP file (5-30 images)</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {extractingZip ? (
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-cyan-200 bg-cyan-50 rounded-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan-500 mb-2"></div>
              <p className="text-sm text-cyan-600">Extracting ZIP contents...</p>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-cyan-300 bg-cyan-50/20 hover:bg-cyan-50 cursor-pointer rounded-xl transition-all">
              <input type="file" multiple accept=".jpg,.jpeg,.png,.webp,.zip,.tif,.tiff,.bmp,.gif" onChange={handleFileChange} className="hidden" />
             
              <FiUploadCloud className="w-10 h-10 text-cyan-400 mb-2" />
              <p className="text-sm font-semibold text-cyan-600">Select Images or ZIP</p>
              <p className="text-xs text-gray-400 mt-1">{selectedFiles.length} files selected</p>
            </label>
          )}

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Design Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)} 
                    
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      selectedCategory === cat 
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white border-orange-500 shadow-md' 
                        : 'bg-white text-orange-500 border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            
              <div className="animate-in fade-in slide-in-from-top-2">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">Price per Piece</p>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm">₹</span>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full border border-gray-200 rounded-lg pl-8 pr-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Enter amount" />
                </div>
              </div>
            
          </div>
        </div>

        
        <button 
          onClick={handleSubmit} 
          disabled={uploading || !selectedCategory || selectedFiles.length === 0} 
          className="w-full mt-6 bg-gradient-to-r from-orange-400 to-pink-500 text-white py-3.5 rounded-lg font-bold hover:shadow-lg hover:shadow-orange-200 disabled:opacity-50 disabled:shadow-none transition-all"
        >
          {uploading ? 'Processing Upload...' : `Confirm & Save ${selectedFiles.length > 0 ? `(${selectedFiles.length} items)` : ''}`}
        </button>
      </section>

      {/* GALLERY SECTION */}
      <section className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
          <div className="flex items-center gap-3">
            
            <div className="p-2 bg-cyan-500 rounded-lg shadow-md shadow-cyan-100"><FiFilter className="text-white" /></div>
            <h2 className="text-xl font-bold text-gray-800">Design Inventory</h2>
          </div>
            
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase">View Category:</span>
            <select 
              value={viewCategory}
              onChange={(e) => { setViewCategory(e.target.value); setCurrentPage(1); }}
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-cyan-500 outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div className="p-6">
          {currentImages.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-gray-400 text-lg">No designs found in <span className="font-bold text-gray-600">{viewCategory}</span></p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {currentImages.map((img, idx) => {
                const isPriceEditable = img.category === 'Invitation' || img.category === 'Digital Print' || img.category === 'Customized Gift';
                const isEditing = editingId === img.id;

                return (
                  <div key={`${img.id}-${idx}`} className="group relative aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
                    <img src={img.url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    
                    
                    <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-8 transition-opacity ${isEditing ? 'opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'}`}>
                      <p className="text-[10px] text-cyan-300 font-black uppercase tracking-widest leading-none mb-1">{img.category}</p>
                      
                      {isEditing ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input 
                            type="number" 
                            value={editPriceValue} 
                            onChange={(e) => setEditPriceValue(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-white/10 border border-white/30 rounded px-2 py-1 text-xs text-white placeholder-white/50 focus:outline-none focus:border-cyan-400"
                            placeholder="Price"
                            autoFocus
                          />
                          <button onClick={() => handleUpdatePrice(img.id)} className="text-green-400 hover:text-green-300"><FiCheck size={16} /></button>
                          <button onClick={cancelEditing} className="text-red-400 hover:text-red-300"><FiX size={16} /></button>
                        </div>
                      ) : (
                        (img.price || isPriceEditable) && (
                          <p className="text-white text-xs font-bold">
                            {img.price ? `₹${img.price}` : <span className="text-yellow-300">Add Price</span>} 
                            {img.price && <span className="text-[9px] font-normal opacity-70"> / Piece</span>}
                          </p>
                        )
                      )}
                    </div>

                    
                    <div className="absolute top-2 right-2 flex gap-1 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-y-[-10px] md:group-hover:translate-y-0">
                      {isPriceEditable && !isEditing && (
                        <button 
                          onClick={() => startEditing(img)}
                          className="bg-white/95 text-cyan-600 p-2 rounded-lg shadow-lg"
                          title="Edit Price"
                        >
                          <FiEdit2 size={14} />
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleSingleImageDelete(img)}
                        className="bg-white/95 text-red-600 p-2 rounded-lg shadow-lg"
                        title="Delete Image"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-50 flex justify-center items-center gap-4">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-20 transition-all"><FiChevronLeft /></button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-200' : 'bg-white text-gray-400 border border-gray-100 hover:border-cyan-200 hover:text-cyan-600'}`}>{i + 1}</button>
              ))}
            </div>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-20 transition-all"><FiChevronRight /></button>
          </div>
        )}
      </section>
    </div>
  );
};

export default FileUploadAndSelect;