# Trò chuyện phân tán theo thời gian thực

Kho lưu trữ này chứa mã **frontend** (React.js), **backend** (Go-Fiber) và **Infrastructure** (Terraform, CI/CD) để xây dựng nền tảng nhắn tin phân tán, theo thời gian thực, có thể mở rộng.
<br />
Nhóm sẽ viết bài về nhiều tính năng của dự án như Định cấu hình nginx làm proxy ngược để cân bằng tải, chứng chỉ TLS/SSL cho giao tiếp HTTPS, Thiết lập cơ sở hạ tầng bằng Terraform.

.
<img src="https://raw.githubusercontent.com/JoyalAJohney/Realtime-Distributed-Chat/main/assets/home.png" alt="landing page">


<div align="center">
    <br />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Badge">
    *
    <img src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx Badge">
    *
    <img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Golang Badge">
    *
    <img src="https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white" alt="Redis Badge">
    *
    <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="Postgres Badge">
    *
    <img src="https://img.shields.io/badge/Apache%20Kafka-000?style=for-the-badge&logo=apachekafka" alt="Kafka Badge">
    *
    <img src="https://img.shields.io/badge/terraform-%235835CC.svg?style=for-the-badge&logo=terraform&logoColor=white" alt="Terraform Badge">
    *
    <img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Badge">
</div>

## Sơ đồ kiến ​​trúc 🌠
<img src="https://raw.githubusercontent.com/JoyalAJohney/Realtime-Distributed-Chat/main/assets/diagrams_image.png" alt="landing page">


## Sản phẩm Demo 🚀

https://github.com/JoyalAJohney/Realtime-Distributed-Chat/assets/31545426/db55bf32-1e35-4071-a80e-9f4944614e71


## Giới thiệu về dự án 🌌

* Nhiều máy chủ Go-fiber cung cấp điểm cuối API (xác thực JWT) và kết nối WebSocket để liên lạc song công hoàn toàn. Các phiên bản Go này được định cấu hình trong Nginx (proxy ngược) hoạt động như một bộ cân bằng tải lớp 7.
  
* Để truyền bá tin nhắn cho người dùng trong cùng một phòng nhưng được kết nối với nhiều phiên bản, chúng tôi sử dụng Redis (mô hình Pub/Sub). Mỗi phiên bản được đăng ký một kênh cụ thể trong Redis và được thông báo khi nhận được tin nhắn. Tất cả tin nhắn được lưu trữ trong Postgres.
  
* Cơ sở dữ liệu có thể chịu tải trọng ghi lớn nếu chúng tôi nhận được 10k tin nhắn/giây. Để tránh điều này, chúng tôi sử dụng kafka, một luồng tin nhắn được thiết kế để xử lý thông lượng cao và độ trễ thấp. Một người tiêu dùng (ví dụ Go) sẽ sử dụng các tin nhắn từ kafka theo đợt và ghi chúng vào postgres.
  
* Giao diện người dùng cho ứng dụng được xây dựng bằng React.js và được phân phối trong vùng chứa Nginx. Tất cả các nút được chứa bằng Docker và được định cấu hình bằng Docker-Compose. Chúng tôi chỉ hiển thị Reverse-Proxy (Nginx) với thế giới bên ngoài. Yêu cầu Al được chuyển hướng từ đó.
  
* Bước tiếp theo là triển khai ứng dụng trên AWS. Quy trình CI/CD được triển khai bằng các hành động của github. Chúng tôi sử dụng Terraform để thiết lập Cơ sở hạ tầng trên AWS, định cấu hình phiên bản EC2, bộ lưu trữ S3, nhóm Bảo mật và IP đàn hồi. Điều này được tích hợp vào đường dẫn CI/CD.
  
* Để truy cập HTTPS an toàn, hãy cấp chứng chỉ và định cấu hình nó trong Nginx để liên lạc TLS/SSL an toàn.
  

## Cài đặt và chạy dự án 🔧

* Tạo tệp .env từ tệp env.sample.
* Điền vào các giá trị dựa trên cấu hình yêu cầu của bạn.
* Đảm bảo rằng tệp .env có cùng cấp độ với tệp docker-compose.yml
  
```bash
# Redis Config
REDIS_PORT=6379
REDIS_HOST=redis

# Database Config
POSTGRES_DATABASE=chat_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

# Kafka config
KAFKA_HOST=kafka
KAFKA_PORT=9092
KAFKA_TOPIC=chat_messages
KAFKA_GROUP_ID=chat_group
ZOOKEEPER_PORT=2181

# Authentication
JWT_SECRET=secret

# Reverse proxy config
NGINX_ENV=local
NGINX_PORT=8080
NGINX_HOST=localhost

# LLM config
LLM_PORT=11434

# Backend Servers
SERVER_PORT=8080
```

Nhóm chỉ chia sẻ mã mẫu cho **Cơ sở hạ tầng** (đường ống & địa hình). Bạn cần định cấu hình thông tin đăng nhập AWS, Terraform và Pipeline theo yêu cầu của mình. Ngoài ra, bạn sẽ phải thiết lập TLS/SSL cho HTTPS (vì tất cả thông tin này đều nhạy cảm nên đã bị bỏ qua)

## Khởi chạy dự án
nếu bạn muốn chạy mô hình llm, hãy bỏ ghi chú những thay đổi từ docker-compose (mô hình llama 2 yêu cầu kích thước gần 3,6 GB)

Thực hiện lệnh dưới đây để xây dựng các thùng chứa ứng dụng.
```bash
$ docker-compose up --build
```
Nếu ứng dụng khởi động hoàn toàn bình thường, bạn có thể truy cập http://localhost:8080/
