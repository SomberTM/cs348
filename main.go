package main

import (
	"cs348/controllers"
	"cs348/middleware"
	"cs348/utils"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"

	_ "github.com/lib/pq"
)

var Conn *sqlx.DB

func cleanupSessions() {
	for {
		time.Sleep(5 * time.Minute)

		r, err := Conn.Exec("delete from sessions where expires > current_timestamp")
		if err != nil {
			log.Printf("Failed to cleanup sessions: %v", err)
			continue
		}

		affected, err := r.RowsAffected()

		log.Printf("Session cleanup finished:")
		if err == nil {
			log.Printf("%d rows affected.", affected)
		}
	}
}

func main() {
	utils.InitDb()

	go cleanupSessions()

	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})

	authorization := r.Group("/auth")
	{
		authorization.POST("/login", controllers.Login)
		authorization.POST("/login", controllers.Logout)
	}

	users := r.Group("/users")
	{
		users.POST("/", controllers.CreateUser)
	}

	authenticated := r.Group("/")
	authenticated.Use(middleware.UseAuthentication)
	{
		calendars := r.Group("/calendars")
		{
			calendars.POST("/", controllers.CreateCalendar)
		}
	}

	r.Run()
}
