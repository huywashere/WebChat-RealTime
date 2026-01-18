# Trò chuyện phân tán theo thời gian thực

Kho lưu trữ này chứa mã **frontend** (React.js), **backend** (Go-Fiber) và **Infrastructure** (Terraform, CI/CD) để xây dựng nền tảng nhắn tin phân tán, theo thời gian thực, có thể mở rộng. Nếu bạn là một nhà phát triển đang muốn tìm hiểu thiết kế hệ thống hoặc thậm chí đang tìm cách xây dựng các dự án toàn diện, tôi hy vọng bạn thấy điều này hữu ích ❤️

<br />
Tôi sẽ viết bài về nhiều tính năng của dự án như Định cấu hình nginx làm proxy ngược để cân bằng tải, chứng chỉ TLS/SSL cho giao tiếp HTTPS, Thiết lập cơ sở hạ tầng bằng Terraform, v.v. Vì vậy, hãy theo dõi tôi trên HashNode (https://joyalajohney.hashnode.dev/). nếu bạn thích repo, vui lòng cân nhắc cho nó ⭐!

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

## Architecture Diagram 🌠
<img src="https://raw.githubusercontent.com/JoyalAJohney/Realtime-Distributed-Chat/main/assets/diagrams_image.png" alt="landing page">


## Product Demo 🚀

https://github.com/JoyalAJohney/Realtime-Distributed-Chat/assets/31545426/db55bf32-1e35-4071-a80e-9f4944614e71


## About the Project 🌌

* Multiple Go-fiber servers providing API endpoints (JWT authentication) and WebSocket connections for full-duplex communication. These Go instances are configured under Nginx (reverse proxy) Which act a layer 7 loadbalancer.
  
* To propagate messages for users within the same room but connected to multiple instances, we utilize Redis (Pub/Sub model). Each instance is subscribed to a particular channel in Redis and gets notified on receiving messages. All messages are stored in Postgres.
  
* The database can undergo a heavy write load if we receive 10k messages/sec. To avoid this, we use kafka, a message stream designed for high throughput and low latency processing. A consumer (Go instance) will consume messages from kafka in batches and writes them to postgres.
  
* The frontend for application is build using React.js and served in an Nginx container. All the nodes are containarized using Docker and Configured using Docker-Compose. We only expose the Reverse-Proxy (Nginx) to the outside world. Al requests are redirected from there.
  
* Next step is to deploy the application on AWS. A CI/CD pipeline is implemented using github actions. We use Terraform for setting up Infrastructure on AWS, configuring an EC2 instance, S3 storage, Security groups and Elastic IP. This is ntegrated into the CI/CD pipeline.
  
* For secure HTTPS access, Issue certificate and configure it in Nginx for secure TLS/SSL communication. 
  

## Setting Up 🔧

* Create a .env file from the env.sample file.
* Fill in the values based on your required configuration.
* Make sure that the .env file is in the same level as docker-compose.yml file
  
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

I have only shared the template code for **Infrastructre** (pipeline & terraform). You need to configure the AWS credentials, Terraform, and Pipeline according to your requirements. Additionally, you'll have to set up TLS/SSL for HTTPS (since all of this information is sensitive, it has been omitted)

## Running the app
if you wish to run llm model, uncomment the changes from docker-compose (llama 2 model requires almost 3.6GB size)

Execute the below command to build the application containers
```bash
$ docker-compose up --build
```
If the application starts perfectly fine, you should be able to head over to http://localhost:8080/
