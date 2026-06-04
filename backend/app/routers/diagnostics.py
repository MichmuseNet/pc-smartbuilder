import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.db.session import get_session
from app.models.diagnostics import Diagnostic
from app.schemas.diagnostics import DiagnosticCreate, DiagnosticRead
from app.services.diagnostics_service import analyze_system

router = APIRouter(prefix="/diagnostics", tags=["diagnostics"])

@router.post("/", response_model=DiagnosticRead, status_code=201)
async def create_diagnostic(
    data: DiagnosticCreate,
    session: AsyncSession = Depends(get_session)
):
    try:
        analysis = await analyze_system(data.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error con Groq: {str(e)}")

    diagnostic = Diagnostic(
        user_id=data.user_id,
        os_version=data.os_version,
        cpu=data.cpu,
        gpu=data.gpu,
        ram=data.ram,
        storage=data.storage,
        extra_info=data.extra_info,
        result=analysis["result"],
        system_score=analysis["system_score"]
    )

    session.add(diagnostic)
    await session.commit()
    await session.refresh(diagnostic)
    return diagnostic


@router.get("/user/{user_id}", response_model=list[DiagnosticRead])
async def get_user_diagnostics(
    user_id: uuid.UUID,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Diagnostic).where(Diagnostic.user_id == user_id)
    )
    return result.scalars().all()