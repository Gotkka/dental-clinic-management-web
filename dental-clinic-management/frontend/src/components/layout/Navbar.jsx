import React, { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fullName, setFullName] = useState('');
  const [setUser] = useState(null); // Added setUser
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const isActive = (path) => location.pathname === path;

  // Fetch username from localStorage or another source
  const username = localStorage.getItem("username"); // Assuming username is saved in localStorage
  const id = localStorage.getItem("id"); // Assuming id is saved in localStorage
  console.log(id);

  useEffect(() => {
    const fetchFullName = async () => {
      try {
        if (username) {
          setIsAuthenticated(true)
          
          const response = await fetch(`http://localhost:8080/dental-clinic/users/full_name/${username}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            setFullName(data.full_name);
            console.log('Full name fetched:', data.full_name);  // Kiểm tra giá trị
          } else {
            alert('Không thể lấy thông tin người dùng');
          }
        }
      } catch (err) {
        console.log(err);
        alert('Không thể kết nối đến server');
      }
    };
  
    fetchFullName();
  }, [username]);
  

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("username"); // Remove username as well
    setIsAuthenticated(false);
    setUser(null);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Nha khoa Smile" className="h-30 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className={`${isActive('/') ? 'black-text-link font-medium' : 'black-text-link hover:text-dental-blue'}`}>Trang chủ</Link>
            <Link to="/services" className={`${isActive('/services') ? 'black-text-link font-medium' : 'black-text-link hover:text-dental-blue'}`}>Dịch vụ</Link>
            <Link to="/dentists" className={`${isActive('/dentists') ? 'black-text-link font-medium' : 'black-text-link hover:text-dental-blue'}`}>Bác sĩ</Link>
            <Link to="/bookAppointment" className={`${isActive('/bookAppointment') ? 'black-text-link font-medium' : 'black-text-link hover:text-dental-blue'}`}>Đặt lịch</Link>
            <Link to="/contact" className={`${isActive('/contact') ? 'black-text-link font-medium' : 'black-text-link hover:text-dental-blue'}`}>Liên hệ</Link>
          </div>

          {/* Authentication Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button onClick={toggleProfile} className="my-global-btn flex items-center text-white">
                  <FaUser className="mr-2" />
                  <span>{ fullName ? fullName : "Tài khoản" }</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute top-9 right-0 w-50 bg-dental-light rounded-md shadow-lg py-0 mt-2 z-99">
                    <Link to="/profile" className="block px-4 py-2 black-text-link hover:bg-gray-100">Hồ sơ cá nhân</Link>
                    <Link to="/appointments" className="block px-4 py-2 black-text-link hover:bg-gray-100">Lịch hẹn của tôi</Link>
                    <Link to="/medical-records" className="block px-4 py-2 black-text-link hover:bg-gray-100">Hồ sơ y tế</Link>
                    <button onClick={handleLogout} className="w-full  my-global-btn text-left px-4 py-2 text-white">
                      <div className="flex items-center">
                        <FaSignOutAlt className="mr-2" />
                        <span>Đăng xuất</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="bg-dental-blue text-white px-3 py-1.5 rounded-lg hover:bg-dental-dark transition duration-300">Đăng nhập</Link>
                <Link to="/register" className="text-lg black-text-link hover:text-dental-blue">Đăng ký</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {isAuthenticated && (
              <button onClick={toggleProfile} className="text-gray-700 hover:text-dental-blue mr-4">
                <FaUser size={20} />
              </button>
            )}
            <button onClick={toggleMenu} className="text-gray-700 hover:text-dental-blue focus:outline-none">
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-6 shadow-inner">
          <div className="flex flex-col space-y-4">
            <Link to="/" className={`${isActive('/') ? 'text-dental-blue font-medium' : 'text-gray-600'}`} onClick={toggleMenu}>Trang chủ</Link>
            <Link to="/services" className={`${isActive('/services') ? 'text-dental-blue font-medium' : 'text-gray-600'}`} onClick={toggleMenu}>Dịch vụ</Link>
            <Link to="/dentists" className={`${isActive('/dentists') ? 'text-dental-blue font-medium' : 'text-gray-600'}`} onClick={toggleMenu}>Bác sĩ</Link>
            <Link to="/bookAppointment" className={`${isActive('/bookAppointment') ? 'text-dental-blue font-medium' : 'text-gray-600'}`} onClick={toggleMenu}>Đặt lịch</Link>
            <Link to="/contact" className={`${isActive('/contact') ? 'text-dental-blue font-medium' : 'text-gray-600'}`} onClick={toggleMenu}>Liên hệ</Link>

            {!isAuthenticated && (
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Link to="/login" className="text-dental-blue hover:text-dental-dark" onClick={toggleMenu}>Đăng nhập</Link>
                <Link to="/register" className="bg-dental-blue text-white px-4 py-2 rounded-lg hover:bg-dental-dark transition duration-300 text-center" onClick={toggleMenu}>Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Profile Dropdown */}
      {isProfileOpen && isAuthenticated && (
        <div className="md:hidden bg-white py-4 px-6 shadow-inner">
          <div className="flex flex-col space-y-4">
            <Link to="/profile" className="text-gray-700" onClick={() => { toggleProfile(); toggleMenu(); }}>Hồ sơ cá nhân</Link>
            <Link to="/appointments" className="text-gray-700" onClick={() => { toggleProfile(); toggleMenu(); }}>Lịch hẹn của tôi</Link>
            <Link to="/medical-records" className="text-gray-700" onClick={() => { toggleProfile(); toggleMenu(); }}>Hồ sơ y tế</Link>
            <button onClick={handleLogout} className="flex items-center text-gray-700">
              <FaSignOutAlt className="mr-2" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
