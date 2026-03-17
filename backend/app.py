from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

import core, entities, contracts
from engine import SessionLocal, engine, provide_session

# Initialize schemas
entities.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite Attendance API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    return {"status": "operational", "system": "HRMS Lite Attendance System"}

# Member Registry
@app.post("/staff/registry", response_model=contracts.Member, status_code=status.HTTP_201_CREATED)
def enroll_member(member: contracts.MemberCreate, db: Session = Depends(provide_session)):
    exists = core.fetch_member_by_ref(db, reference_id=member.reference_id)
    if exists:
        raise HTTPException(status_code=400, detail="Reference ID already in use")
    
    email_exists = core.fetch_member_by_email(db, contact_email=member.contact_email)
    if email_exists:
        raise HTTPException(status_code=400, detail="Contact email already registered")
        
    return core.onboard_member(db=db, member=member)

@app.get("/staff/registry", response_model=List[contracts.Member])
def get_registry(skip: int = 0, limit: int = 100, db: Session = Depends(provide_session)):
    return core.list_all_members(db, skip=skip, limit=limit)

@app.delete("/staff/registry/{reference_id}", response_model=contracts.Member)
def offboard_member(reference_id: str, db: Session = Depends(provide_session)):
    removed = core.terminate_member(db, reference_id=reference_id)
    if removed is None:
        raise HTTPException(status_code=404, detail="Member record not found")
    return removed

# Presence Logging
@app.post("/presence/logs", response_model=contracts.Record, status_code=status.HTTP_201_CREATED)
def record_presence(record: contracts.RecordCreate, db: Session = Depends(provide_session)):
    member = core.fetch_member_by_ref(db, reference_id=record.reference_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member reference not found")
    
    existing = db.query(entities.PresenceLog).filter(
        entities.PresenceLog.reference_id == record.reference_id,
        entities.PresenceLog.logged_date == record.logged_date
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Entry already exists for this date")

    return core.register_presence(db=db, record=record)

@app.get("/presence/logs/{reference_id}", response_model=List[contracts.Record])
def view_member_logs(reference_id: str, db: Session = Depends(provide_session)):
    return core.fetch_logs_by_member(db, reference_id=reference_id)

@app.get("/presence/registry", response_model=List[contracts.Record])
def view_all_logs(skip: int = 0, limit: int = 500, db: Session = Depends(provide_session)):
    return core.fetch_all_logs(db, skip=skip, limit=limit)

# Analytics Overview
from datetime import date as date_type

@app.get("/analytics/overview", response_model=contracts.ImpactOverview)
def get_analytics(date: Optional[date_type] = None, db: Session = Depends(provide_session)):
    return core.calculate_impact_stats(db, target_date=date)
