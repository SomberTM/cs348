package main

import (
	"cs348/controllers"
	"cs348/middleware"
	"cs348/utils"

	"github.com/gin-gonic/gin"

	_ "github.com/lib/pq"
)

func main() {
	utils.InitDb()

	r := gin.Default()
	r.Use(middleware.UseCors())

	authentication := r.Group("/auth")
	{
		authentication.POST("/login", controllers.Login)
		authentication.POST("/logout", controllers.Logout)
	}

	users := r.Group("/users")
	{
		users.POST("/", controllers.CreateUser)
	}

	authorized := r.Group("/")
	authorized.Use(middleware.UseAuthentication)
	{
		authorized.GET("/me", controllers.Me)

		calendars := authorized.Group("/calendars")
		{
			calendars.POST("/", controllers.CreateCalendar)
		}
	}

	r.Run()
}
