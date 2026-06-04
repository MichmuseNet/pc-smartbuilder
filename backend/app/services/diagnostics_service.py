import os
import httpx
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

async def analyze_system(data: dict) -> dict:
    prompt = f"""
    Eres un experto en optimización de sistemas y hardware de computadoras.
    Un usuario quiere optimizar su PC existente.
    
    Especificaciones del sistema:
    - Sistema operativo: {data.get('os_version') or 'No especificado'}
    - CPU: {data.get('cpu') or 'No especificado'}
    - GPU: {data.get('gpu') or 'No especificado'}
    - RAM: {data.get('ram') or 'No especificado'}
    - Almacenamiento: {data.get('storage') or 'No especificado'}
    - Información adicional: {data.get('extra_info') or 'Ninguna'}
    
    Por favor analiza este sistema y responde en formato markdown con:
    
    ## Puntuación del sistema
    Dale una puntuación del 1 al 100 basada en el rendimiento general.
    Incluye una línea que diga exactamente: SCORE: [número]
    
    ## Estado general
    Resumen del estado actual del sistema
    
    ## Drivers que podrían necesitar actualización
    Lista los drivers más importantes que probablemente necesiten actualización
    para este hardware específico, con links de búsqueda en formato markdown.
    
    ## Optimizaciones recomendadas
    Lista de acciones concretas que el usuario puede hacer para mejorar el rendimiento:
    - Configuraciones del sistema operativo
    - Limpieza de archivos temporales
    - Programas que podrían estar consumiendo recursos
    
    ## Componentes a considerar actualizar
    Si algún componente está desactualizado o es un cuello de botella, menciona
    qué podría actualizarse y por qué, con links de búsqueda en formato markdown.
    
    ## Conclusión
    Resumen final con los pasos más importantes a seguir
    
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
        "max_tokens": 2000
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(GROQ_URL, json=body, headers=headers, timeout=30)
        response.raise_for_status()
        data = response.json()
        result = data["choices"][0]["message"]["content"]
        
        score = 50
        for line in result.split('\n'):
            if 'SCORE:' in line.upper():
                try:
                    score = int(''.join(filter(str.isdigit, line)))
                    score = min(100, max(1, score))
                except:
                    pass

        return {
            "result": result,
            "system_score": score
        }