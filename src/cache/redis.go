package cache

import (
	"context"
	"fmt"

	"github.com/go-redis/redis/v8"

	"realtime-chat/src/config"
)

type RedisConfig struct {
	Host string
	Port string
}

var redisConfig RedisConfig
var RedisClient *redis.Client
var PubSubConnection *redis.PubSub

/*
	Một phiên bản máy chủ go có một nhóm kết nối redis duy nhất
	Từ nhóm kết nối redis, một kết nối được sử dụng cho kết nối PubSub
	Kết nối đó được sử dụng để đăng ký nhiều kênh
	Một quy trình duy nhất được sử dụng để nghe tin nhắn trên tất cả các kênh đã đăng ký

	Máy chủ cũng duy trì một bản đồ cục bộ của tất cả các kết nối
	Khi một kết nối mới được thiết lập, nó sẽ được thêm vào bản đồ

	Mỗi phòng là một kênh trong redis
	Khi ai đó muốn tham gia một phòng, chúng tôi sẽ thêm họ vào redis set và kiểm tra xem máy chủ đã đăng ký phòng đó chưa
	Nếu không, chúng ta đăng ký phòng đó bằng kết nối PubSub chuyên dụng
	Kết nối pubsub giống nhau được sử dụng để đăng ký nhiều kênh
*/

func init() {
	redisConfig = RedisConfig{
		Host: config.Config.RedisHost,
		Port: config.Config.RedisPort,
	}
}

func InitRedis() {
	RedisClient = redis.NewClient(&redis.Options{
		Addr: fmt.Sprintf("%s:%s", redisConfig.Host, redisConfig.Port),
	})

	// Initialize PubSub connection
	ctx := context.Background()
	PubSubConnection = RedisClient.Subscribe(ctx)

	// Ping Redis to check if connection is established
	if err := RedisClient.Ping(ctx).Err(); err != nil {
		panic(err)
	}
}
