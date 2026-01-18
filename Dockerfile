# Sử dụng hình ảnh Golang chính thức để tạo tạo phẩm xây dựng.
FROM golang:1.19-alpine

# Đặt thư mục làm việc bên trong container.
WORKDIR /app

# Sao chép tệp go.mod và go.sum vào thư mục làm việc.
COPY go.mod go.sum ./

# Tải xuống tất cả các phụ thuộc.
RUN go mod download

# Sao chép mã nguồn vào contaier.
COPY src/ ./src

# Đặt thư mục làm việc vào thư mục mã nguồn.
WORKDIR /app/src

# Build the application.
RUN go build -o main .

# chạy thực thi được.
CMD ["./main"]
