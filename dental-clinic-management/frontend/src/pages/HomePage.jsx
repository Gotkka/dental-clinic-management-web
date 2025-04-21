// src/pages/HomePage.jsx
import React from "react";
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUserMd, FaClipboardList, FaInfoCircle } from 'react-icons/fa';
import '../css/HomePage.css'; 
import Layout from '../components/layout/Layout';
import dental_cleaning from '../assets/dental-cleaning.png';
import dental_implants from '../assets/dental-implants.png';
import teeth_whiteing from '../assets/teeth-whitening.png';

const HomePage = () => {

  return (
    <Layout>
    <div className="bg-dental-light min-h-screen">
          {/* Hero Section */}
          <div className="bg-dental-blue text-white">
            <div className="container mx-auto px-4 py-16">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">Đặt lịch khám nha khoa dễ dàng và nhanh chóng</h1>
                  <p className="text-lg mb-8">Chăm sóc nụ cười của bạn là ưu tiên hàng đầu của chúng tôi. Đặt lịch hẹn ngay hôm nay!</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/appointment" className="bg-white font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition duration-300 text-lg black-text-link">
                      Đặt lịch ngay
                    </Link>
                    <Link to="/services" className="border border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-dental-dark transition duration-300">
                      Dịch vụ của chúng tôi
                    </Link>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <img src="./src/assets/low-cost-dental-care.png" alt="Dental Clinic" className="w-2/3" />
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Tại sao chọn dịch vụ của chúng tôi?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-dental-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCalendarAlt size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Đặt lịch linh hoạt</h3>
                <p className="text-gray-600">Đặt lịch khám dễ dàng mọi lúc, mọi nơi chỉ với vài bước đơn giản</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-dental-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUserMd size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Bác sĩ chuyên nghiệp</h3>
                <p className="text-gray-600">Đội ngũ bác sĩ giàu kinh nghiệm và được đào tạo chuyên sâu</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-dental-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaClipboardList size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Hồ sơ bệnh án</h3>
                <p className="text-gray-600">Dễ dàng theo dõi lịch sử khám và điều trị của bạn</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="bg-dental-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaInfoCircle size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Nhắc nhở tự động</h3>
                <p className="text-gray-600">Nhận thông báo nhắc nhở trước lịch hẹn để không bỏ lỡ</p>
              </div>
            </div>
          </div>

          {/* Services Preview */}
          <div className="bg-gray-100 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">Dịch vụ nha khoa của chúng tôi</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img src={dental_cleaning} alt="Dental Cleaning" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Vệ sinh và chăm sóc răng miệng</h3>
                    <p className="text-gray-600 mb-4">Dịch vụ vệ sinh răng miệng chuyên nghiệp giúp ngăn ngừa sâu răng và bệnh nướu</p>
                    <Link to="/services" className="text-dental-blue font-bold hover:underline">Tìm hiểu thêm</Link>
                  </div>
                </div>
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img src={dental_implants}  alt="Dental Implants" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Cấy ghép implant</h3>
                    <p className="text-gray-600 mb-4">Giải pháp thay thế răng mất vĩnh viễn với công nghệ hiện đại</p>
                    <Link to="/services" className="text-dental-blue font-bold hover:underline">Tìm hiểu thêm</Link>
                  </div>
                </div>
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img src={teeth_whiteing}  alt="Teeth Whitening" className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">Tẩy trắng răng</h3>
                    <p className="text-gray-600 mb-4">Phương pháp làm trắng răng an toàn và hiệu quả cho nụ cười rạng rỡ</p>
                    <Link to="/services" className="text-dental-blue font-bold hover:underline">Tìm hiểu thêm</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Khách hàng nói gì về chúng tôi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-dental-blue text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <span className="font-bold text-lg">NT</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Nguyễn Thành</h4>
                    <p className="text-gray-600 text-sm">Khách hàng</p>
                  </div>
                </div>
                <p className="text-gray-700">"Dịch vụ đặt lịch rất thuận tiện, đội ngũ nhân viên nhiệt tình và chu đáo. Tôi rất hài lòng với dịch vụ của phòng khám."</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-dental-blue text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <span className="font-bold text-lg">PL</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Phạm Linh</h4>
                    <p className="text-gray-600 text-sm">Khách hàng</p>
                  </div>
                </div>
                <p className="text-gray-700">"Bác sĩ rất tận tâm và giải thích chi tiết về tình trạng răng của tôi. Hệ thống đặt lịch online rất tiện lợi và dễ sử dụng."</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="bg-dental-blue text-white rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <span className="font-bold text-lg">TH</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Trần Huy</h4>
                    <p className="text-gray-600 text-sm">Khách hàng</p>
                  </div>
                </div>
                <p className="text-gray-700">"Đặt lịch nhanh chóng, không phải chờ đợi. Bác sĩ chuyên nghiệp và tận tâm với bệnh nhân. Tôi sẽ tiếp tục sử dụng dịch vụ này."</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          {/* <div className="bg-dental-blue text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">Sẵn sàng đặt lịch khám?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">Chăm sóc sức khỏe răng miệng của bạn là ưu tiên hàng đầu của chúng tôi. Đặt lịch ngay hôm nay để nhận được dịch vụ chăm sóc tốt nhất.</p>
              <Link to="/appointment" className="bg-white text-dental-blue font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300 text-lg">
                Đặt lịch ngay
              </Link>
            </div>
          </div> */}
        </div>
    </Layout>
  );
};

export default HomePage;
