package kafka

import (
    "context"
    "encoding/json"
    "log"

    "github.com/segmentio/kafka-go" // Thư viện dùng để kết nối và làm việc với Kafka

    "realtime-chat/src/config"
    "realtime-chat/src/models"
)

// Cấu trúc để chứa các thông tin kết nối Kafka từ tệp cấu hình
type KafkaConfig struct {
    Host       string // Địa chỉ máy chủ Kafka (thường là 'kafka' trong Docker)
    Port       string // Cổng kết nối (mặc định là 9092)
    kafkaTopic string // Tên chủ đề (Topic) mà tin nhắn sẽ được gửi vào
    GroupID    string // ID định danh nhóm để quản lý việc đọc/ghi tin nhắn
}

var kafkaConfig KafkaConfig

// Hàm init tự động chạy khi package được nạp để khởi tạo các biến cấu hình
func init() {
    kafkaConfig = KafkaConfig{
        Host:       config.Config.KafkaHost,
        Port:       config.Config.KafkaPort,
        kafkaTopic: config.Config.KafkaTopic,
        GroupID:    config.Config.KafkaGroupID,
    }
}

// Hàm chính để đẩy một tin nhắn vào hàng chờ Kafka
func PublishMessage(message models.Message) {
    // Tạo một Writer (người ghi) để kết nối tới cụm Kafka
    w := kafka.NewWriter(kafka.WriterConfig{
        Brokers: []string{kafkaConfig.Host + ":" + kafkaConfig.Port},
        Topic:   kafkaConfig.kafkaTopic,
    })
    defer w.Close() // Đảm bảo đóng kết nối sau khi hoàn thành để tránh rò rỉ bộ nhớ

    // Chuyển đổi đối tượng tin nhắn (struct) sang dạng chuỗi JSON để gửi đi
    messageBytes, err := json.Marshal(message)
    if err != nil {
        log.Println("Error marshalling message:", err)
        return
    }

    // Thực hiện ghi tin nhắn vào Topic của Kafka
    // context.Background() dùng để quản lý thời gian sống của yêu cầu gửi tin
    err = w.WriteMessages(context.Background(), kafka.Message{
        Value: messageBytes, // Nội dung tin nhắn dưới dạng bytes
    })

    // Kiểm tra nếu có lỗi trong quá trình gửi tin nhắn
    if err != nil {
        log.Println("Error publishing message to kafka:", err)
        return
    }
}