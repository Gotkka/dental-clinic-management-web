import React from 'react';
import { ArrowRight, Clock, Shield, Zap, Star, Headphones } from 'lucide-react';
import Layout from '../../layouts/Layout';

const Services = () => {
  const services = [
    {
      icon: <Zap size={24} className="text-blue-600" />,
      title: "Hiệu suất vượt trội",
      description: "Tối ưu hóa tốc độ và hiệu quả giúp ứng dụng của bạn vận hành mượt mà và phản hồi nhanh chóng với người dùng.",
      cta: "Tìm hiểu thêm"
    },
    {
      icon: <Shield size={24} className="text-green-600" />,
      title: "Giải pháp an toàn",
      description: "Thiết kế với yếu tố bảo mật hàng đầu, bảo vệ dữ liệu và mang lại sự an tâm cho doanh nghiệp và khách hàng.",
      cta: "Khám phá bảo mật"
    },
    {
      icon: <Star size={24} className="text-yellow-600" />,
      title: "Chất lượng cao cấp",
      description: "Tiêu chuẩn cao nhất trong quy trình phát triển, đảm bảo giải pháp đáng tin cậy, mở rộng và dễ bảo trì.",
      cta: "Xem dự án"
    },
    {
      icon: <Clock size={24} className="text-purple-600" />,
      title: "Hỗ trợ 24/7",
      description: "Hỗ trợ kỹ thuật liên tục, bảo trì thường xuyên giúp hệ thống của bạn luôn hoạt động ổn định.",
      cta: "Liên hệ hỗ trợ"
    },
    {
      icon: <Headphones size={24} className="text-red-600" />,
      title: "Tư vấn chuyên sâu",
      description: "Được tư vấn trực tiếp từ chuyên gia có kinh nghiệm và hiểu rõ nhu cầu của ngành bạn.",
      cta: "Đặt lịch tư vấn"
    },
    {
      icon: <ArrowRight size={24} className="text-indigo-600" />,
      title: "Phát triển theo yêu cầu",
      description: "Giải pháp được thiết kế riêng biệt để giải quyết các thách thức và mục tiêu cụ thể của doanh nghiệp bạn.",
      cta: "Yêu cầu báo giá"
    }
  ];

  return (
    <Layout>
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Chúng tôi cung cấp</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Dịch vụ chất lượng cao
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Giải pháp toàn diện, linh hoạt và tối ưu nhằm đáp ứng nhu cầu của doanh nghiệp và giúp bạn đạt được mục tiêu.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-100 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-900">{service.title}</h3>
                <p className="mt-2 text-base text-gray-500">{service.description}</p>
                <div className="mt-4">
                  <a
                    href="#"
                    className="inline-flex items-center text-blue-600 hover:text-blue-500"
                  >
                    {service.cta}
                    <ArrowRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a
              href="#contact"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Liên hệ với chúng tôi
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
