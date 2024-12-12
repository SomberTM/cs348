package utils

import (
	"database/sql"
	"encoding/json"
)

type NullString struct {
	sql.NullString
}

func (ns NullString) MarshalJSON() ([]byte, error) {
	if ns.Valid {
		return json.Marshal(ns.String)
	}
	return json.Marshal(nil)
}

func (ns *NullString) UnmarshalJSON(data []byte) error {
	if len(data) == 0 || string(data) == "null" {
		ns.String = ""
		ns.Valid = false
		return nil
	}

	// Unmarshal the value into the string field
	if err := json.Unmarshal(data, &ns.String); err != nil {
		return err
	}

	ns.Valid = true
	return nil
}
