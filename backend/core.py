from sqlalchemy.orm import Session
from datetime import date
import entities as models
import contracts as schemas

def fetch_member_by_ref(db: Session, reference_id: str):
    return db.query(models.Member).filter(models.Member.reference_id == reference_id).first()

def fetch_member_by_email(db: Session, contact_email: str):
    return db.query(models.Member).filter(models.Member.contact_email == contact_email).first()

def list_all_members(db: Session, skip: int = 0, limit: int = 100):
    members = db.query(models.Member).offset(skip).limit(limit).all()
    for m in members:
        m.count_present = db.query(models.PresenceLog).filter(
            models.PresenceLog.reference_id == m.reference_id,
            models.PresenceLog.presence_status == "Present"
        ).count()
        m.count_absent = db.query(models.PresenceLog).filter(
            models.PresenceLog.reference_id == m.reference_id,
            models.PresenceLog.presence_status == "Absent"
        ).count()
    return members

def onboard_member(db: Session, member: schemas.MemberCreate):
    db_member = models.Member(
        reference_id=member.reference_id,
        name=member.name,
        contact_email=member.contact_email,
        team_unit=member.team_unit
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

def terminate_member(db: Session, reference_id: str):
    db_member = db.query(models.Member).filter(models.Member.reference_id == reference_id).first()
    if db_member:
        db.delete(db_member)
        db.commit()
    return db_member

def register_presence(db: Session, record: schemas.RecordCreate):
    db_log = models.PresenceLog(
        reference_id=record.reference_id,
        logged_date=record.logged_date,
        presence_status=record.presence_status
    )
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def fetch_logs_by_member(db: Session, reference_id: str):
    return db.query(models.PresenceLog).filter(models.PresenceLog.reference_id == reference_id).all()

def fetch_all_logs(db: Session, skip: int = 0, limit: int = 500):
    return db.query(models.PresenceLog).order_by(models.PresenceLog.logged_date.desc()).offset(skip).limit(limit).all()

def calculate_impact_stats(db: Session, target_date: date = None):
    if target_date is None:
        target_date = date.today()
        
    staff_count = db.query(models.Member).count()
    active_today = db.query(models.PresenceLog).filter(models.PresenceLog.logged_date == target_date, models.PresenceLog.presence_status == "Present").count()
    inactive_today = db.query(models.PresenceLog).filter(models.PresenceLog.logged_date == target_date, models.PresenceLog.presence_status == "Absent").count()
    
    return schemas.ImpactOverview(
        staff_count=staff_count,
        active_today=active_today,
        inactive_today=inactive_today
    )
