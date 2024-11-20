from datetime import datetime
from bson import ObjectId
from app.extensions import mongo
from app.utils.helpers import convert_object_id

class BaseModel:
    collection = None

    @classmethod
    def _get_collection(cls):
        if not cls.collection:
            raise NotImplementedError("Collection name must be specified")
        return getattr(mongo.db, cls.collection)

    @classmethod
    def create(cls, **data):
        """Base create method with timestamp"""
        data['created_at'] = datetime.utcnow()
        data['updated_at'] = datetime.utcnow()
        result = cls._get_collection().insert_one(data)
        return result.inserted_id

    @classmethod
    def find_by_id(cls, id):
        """Base method to find document by ID"""
        try:
            result = cls._get_collection().find_one({"_id": ObjectId(id)})
            return convert_object_id(result) if result else None
        except Exception:
            return None

    @classmethod
    def find_one(cls, filter_dict):
        """Base method to find one document"""
        result = cls._get_collection().find_one(filter_dict)
        return convert_object_id(result) if result else None

    @classmethod
    def update_by_id(cls, id, update_dict):
        """Base update method with timestamp"""
        update_dict['updated_at'] = datetime.utcnow()
        return cls._get_collection().update_one(
            {"_id": ObjectId(id)},
            {"$set": update_dict}
        )