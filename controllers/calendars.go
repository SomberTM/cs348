package controllers

import (
	"cs348/middleware"
	"cs348/models"
	"cs348/utils"
	"database/sql"
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

func UpdateCalendar(c *gin.Context) {
	user, exit := middleware.UseRequireUser(c)
	if exit {
		return
	}

	var calendar models.Calendar
	if err := c.ShouldBindJSON(&calendar); err != nil {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse(err.Error()))
		return
	}

	if user.Id != calendar.UserId {
		c.JSON(http.StatusUnauthorized, utils.CreateErrorResponse("You do not own this calendar"))
		return
	}

	_, err := utils.Conn.ExecContext(c.Request.Context(), "UPDATE calendars SET name = $1 WHERE id = $2 AND user_id = $3", calendar.Name, calendar.Id, calendar.UserId)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse(err.Error()))
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

func GetCalendar(c *gin.Context) {
	user, exit := middleware.UseRequireUser(c)
	if exit {
		return
	}

	calendarId := c.Param("calendarId")
	if calendarId == "" {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse("Empty input provided"))
		return
	}

	calendar := models.Calendar{}
	err := utils.Conn.GetContext(c.Request.Context(), &calendar, "SELECT * FROM calendars WHERE id = $1 ANd user_id = $2", calendarId, user.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.CreateSuccessResponse(calendar))
}

func DeleteCalendar(c *gin.Context) {
	user, exit := middleware.UseRequireUser(c)
	if exit {
		return
	}

	calendarId := c.Param("calendarId")
	if calendarId == "" {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse("Empty input provided"))
		return
	}

	tx, err := utils.Conn.BeginTxx(c.Request.Context(), &sql.TxOptions{Isolation: sql.LevelReadCommitted})
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse(err.Error()))
		return
	}

	_, err = tx.ExecContext(c.Request.Context(), "DELETE FROM calendars WHERE id = $1 AND user_id = $2", calendarId, user.Id)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse(err.Error()))
		return
	}

	_, err = tx.ExecContext(c.Request.Context(), "DELETE FROM calendar_events WHERE calendar_id = $1 AND user_id = $2", calendarId, user.Id)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse(err.Error()))
		return
	}

	err = tx.Commit()
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusNoContent, utils.CreateSuccessResponse(nil))
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

type CreateCalendarEventRequest struct {
	Title       string           `json:"title" binding:"required"`
	Description utils.NullString `json:"description"`
	StartDate   time.Time        `json:"start_date" binding:"required"`
	EndDate     time.Time        `json:"end_date" binding:"required"`
}

func CreateCalendarEvent(c *gin.Context) {
	user, exit := middleware.UseRequireUser(c)
	if exit {
		return
	}

	calendarId := c.Param("calendarId")

	var request CreateCalendarEventRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse(err.Error()))
		return
	}

	calendar_event := models.CalendarEvent{
		Title:       request.Title,
		Description: request.Description,
		StartDate:   request.StartDate,
		EndDate:     request.EndDate,
		CalendarId:  calendarId,
		UserId:      user.Id,
	}

	err := utils.Conn.GetContext(c.Request.Context(), &calendar_event.Id, "INSERT INTO calendar_events (id, user_id, calendar_id, title, description, start_date, end_date) VALUES (default, $1, $2, $3, $4, $5, $6) RETURNING id", calendar_event.UserId, calendar_event.CalendarId, calendar_event.Title, calendar_event.Description, calendar_event.StartDate, calendar_event.EndDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, utils.CreateSuccessResponse(calendar_event))
}

func DeleteCalendarEvent(c *gin.Context) {
	user, exit := middleware.UseRequireUser(c)
	if exit {
		return
	}

	calendarId := c.Param("calendarId")
	eventId := c.Param("eventId")

	_, err := utils.Conn.ExecContext(c.Request.Context(), "DELETE FROM calendar_events WHERE id = $1 AND user_id = $2 AND calendar_id = $3", eventId, user.Id, calendarId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, utils.CreateErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, nil)
}

func UpdateCalendarEvent(c *gin.Context) {
	user, exit := middleware.UseRequireUser(c)
	if exit {
		return
	}

	var calendarEvent models.CalendarEvent
	if err := c.ShouldBindJSON(&calendarEvent); err != nil {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse(err.Error()))
		return
	}

	if user.Id != calendarEvent.UserId {
		c.JSON(http.StatusUnauthorized, utils.CreateErrorResponse("You do not own this calendar"))
		return
	}

	result, err := utils.Conn.ExecContext(c.Request.Context(), "UPDATE calendar_events SET title = $1, description = $2, start_date = $3, end_date = $4, recurrence = $5, recurrence_end_date = $6 WHERE id = $7 AND calendar_id = $8 AND user_id = $9", calendarEvent.Title, calendarEvent.Description, calendarEvent.StartDate, calendarEvent.EndDate, calendarEvent.Recurrence, calendarEvent.RecurrenceEndDate, calendarEvent.Id, calendarEvent.CalendarId, calendarEvent.UserId)
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse(err.Error()))
		return
	}

	rows_affected, err := result.RowsAffected()
	if err != nil {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse(err.Error()))
		return
	}

	if rows_affected == 0 {
		c.JSON(http.StatusBadRequest, utils.CreateErrorResponse("No such calendar event exists"))
		return
	}

	c.JSON(http.StatusOK, utils.CreateSuccessResponse(calendarEvent))
}
