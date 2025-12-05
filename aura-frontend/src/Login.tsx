// src/Login.tsx
import React, { useState } from 'react';
import './App.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Để hiện lỗi nếu đăng nhập sai

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Xóa lỗi cũ

    try {
      // 1. Gọi API sang Server Python
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Nếu Server báo lỗi (400 hoặc 500)
        setError(data.detail || 'Đăng nhập thất bại');
      } else {
        // 2. Đăng nhập thành công (Code 200)
        alert(`Xin chào ${data.user_info.full_name}! Bạn là: ${data.user_info.role}`);
        
        // Lưu lại token và role để dùng cho các trang sau
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('role', data.user_info.role);
        
        // Sau này sẽ thêm lệnh chuyển trang ở đây (ví dụ: window.location.href = '/dashboard')
      }

    } catch (err) {
      setError('Không thể kết nối đến Server Python!');
      console.error(err);
    }
  };

  return (
    <div className="login-box">
      <div className="form-title">
        <img src="/logo.svg" alt="AURA Logo" style={{ width: '80px', marginBottom: '10px' }} />
        <h3>Đăng Nhập</h3>
      </div>
      
      <form onSubmit={handleLogin}>
        {/* Hiển thị lỗi màu đỏ nếu có */}
        {error && <p style={{color: 'red', marginBottom: '10px'}}>{error}</p>}

        <div className="input-group">
          <i className="fas fa-envelope icon"></i>
          <input 
            type="text" 
            placeholder="Email hoặc Tên người dùng" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <i className="fas fa-lock icon"></i>
          <input 
            type="password" 
            placeholder="Mật khẩu" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit">Đăng Nhập</button>

        {/* Các phần phụ giữ nguyên */}
        <p className="forgot-password"><a href="#">Quên mật khẩu?</a></p>
        <div className="divider">Hoặc</div>
        
        <button type="button" className="social-button google-btn">
             <i className="fab fa-google"></i> Đăng nhập bằng Google
        </button>
        
        <div className="register-section">
            <p>Chưa có tài khoản?</p>
            <a href="#" className="register-link">Đăng Ký Ngay</a>
        </div>
      </form>
    </div>
  );
};

export default Login;