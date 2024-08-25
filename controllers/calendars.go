package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type CreateCalendarRequest struct {
	Name string `json:"name" binding:"required"`
}

func CreateCalendar(c *gin.Context) {
	var request CreateCalendarRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

}
