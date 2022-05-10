package samples

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
)

const (
	salt1 = "_"
	salt2 = "_"
)

func sign(key []byte, msg string) []byte {
	mac := hmac.New(sha256.New, key)
	mac.Write([]byte(msg))
	return mac.Sum(nil)
}

func GetSignature(apikey string, datetime, endpoint, path string) string {
	k1 := sign([]byte(salt1+apikey), datetime)
	k2 := sign(k1, endpoint)
	k3 := sign(k2, path)
	k := sign(k3, salt2)
	return base64.URLEncoding.EncodeToString(k)
}
