package utils

import (
	"crypto/rand"
	"encoding/base64"
)

func GenerateSessionToken(length int) (string, error) {
	token := make([]byte, length)

	_, err := rand.Read(token)
	if err != nil {
		return "", err
	}

	base64Token := base64.URLEncoding.EncodeToString(token)
	return base64Token, nil
}
