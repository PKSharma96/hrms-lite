from sqlalchemy import Column, Integer, String, Date, ForeignKey, UniqueConstraint
from engine import Base

class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    reference_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    contact_email = Column(String, unique=True, index=True, nullable=False)
    team_unit = Column(String, nullable=False)

class PresenceLog(Base):
    __tablename__ = "presence_logs"

    id = Column(Integer, primary_key=True, index=True)
    reference_id = Column(String, ForeignKey("members.reference_id", ondelete="CASCADE"), nullable=False)
    logged_date = Column(Date, nullable=False)
    presence_status = Column(String, nullable=False) 

    __table_args__ = (UniqueConstraint('reference_id', 'logged_date', name='_member_date_uc'),)
