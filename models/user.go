package models

type User struct {
	Id           string `json:"id"`
	UserName     string `json:"user_name" db:"user_name"`
	PasswordHash []byte `json:"-" db:"password_hash"`
}
