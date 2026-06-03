import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.db.session import get_session
from app.models.compatibility import CompatibilityCheck
from app.schemas.compatibility import CompatibilityCreate, CompatibilityRead
from app.services.compatibility_service import check_compatibility

router = APIRouter(prefix="/compatibility", tags=["compatibility"])

@router.post("/", response_model=CompatibilityRead, status_code=201)
async def create_compatibility_check(
    data: CompatibilityCreate,
    session: AsyncSession = Depends(get_session)
):
    try:
        analysis = await check_compatibility(data.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error con Groq: {str(e)}")

    check = CompatibilityCheck(
        user_id=data.user_id,
        cpu=data.cpu,
        gpu=data.gpu,
        ram=data.ram,
        motherboard=data.motherboard,
        psu=data.psu,
        storage=data.storage,
        result=analysis["result"],
        is_compatible=analysis["is_compatible"]
    )

    session.add(check)
    await session.commit()
    await session.refresh(check)
    return check


@router.get("/user/{user_id}", response_model=list[CompatibilityRead])
async def get_user_compatibility_checks(
    user_id: uuid.UUID,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(CompatibilityCheck).where(CompatibilityCheck.user_id == user_id)
    )
    return result.scalars().all()