import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Dùng chung style với trang Login cho đẹp

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    confirm_password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Kiểm tra mật khẩu nhập lại
    if (formData.password !== formData.confirm_password) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: formData.userName,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || "Đăng ký thất bại");
      } else {
        alert("Đăng ký thành công! Hãy đăng nhập ngay.");
        navigate('/'); // Chuyển về trang Login
      }
    } catch (err) {
      setError("Tài khoản đã tồn tại!");
    }
  };

  return (
    <div className="login-box">
      <div className="form-title">
        <h3>Đăng Ký Tài Khoản</h3>
      </div>
      
      <form onSubmit={handleRegister}>
        {error && <p style={{color: 'red'}}>{error}</p>}

        <div className="input-group">
          <i className="fas fa-envelope icon"></i>
          <input 
            type="userName" name="userName" placeholder="Tên tài khoản" required 
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <i className="fas fa-lock icon"></i>
          <input 
            type="password" name="password" placeholder="Mật khẩu" required 
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <i className="fas fa-check icon"></i>
          <input 
            type="password" name="confirm_password" placeholder="Xác nhận mật khẩu" required 
            onChange={handleChange}
          />
        </div>
        
        <button type="submit">Đăng Ký Ngay</button>

        <div className="register-section">
            <p>Đã có tài khoản?</p>
            <a style={{cursor: 'pointer'}} onClick={() => navigate('/')} className="register-link">
                Quay lại Đăng Nhập
            </a>
        </div>
      </form>
    </div>
  );
};

export default Register;