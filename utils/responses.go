package utils

import "github.com/gin-gonic/gin"

func CreateErrorResponse(message string) map[string]any {
	return gin.H{"error": message, "success": false}
}

type ErrorCode int

func CreateErrorResponseWithCode(message string, code ErrorCode) map[string]any {
	return gin.H{"error": message, "code": code, "success": false}
}

func CreateSuccessResponse(data any) map[string]any {
	return gin.H{"data": data, "success": true}
}
