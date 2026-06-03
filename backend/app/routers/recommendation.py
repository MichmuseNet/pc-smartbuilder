import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from app.db.session import get_session
from app.models.recommendation import Recommendation
from app.schemas.recommendation import RecommendationCreate, RecommendationRead
from app.services.groq_service import get_pc_recommendation

router = APIRouter(prefix="/recommendations", tags=["recommendations"])

@router.post("/", response_model=RecommendationRead, status_code=201)
async def create_recommendation(
    data: RecommendationCreate,
    session: AsyncSession = Depends(get_session)
):
    try:
        result = await get_pc_recommendation(data.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error con Groq: {str(e)}")
    recommendation = Recommendation(
        user_id=data.user_id,
        use_case=data.use_case,
        budget=data.budget,
        preferred_brand=data.preferred_brand,
        resolution=data.resolution,
        target_fps=data.target_fps,
        advanced=data.advanced,
        ram=data.ram,
        gpu=data.gpu,
        cpu=data.cpu,
        storage=data.storage,
        result=result
    )

    session.add(recommendation)
    await session.commit()
    await session.refresh(recommendation)
    return recommendation


@router.get("/user/{user_id}", response_model=list[RecommendationRead])
async def get_user_recommendations(
    user_id: uuid.UUID,
    session: AsyncSession = Depends(get_session)
):
    result = await session.execute(
        select(Recommendation).where(Recommendation.user_id == user_id)
    )
    return result.scalars().all()