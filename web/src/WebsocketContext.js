import React, { createContext, useRef, useEffect } from 'react';

// Khởi tạo một Context để lưu trữ và chia sẻ kết nối WebSocket cho toàn bộ ứng dụng
export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    // useRef(null) dùng để giữ đối tượng WebSocket mà không làm component bị render lại khi giá trị thay đổi
    const ws = useRef(null);
  
    useEffect(() => {
      // Lấy các biến môi trường từ tệp .env, nếu không có sẽ lấy giá trị mặc định
      const env = process.env.REACT_APP_NGINX_ENV || 'local'; // 'local' hoặc 'production'
      const host = process.env.REACT_APP_NGINX_HOST || 'localhost'; // IP của VPS hoặc localhost
      const port = process.env.REACT_APP_NGINX_PORT || '3001'; // Cổng chạy server Backend

      // Xác định giao thức kết nối: Nếu chạy máy local dùng 'ws', trên VPS dùng 'wss' (bảo mật qua SSL)
      const serverUrl = env === 'local' ? 
        `ws://${host}:${port}/ws/chat` : `wss://${host}/ws/chat`;
      
      // Khởi tạo một kết nối WebSocket mới tới địa chỉ server đã xác định
      ws.current = new WebSocket(`${serverUrl}`);
  
      // Hàm cleanup: Tự động chạy khi người dùng tắt trình duyệt hoặc rời khỏi ứng dụng
      return () => {
        console.log('Closing WebSocket connection...');
        if (ws.current) {
          ws.current.close(); // Đóng kết nối để giải phóng tài nguyên trên server Go
        }
      };
    }, []); // Mảng rỗng [] đảm bảo việc kết nối chỉ xảy ra một lần duy nhất khi ứng dụng khởi động
  
    return (
      // Cung cấp biến 'ws' cho tất cả các component con nằm bên trong Provider này
      <WebSocketContext.Provider value={ws}>
        {children}
      </WebSocketContext.Provider>
    );
  };