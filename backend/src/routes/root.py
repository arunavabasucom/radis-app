from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def root_handler():
    return {"message": "Hello World"}