package controllers

import (
	"cs348/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(c *gin.Context) {
	username, password, ok := c.Request.BasicAuth()
	if !ok {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse("No username or password provided"))
		return
	}

	if len(username) == 0 || len(password) == 0 {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse("Empty username or password"))
		return
	}

	var exists bool
	_ = utils.Conn.GetContext(c.Request.Context(), &exists, "SELECT EXISTS (SELECT 1 FROM users WHERE user_name = $1)", username)
	if exists {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse("User already exists"))
		return
	}

	password_hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse("Failed to hash password"))
		return
	}

	_, err = utils.Conn.ExecContext(c.Request.Context(), "INSERT INTO users (id, user_name, password_hash) VALUES (default, $1, $2)", username, string(password_hash))
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse("Failed to create user"))
		return
	}

	c.JSON(http.StatusOK, utils.CreateSuccessResponse(nil))
}
