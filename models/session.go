package models

import (
	"cs348/utils"
	"time"
)

type Session struct {
	Id      string    `json:"id"`
	UserId  string    `json:"user_id"`
	Token   string    `json:"token"`
	Expires time.Time `json:"expires"`
}

// Creates a new session with a generated session token
func NewSession() (*Session, error) {
	token, err := utils.GenerateSessionToken(32)
	if err != nil {
		return nil, err
	}

	return &Session{
		Token:   token,
		Expires: time.Now().UTC().Add(utils.SessionExpirationTime),
	}, nil
}

func (s *Session) WithUserId(userId string) *Session {
	s.UserId = userId
	return s
}
