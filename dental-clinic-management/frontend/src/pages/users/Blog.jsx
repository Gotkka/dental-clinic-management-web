import React, { useState } from 'react';
import { Calendar, Clock, ChevronRight, User } from 'lucide-react';
import Layout from '../../layouts/Layout';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  const categories = ['Tất cả', 'Mẹo sức khỏe', 'Tin y tế', 'Sống khỏe', 'Dinh dưỡng', 'Nghiên cứu'];

  const blogPosts = [
    {
      id: 1,
      title: 'Hiểu về bệnh tim: Phòng ngừa và phương pháp điều trị',
      excerpt: 'Tìm hiểu về những phương pháp mới nhất trong phòng ngừa bệnh tim và các lựa chọn điều trị hiệu quả hiện nay.',
      category: 'Mẹo sức khỏe',
      image: '/api/placeholder/800/400',
      author: 'TS. Sarah Johnson',
      date: '15 Tháng 4, 2025',
      readTime: '8 phút đọc',
      featured: true
    },
    {
      id: 2,
      title: 'Lợi ích của việc tập thể dục thường xuyên đối với sức khỏe tinh thần',
      excerpt: 'Khám phá cách hoạt động thể chất có thể cải thiện tinh thần và giảm triệu chứng lo âu, trầm cảm.',
      category: 'Sống khỏe',
      image: '/api/placeholder/800/400',
      author: 'TS. Michael Chen',
      date: '12 Tháng 4, 2025',
      readTime: '6 phút đọc',
      featured: true
    },
    {
      id: 3,
      title: 'Đột phá trong nghiên cứu Alzheimer: Phương pháp điều trị mới đầy hứa hẹn',
      excerpt: 'Các tiến bộ mới trong nghiên cứu Alzheimer mang đến một phương pháp điều trị tiềm năng đột phá.',
      category: 'Nghiên cứu',
      image: '/api/placeholder/800/400',
      author: 'TS. Jessica Williams',
      date: '10 Tháng 4, 2025',
      readTime: '10 phút đọc',
      featured: false
    },
    {
      id: 4,
      title: 'Chế độ ăn cân bằng: Nền tảng cho sức khỏe tốt',
      excerpt: 'Khám phá các thành phần thiết yếu của một chế độ ăn lành mạnh và vai trò của nó trong phòng ngừa bệnh.',
      category: 'Dinh dưỡng',
      image: '/api/placeholder/800/400',
      author: 'TS. Robert Martinez',
      date: '8 Tháng 4, 2025',
      readTime: '7 phút đọc',
      featured: false
    },
    {
      id: 5,
      title: 'Cập nhật COVID-19: Những phát hiện và khuyến nghị mới',
      excerpt: 'Thông tin mới nhất về COVID-19: biến thể mới, vắc xin và hướng dẫn y tế công cộng.',
      category: 'Tin y tế',
      image: '/api/placeholder/800/400',
      author: 'TS. Amanda Lee',
      date: '5 Tháng 4, 2025',
      readTime: '9 phút đọc',
      featured: false
    },
    {
      id: 6,
      title: 'Rối loạn giấc ngủ: Nhận biết và cách quản lý',
      excerpt: 'Hiểu rõ các rối loạn giấc ngủ phổ biến, ảnh hưởng đến sức khỏe và các phương pháp cải thiện giấc ngủ.',
      category: 'Mẹo sức khỏe',
      image: '/api/placeholder/800/400',
      author: 'TS. David Wilson',
      date: '3 Tháng 4, 2025',
      readTime: '8 phút đọc',
      featured: false
    }
  ];

  const filteredPosts = activeCategory === 'Tất cả'
    ? blogPosts
    : blogPosts.filter(post => post.category === activeCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Blog Sức Khỏe & Đời Sống</h1>
            <p className="mt-4 text-xl text-gray-600">Cập nhật kiến thức y học và mẹo sống khỏe mỗi ngày</p>
          </div>

          {/* Bài viết nổi bật */}
          {featuredPosts.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết nổi bật</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <img src={post.image} alt={post.title} className="w-full h-56 object-cover" />
                    <div className="p-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {post.category}
                      </span>
                      <h3 className="mt-3 text-xl font-semibold text-gray-900">{post.title}</h3>
                      <p className="mt-2 text-gray-600">{post.excerpt}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <User size={16} className="text-gray-400" />
                          <span className="ml-1 text-sm text-gray-500">{post.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={16} className="text-gray-400" />
                          <span className="ml-1 text-sm text-gray-500">{post.readTime}</span>
                        </div>
                      </div>
                      <div className="mt-6">
                        <a href={`/blog/${post.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-500">
                          Đọc tiếp
                          <ChevronRight size={16} className="ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bộ lọc danh mục */}
          <div className="flex justify-center mb-8 overflow-x-auto">
            <div className="inline-flex rounded-md shadow-sm">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-sm font-medium ${activeCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                    } border border-gray-300 first:rounded-l-md last:rounded-r-md -ml-px first:ml-0`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Lưới bài viết */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {post.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        {post.date}
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{post.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <User size={16} className="text-gray-400" />
                        <span className="ml-1 text-sm text-gray-500">{post.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="text-gray-400" />
                        <span className="ml-1 text-sm text-gray-500">{post.readTime}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <a href={`/blog/${post.id}`} className="inline-flex items-center text-blue-600 hover:text-blue-500">
                        Đọc tiếp
                        <ChevronRight size={16} className="ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-gray-600">Không tìm thấy bài viết trong danh mục này.</p>
              </div>
            )}
          </div>

          {/* Phân trang */}
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <a href="#" className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                Trước
              </a>
              <a href="#" className="inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 -ml-px">
                1
              </a>
              <a href="#" className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 -ml-px">
                2
              </a>
              <a href="#" className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 -ml-px">
                3
              </a>
              <a href="#" className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 -ml-px">
                Tiếp
              </a>
            </nav>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
