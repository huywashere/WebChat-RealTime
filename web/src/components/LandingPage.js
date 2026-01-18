import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function LandingPage() {
  return (
    <div className="landing-container">
      <div className="chat-window">
        <div className="social-links">
          <a href="https://github.com/huywashere/WebChat-RealTime" target="_blank" rel="noopener noreferrer" className="social-link">
            <i className="fab fa-github"></i>
            <span className="tooltip-text">The Creation</span>
          </a>
          <a href="https://www.linkedin.com/in/nguyenphuhuy/" target="_blank" rel="noopener noreferrer" className="social-link">
            <i className="fab fa-linkedin"></i>
            <span className="tooltip-text">The Creator</span>
          </a>
        </div>
        <div className="login-panel">
          <div className='headings'>Project Real-Time Chat</div>
          <span>độ trễ thấp - trò chuyện thời gian thực được xây dựng bằng Golang 🚀</span>
          <br />
          <br />
          <div className="form-button">
            <Link to="/signup"><button className="landing-button">Create a new Account</button></Link>
            <Link to="/login"><button className="landing-button">Already a user? Login here</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
