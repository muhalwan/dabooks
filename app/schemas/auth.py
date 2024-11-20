from marshmallow import Schema, fields, validate
from app.constants import (
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH,
    PASSWORD_MIN_LENGTH
)

class RegisterSchema(Schema):
    username = fields.Str(
        required=True,
        validate=validate.Length(min=USERNAME_MIN_LENGTH, max=USERNAME_MAX_LENGTH)
    )
    email = fields.Email(required=True)
    password = fields.Str(
        required=True,
        validate=validate.Length(min=PASSWORD_MIN_LENGTH)
    )

class LoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)