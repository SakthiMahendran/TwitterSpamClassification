from django.db import models

class User(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)  # Use hashed passwords in production
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username
