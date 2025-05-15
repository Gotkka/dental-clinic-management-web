import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dental-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Thông tin liên hệ */}
          <div>
            <h3 className="text-xl font-bold mb-4">Nha Khoa Smile</h3>
            <p className="mb-4">Chăm sóc nụ cười của bạn với dịch vụ nha khoa chất lượng cao và chuyên nghiệp.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-dental-blue"><FaFacebook size={24} /></a>
              <a href="#" className="text-white hover:text-dental-blue"><FaTwitter size={24} /></a>
              <a href="#" className="text-white hover:text-dental-blue"><FaInstagram size={24} /></a>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-dental-blue">Trang chủ</Link></li>
              <li><Link to="/services" className="hover:text-dental-blue">Dịch vụ</Link></li>
              <li><Link to="/doctors" className="hover:text-dental-blue">Bác sĩ</Link></li>
              <li><Link to="/appointment" className="hover:text-dental-blue">Đặt lịch</Link></li>
              <li><Link to="/blog" className="hover:text-dental-blue">Blog</Link></li>
            </ul>
          </div>
          
          {/* Dịch vụ */}
          <div>
            <h3 className="text-xl font-bold mb-4">Dịch vụ của chúng tôi</h3>
            <ul className="space-y-2">
              <li><Link to="/services/cleaning" className="hover:text-dental-blue">Vệ sinh răng miệng</Link></li>
              <li><Link to="/services/implants" className="hover:text-dental-blue">Cấy ghép Implant</Link></li>
              <li><Link to="/services/orthodontics" className="hover:text-dental-blue">Chỉnh nha</Link></li>
              <li><Link to="/services/cosmetic" className="hover:text-dental-blue">Nha khoa thẩm mỹ</Link></li>
              <li><Link to="/services/pediatric" className="hover:text-dental-blue">Nha khoa trẻ em</Link></li>
            </ul>
          </div>
          
          {/* Liên hệ */}
          <div>
            <h3 className="text-xl font-bold mb-4">Thông tin liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="mr-2 mt-4" />
                <span>Trường Đại học Giao thông Vận tải - Phân hiệu tại Thành phố Hồ Chí Minh</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-3" />
                <span>+84 325 447 045</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-3" />
                <span>6351071079@st.utc2.edu.vn</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Nha Khoa Smile. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;