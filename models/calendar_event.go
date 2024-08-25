package models

import (
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
	Id                string         `json:"id"`
	UserId            string         `json:"user_id"`
	CalendarId        string         `json:"calendar_id"`
	Title             string         `json:"title"`
	Description       sql.NullString `json:"description"`
	StartDate         time.Time      `json:"start_date"`
	EndDate           time.Time      `json:"end_data"`
	Recurrence        sql.NullString `json:"recurrence"`
	RecurrenceEndDate sql.NullTime   `json:"recurrence_end_date"`
}
