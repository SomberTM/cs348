package utils

import (
	"log"
	"time"

	"github.com/jmoiron/sqlx"
)

var Conn *sqlx.DB

func InitDb() {
	db, err := sqlx.Open("postgres", "user=postgres password=password port=5433 dbname=cs348 sslmode=disable")
	if err != nil {
		log.Fatalf("Failed to connect %v", err)
	}

	Conn = db

	go CleanupSessions()
}

func CleanupSessions() {
	for {
		time.Sleep(5 * time.Minute)

		if Conn == nil {
			log.Printf("Failed to cleanup sessions: no active database connection available.")
			continue
		}

		r, err := Conn.Exec("DELETE FROM sessions WHERE current_timestamp > expires")
		if err != nil {
			log.Printf("Failed to cleanup sessions: %v", err)
			continue
		}

		affected, err := r.RowsAffected()

		log.Printf("Session cleanup finished:")
		if err == nil {
			log.Printf("%d rows affected.", affected)
		}
	}
}
