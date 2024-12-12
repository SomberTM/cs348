package models

import (
	"cs348/utils"
	"database/sql"
	"time"
)

const (
	DailyRecurrence   = "daily"
	WeeklyRecurrence  = "weekly"
	MonthlyRecurrence = "monthly"
	YearlyRecurrence  = "yearly"
)

type CalendarEvent struct {
	Id                string           `json:"id"`
	UserId            string           `json:"user_id" db:"user_id"`
	CalendarId        string           `json:"calendar_id" db:"calendar_id"`
	Title             string           `json:"title"`
	Description       utils.NullString `json:"description"`
	StartDate         time.Time        `json:"start_date" db:"start_date"`
	EndDate           time.Time        `json:"end_date" db:"end_date"`
	Recurrence        utils.NullString `json:"recurrence" db:"recurrence"`
	RecurrenceEndDate sql.NullTime     `json:"recurrence_end_date" db:"recurrence_end_date"`
}
