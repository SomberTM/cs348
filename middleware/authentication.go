package middleware

import (
	"cs348/models"
	"cs348/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UseAuthentication(c *gin.Context) {
	token, err := c.Cookie(utils.SessionCookieName)
	if err != nil {
		c.Status(http.StatusUnauthorized)
		return
	}

	var user models.User
	err = utils.Conn.GetContext(c.Request.Context(), &user, "SELECT u.id, u.user_name FROM sessions as s INNER JOIN users as u ON u.id = s.user_id WHERE s.token = $1", token)
	if err != nil {
		c.Status(http.StatusUnauthorized)
		return
	}

	c.Set("user", user)
	c.Next()
}

func UseUser(c *gin.Context) (*models.User, bool) {
	rawUser := c.Value("user")
	if rawUser == nil {
		return nil, false
	}

	user := rawUser.(models.User)
	return &user, true
}
