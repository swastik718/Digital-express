import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === 'digitalxpress1990@gmail.com' && password === 'digitalexpress@00') {
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/fileupload');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCFBF7] relative overflow-hidden">
      {/* Decorative Brand Circles */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-[#3ABEF9]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[#FF8C32]/10 rounded-full blur-3xl"></div>

      <div className="relative w-full max-w-md px-6">
        {/* Brand Identity */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#3ABEF9] rounded-2xl shadow-lg shadow-blue-200 mb-4">
            <FiShield className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight uppercase">
            Digital <span className="text-[#3ABEF9]">Express</span>
          </h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Management Portal</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl border border-gray-50 w-full"
        >
          <h2 className="text-xl font-bold mb-8 text-gray-700">Admin Login</h2>

          {/* Email Field */}
          <div className="mb-5">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3ABEF9] transition-colors">
                <FiMail />
              </span>
              <input
                type="email"
                placeholder="admin@digitalxpress.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3ABEF9]/20 focus:bg-white focus:border-[#3ABEF9] transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-8">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Security Password</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3ABEF9] transition-colors">
                <FiLock />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#3ABEF9]/20 focus:bg-white focus:border-[#3ABEF9] transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Submit Button - Brand Orange */}
          <button
            type="submit"
            className="w-full bg-[#FF8C32] hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-md tracking-wider transition-all shadow-lg shadow-orange-100 active:scale-[0.98]"
          >
            AUTHORIZE ACCESS
          </button>

          <p className="text-center text-[10px] text-gray-400 mt-8 font-medium">
            &copy; 2026 Digital Express Store. All Rights Reserved.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;