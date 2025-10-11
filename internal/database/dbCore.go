package database

import (
	"log"
	"strings"
	"BackendFramework/internal/config"
	"BackendFramework/internal/model"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	DbWebkita *gorm.DB
)

func OpenWebkita() {
	var err error

	
	log.Printf("🔹 DB Config - Username: '%s', Hostname: '%s', DBName: '%s'",
		config.DB_WEBKITA_USERNAME, config.DB_WEBKITA_HOSTNAME, config.DB_WEBKITA_DBNAME)


	dsn := config.DB_WEBKITA_USERNAME + ":" +
		config.DB_WEBKITA_PASSWORD + "@tcp(" +
		config.DB_WEBKITA_HOSTNAME + ")/" +
		config.DB_WEBKITA_DBNAME +
		"?charset=utf8mb4&parseTime=true&loc=Local"


	
	safeDSN := strings.Replace(dsn, config.DB_WEBKITA_PASSWORD, "****", 1)
	log.Printf("🔹 Connecting to DB Webkita: %s", safeDSN)

	
	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
		
	}

	
	DbWebkita, err = gorm.Open(mysql.Open(dsn), gormConfig)
	if err != nil {
		log.Fatalf(" Failed to connect to DB Webkita with GORM: %v", err)
	}

	
	sqlDB, err := DbWebkita.DB()
	if err != nil {
		log.Fatalf(" Failed to get underlying sql.DB from GORM: %v", err)
	}

	
	if err = sqlDB.Ping(); err != nil {
		log.Fatalf(" DB Webkita connection error: %v", err)
	}

	log.Println(" Connected to DB Webkita")

	
	ConfigureConnectionPool()

	
	AutoMigrate()
}


func ConfigureConnectionPool() {
	sqlDB, err := DbWebkita.DB()
	if err != nil {
		log.Fatalf(" Failed to get underlying sql.DB: %v", err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	log.Println("  Connection pool configured")
}


func AutoMigrate() {
	log.Println(" Starting database auto-migration...")

	err := DbWebkita.AutoMigrate(
		&model.User{},
		&model.Project{},
	)

	if err != nil {
		log.Fatalf(" Failed to auto-migrate database: %v", err)
	}

	log.Println(" Database auto-migration completed successfully")
}


func CloseWebkita() {
	sqlDB, err := DbWebkita.DB()
	if err != nil {
		log.Printf(" Failed to get underlying sql.DB: %v", err)
		return
	}

	err = sqlDB.Close()
	if err != nil {
		log.Printf(" Failed to close database connection: %v", err)
		return
	}

	log.Println(" DB Webkita connection closed")
}


func CloseAll() {
	CloseWebkita()
}