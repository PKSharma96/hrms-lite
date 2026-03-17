from pydantic import BaseModel, EmailStr
from datetime import date
from typing import List, Optional

class MemberBase(BaseModel):
    reference_id: str
    name: str
    contact_email: EmailStr
    team_unit: str

class MemberCreate(MemberBase):
    pass

class Member(MemberBase):
    id: int
    count_present: Optional[int] = 0
    count_absent: Optional[int] = 0

    class Config:
        from_attributes = True

class RecordBase(BaseModel):
    reference_id: str
    logged_date: date
    presence_status: str

class RecordCreate(RecordBase):
    pass

class Record(RecordBase):
    id: int

    class Config:
        from_attributes = True

class ImpactOverview(BaseModel):
    staff_count: int
    active_today: int
    inactive_today: int
