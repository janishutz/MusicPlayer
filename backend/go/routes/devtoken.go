package routes

import "github.com/gin-gonic/gin"

// Use https://golang-jwt.github.io/jwt/usage/create/
// Github: https://github.com/golang-jwt/jwt
func devTokenHandler(c *gin.Context)  {
	c.JSON(200, gin.H{
		"token": "test",
	})
}
