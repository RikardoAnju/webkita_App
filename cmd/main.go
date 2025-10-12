package main

import (
    "log"
    "BackendFramework/internal/config"
    "BackendFramework/internal/database"
    "github.com/joho/godotenv"
    "BackendFramework/internal/middleware"
    "BackendFramework/internal/route"
)

func init() {
    // Load .env file di root project
    if err := godotenv.Load(); err != nil {
        log.Println("  Tidak bisa load .env, pakai environment system")
    }
    
    log.Println("🔧 Initializing configuration...")
    config.InitEnvronment()
    config.InitDatabaseVars()
    config.InitEncryptionVars()
    config.InitBucketVars()
    config.InitEmailVars()
    
    log.Println("🔧 Initializing middleware...")
    middleware.InitLogger()
    middleware.InitValidator()
    
    log.Println("🔧 Opening database connections...")
    database.OpenWebkita()
    database.OpenAuth()
    
    log.Println(" Initialization complete!")
}

func main() {
    log.Println(" Starting server on :8080...")
    router := route.SetupRouter()
   
    if err := router.Run(":8080"); err != nil {
        log.Fatalf(" Failed to start server: %v", err)
    }
}