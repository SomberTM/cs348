package utils

import (
	"log"

	"github.com/jmoiron/sqlx"
)

var Conn *sqlx.DB

func InitDb() {
	db, err := sqlx.Open("postgres", "user=postgres password=password port=5433 dbname=cs348 sslmode=disable")
	if err != nil {
		log.Fatalf("Failed to connect %v", err)
	}

	Conn = db
}
