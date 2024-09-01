package controllers

import (
	"cs348/middleware"
	"cs348/models"
	"cs348/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type CreateCalendarRequest struct {
	Name string `json:"name" binding:"required"`
}

func CreateCalendar(c *gin.Context) {
	user, exit := middleware.UseRequireUser(c)
	if exit {
		return
	}

	var request CreateCalendarRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse(err.Error()))
		return
	}

	calendar := models.Calendar{
		Name:   request.Name,
		UserId: user.Id,
	}
	err := utils.Conn.GetContext(c.Request.Context(), &calendar.Id, "INSERT INTO calendars (id, user_id, name) VALUES (default, $1, $2) RETURNING id", calendar.UserId, calendar.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.CreateSuccessResponse(calendar))
}

func ListCalendars(c *gin.Context) {
	user, exit := middleware.UseRequireUser(c)
	if exit {
		return
	}

	calendars := []models.Calendar{}
	err := utils.Conn.SelectContext(c.Request.Context(), &calendars, "SELECT * FROM calendars WHERE user_id = $1", user.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.CreateSuccessResponse(calendars))
}

type ListCalendarEventsRequest struct {
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
}

func ListCalendarEvents(c *gin.Context) {
	user, exit := middleware.UseRequireUser(c)
	if exit {
		return
	}

	calendarId := c.Param("calendarId")

	var request ListCalendarEventsRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse(err.Error()))
		return
	}

	events := []models.CalendarEvent{}
	err := utils.Conn.SelectContext(c.Request.Context(), &events, "SELECT * FROM calendar_events WHERE user_id = $1 AND calendar_id = $2 AND start_date > $3 AND end_date < $4", user.Id, calendarId, request.StartDate, request.EndDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.CreateSuccessResponse(events))
}
