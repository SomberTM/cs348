package utils

import "github.com/gin-gonic/gin"

func CreateErrorResponse(message string) map[string]any {
	return gin.H{"error": message, "success": false}
}
