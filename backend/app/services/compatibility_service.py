import os
import httpx
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

async def check_compatibility(data: dict) -> dict:
    prompt = f"""
    Eres un experto en hardware de computadoras. Un usuario quiere verificar si sus componentes son compatibles entre sí.
    
    Componentes del usuario:
    - CPU: {data.get('cpu') or 'No especificado'}
    - GPU: {data.get('gpu') or 'No especificado'}
    - RAM: {data.get('ram') or 'No especificado'}
    - Motherboard: {data.get('motherboard') or 'No especificado'}
    - PSU (Fuente de poder): {data.get('psu') or 'No especificado'}
    - Storage: {data.get('storage') or 'No especificado'}
    
    Por favor analiza la compatibilidad de estos componentes y responde en formato markdown con:
    
    ## Resultado general
    Indica claramente si los componentes son COMPATIBLES o INCOMPATIBLES
    
    ## Análisis por componente
    Para cada componente especificado analiza:
    - Si es compatible con los demás
    - Posibles problemas o advertencias
    
    ## Cuellos de botella detectados
    Indica si hay algún componente que limite el rendimiento de los demás
    
    ## Recomendaciones
    Sugerencias para mejorar la compatibilidad o el rendimiento
    
    Al inicio de tu respuesta incluye una línea que diga exactamente:
    COMPATIBLE: SI
    o
    COMPATIBLE: NO
    según corresponda.
    
    Responde en español.
    """

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 1500
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(GROQ_URL, json=body, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        result = data["choices"][0]["message"]["content"]
        is_compatible = "COMPATIBLE: SI" in result.upper()
        return {
            "result": result,
            "is_compatible": is_compatible
        }