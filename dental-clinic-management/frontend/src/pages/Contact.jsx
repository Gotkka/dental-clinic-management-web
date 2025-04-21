import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.name.trim()) {
      errors.name = 'Vui lòng nhập họ tên';
    }

    if (!values.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email không hợp lệ';
    }

    if (!values.message.trim()) {
      errors.message = 'Vui lòng nhập nội dung tin nhắn';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);

      // Giả lập gọi API
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });

        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      }, 1500);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin size={24} className="text-blue-600" />,
      title: "Địa chỉ phòng khám",
      details: [
        "456 Đường Nguyễn Văn Cừ",
        "Quận 5, TP. Hồ Chí Minh",
        "Việt Nam"
      ]
    },
    {
      icon: <Phone size={24} className="text-blue-600" />,
      title: "Số điện thoại",
      details: [
        "028 1234 5678",
        "0909 123 456"
      ]
    },
    {
      icon: <Mail size={24} className="text-blue-600" />,
      title: "Email liên hệ",
      details: [
        "lienhe@nhakhoathudo.vn",
        "support@nhakhoathudo.vn"
      ]
    },
    {
      icon: <Clock size={24} className="text-blue-600" />,
      title: "Giờ làm việc",
      details: [
        "Thứ 2 - Thứ 7: 8:00 - 20:00",
        "Chủ nhật: 8:00 - 12:00"
      ]
    }
  ];

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Liên hệ với chúng tôi</h1>
            <p className="mt-4 text-xl text-gray-600">
              Phòng khám nha khoa Thủ Đô luôn sẵn sàng lắng nghe và hỗ trợ bạn!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 mr-4">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                  </div>
                  <div className="ml-10">
                    {item.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 mb-1">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Gửi tin nhắn cho chúng tôi</h2>
              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-start">
                  <CheckCircle size={24} className="text-green-500 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-green-800">Cảm ơn bạn đã liên hệ!</h3>
                    <p className="text-green-700 mt-1">Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Tiêu đề
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Nội dung tin nhắn *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                    ></textarea>
                    {formErrors.message && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send size={20} className="mr-2" />
                          Gửi tin nhắn
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Bản đồ phòng khám */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Vị trí phòng khám</h2>
            <div className="h-96 bg-gray-300 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <MapPin size={64} className="text-gray-400" />
                <p className="ml-4 text-lg text-gray-500">Bản đồ - Tích hợp Google Maps tại đây</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
