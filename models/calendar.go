package models

type Calendar struct {
	Id     string `json:"id"`
	UserId string `json:"user_id" db:"user_id"`
	Name   string `json:"name"`
}
