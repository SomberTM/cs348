package controllers

import (
	"cs348/models"
	"cs348/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Login(c *gin.Context) {
	username, password, ok := c.Request.BasicAuth()
	if !ok {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse("No username or password provided"))
		return
	}

	if len(username) == 0 || len(password) == 0 {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse("Empty username or password"))
		return
	}

	var user models.User
	err := utils.Conn.GetContext(c.Request.Context(), &user, "SELECT * FROM users WHERE user_name = $1", username)
	if err != nil {
		c.JSON(http.StatusUnauthorized, utils.CreateErrorResponse("Invalid username or password"))
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, utils.CreateErrorResponse("Invalid username or password"))
		return
	}

	session, err := models.NewSession()
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse("Error creating session"))
		return
	}

	_, err = utils.Conn.ExecContext(
		c.Request.Context(),
		"INSERT INTO sessions (id, user_id, token, expires) values (default, $1, $2, $3)",
		user.Id, session.Token, session.Expires,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse("Error creating session"))
		return
	}

	c.Status(http.StatusOK)
	c.SetCookie(utils.SessionCookieName, session.Token, int(utils.SessionExpirationTime.Seconds()), "/", "", true, true)
}

func Logout(c *gin.Context) {
	token, err := c.Cookie(utils.SessionCookieName)
	if err != nil {
		c.Status(http.StatusUnauthorized)
		return
	}

	_, err = utils.Conn.ExecContext(c.Request.Context(), "DELETE FROM sessions WHERE token = $1", token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse("Error deleting session"))
		return
	}

	c.SetCookie(utils.SessionCookieName, "", 0, "/", "", true, true)
	c.Status(http.StatusOK)
}
