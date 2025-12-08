import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Login = () => {
  // Đổi tên biến trạng thái thành 'userName'
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  
  const navigate = useNavigate(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 

    try {
      // 1. Gửi 'userName' và 'password' sang Server Python
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // CHÚ Ý: Đổi tên trường dữ liệu gửi đi thành 'userName'
        body: JSON.stringify({ userName, password }), 
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || 'Đăng nhập thất bại');
      } else {
        // 2. Đăng nhập thành công: Lưu token và role
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('role', data.user_info.role);
        
        // 3. CHUYỂN HƯỚNG TỚI TRANG CHỦ
        navigate('/dashboard'); 
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
        {error && <p style={{color: 'red', marginBottom: '10px'}}>{error}</p>}

        <div className="input-group">
          <i className="fas fa-user icon"></i> 
          <input 
            type="text" 
            placeholder="Tên người dùng" 
            value={userName} // Sử dụng userName
            onChange={(e) => setUserName(e.target.value)} // Cập nhật userName
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

        {/* Các phần khác giữ nguyên */}
        <p className="forgot-password"><a href="#">Quên mật khẩu?</a></p>
        <div className="divider">Hoặc</div>
        <button type="button" className="social-button google-btn">
              <i className="fab fa-google"></i> Đăng nhập bằng Google
        </button>
        <div className="register-section">
            <p>Chưa có tài khoản?</p>
            <span
                className="register-link"
style={{cursor: 'pointer'}}
                onClick={() => navigate('/register')}
            >
                Đăng Ký Ngay
            </span>
        </div>
      </form>
     </div>
  );
};

export default Login;
