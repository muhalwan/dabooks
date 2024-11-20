from bson import ObjectId
from datetime import datetime
from flask import request


def convert_object_id(obj):
    """Convert MongoDB ObjectId to string representation"""
    if isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, dict):
        return {k: convert_object_id(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_object_id(item) for item in obj]
    elif isinstance(obj, datetime):
        return obj.isoformat()
    return obj


def parse_pagination_params(args):
    """Parse pagination parameters from request args"""
    try:
        page = max(1, int(args.get('page', 1)))
        per_page = min(max(1, int(args.get('per_page', 10))), 50)
        return page, per_page
    except (TypeError, ValueError):
        return 1, 10


def parse_sort_params(args):
    """Parse sorting parameters from request args"""
    allowed_sort_fields = {'title', 'rating', 'popularity'}
    sort_by = args.get('sort', 'title')
    sort_order = args.get('order', 'asc')

    if sort_by not in allowed_sort_fields:
        sort_by = 'title'
    if sort_order not in {'asc', 'desc'}:
        sort_order = 'asc'

    return sort_by, sort_order


def validate_object_id(id_str):
    """Validate if a string is a valid ObjectId"""
    try:
        ObjectId(id_str)
        return True
    except:
        return False