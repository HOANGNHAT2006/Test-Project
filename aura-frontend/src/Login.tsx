import React, { useState } from 'react';
import './App.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Đăng nhập với: ${email}`);
   
  };

  return (
    <div className="login-box">
      <div className="form-title">
        <h3>Đăng Nhập</h3>
      </div>
      <form onSubmit={handleLogin}>
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
        
        {}
        <button type="submit" style={{width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
          Đăng Nhập
        </button>

        {}
        <p className="forgot-password"><a href="#">Quên mật khẩu?</a></p>
        <div className="divider">Hoặc</div>
        
        {}
        <button type="button" className="social-button phone-btn">
            <i className="fas fa-phone"></i>Đăng nhập bằng số điện thoại
        </button>
        
        <button type="button" className="social-button google-btn">
            <i className="fab fa-google"></i>Đăng nhập bằng Google
        </button>

        <button type="button" className="social-button facebook-btn">
            <i className="fab fa-facebook"></i>Đăng nhập bằng Facebook
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