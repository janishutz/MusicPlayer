package routes

import (
	"crypto/ecdsa"
	"crypto/x509"
	"encoding/pem"
	"errors"
	"log"
	"musicplayer/config"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

var key *ecdsa.PrivateKey
var sig []byte

func initializeDevTokenGenerator(conf config.Config) {
	rawKey, err := os.ReadFile(conf.AppleMusicApi.KeyPath)
	if err != nil {
		log.Fatal("[FATAL] AppleMusic API Private Key loading failed! Error: ", err)
	}
	keyResult, err := ParsePKCS8PrivateKeyFromPEM(rawKey)
	if err != nil {
		log.Fatal("[FATAL] Private key parsing failed with error: ", err)
	}
	sig = rawKey
	key = keyResult
}

// From https://github.com/minchao/go-apple-music/blob/master/token/generator.go
// ParsePKCS8PrivateKeyFromPEM parses PEM encoded PKCS8 Private Key Structure.
func ParsePKCS8PrivateKeyFromPEM(key []byte) (*ecdsa.PrivateKey, error) {
	var err error

	var block *pem.Block
	if block, _ = pem.Decode(key); block == nil {
		return nil, errors.New("Invalid Key: Key must be PEM encoded PKCS8 private key")
	}

	var parsedKey interface{}
	if parsedKey, err = x509.ParsePKCS8PrivateKey(block.Bytes); err != nil {
		return nil, err
	}

	var pkey *ecdsa.PrivateKey
	var ok bool
	if pkey, ok = parsedKey.(*ecdsa.PrivateKey); !ok {
		return nil, errors.New("Key is not a valid PKCS8 private key")
	}

	return pkey, nil
}

// Use https://golang-jwt.github.io/jwt/usage/create/
// Github: https://github.com/golang-jwt/jwt
func devTokenHandler(conf config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		now := time.Now()
		t := jwt.Token{
			Method: jwt.SigningMethodES256,
			Header: map[string]interface{}{
				"alg": jwt.SigningMethodES256.Alg(),
				"kid": conf.AppleMusicApi.KeyID,
			},
			Claims: jwt.MapClaims{
				"iss":    conf.AppleMusicApi.TeamID,
				"iat":    now.Unix(),
				"exp":    now.Add(time.Second * time.Duration(86400)).Unix(),
				"origin": []string{conf.Urls.FrontendURL},
			},
			Signature: string(sig),
		}
		signed, err := t.SignedString(key)
		if err != nil {
			log.Print("Apple Music API JWT signing failed with error", err)
			c.AbortWithStatus(500)
		}
		c.JSON(200, gin.H{
			"token": signed,
		})
	}
}
