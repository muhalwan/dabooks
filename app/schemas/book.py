from marshmallow import Schema, fields, validate
from app.constants import MIN_RATING, MAX_RATING

class BookSchema(Schema):
    title = fields.Str(required=True)
    author = fields.Str(required=True)
    description = fields.Str()

class ReviewSchema(Schema):
    text = fields.Str(required=True)
    rating = fields.Int(
        required=True,
        validate=validate.Range(min=MIN_RATING, max=MAX_RATING)
    )