from bson import ObjectId

def convert_object_id(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    return obj