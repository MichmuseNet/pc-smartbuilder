import os
import httpx
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

async def get_pc_recommendation(data: dict) -> str:
    prompt = f"""
    Eres un experto en hardware de computadoras. Un usuario necesita ayuda para armar su PC.
    
    Datos del usuario:
    - Uso principal: {data.get('use_case')}
    - Presupuesto: ${data.get('budget')} USD
    - Marca preferida: {data.get('preferred_brand') or 'Sin preferencia'}
    - Resolución objetivo: {data.get('resolution') or 'No especificada'}
    - FPS objetivo: {data.get('target_fps') or 'No especificado'}
    - RAM requerida: {data.get('ram') or 'No especificada'}
    - GPU requerida: {data.get('gpu') or 'No especificada'}
    - CPU requerida: {data.get('cpu') or 'No especificada'}
    - Almacenamiento: {data.get('storage') or 'No especificado'}
    
    Por favor recomienda una configuración completa de PC con los siguientes componentes:
    CPU, GPU, RAM, Motherboard, Storage, PSU, Case.
    
    Para cada componente incluye:
    - Nombre del modelo
    - Precio aproximado en USD
    - Por qué lo recomiendas
    - Links de búsqueda escritos en formato markdown [Nombre](url), reemplazando los espacios del nombre del producto con + en la URL:
      - [Amazon](https://www.amazon.com/s?k=NOMBRE+DEL+PRODUCTO)
      - [Newegg](https://www.newegg.com/p/pl?d=NOMBRE+DEL+PRODUCTO)
      - [BestBuy](https://www.bestbuy.com/site/searchpage.jsp?st=NOMBRE+DEL+PRODUCTO)
      - [MercadoLibre](https://listado.mercadolibre.com.mx/NOMBRE+DEL+PRODUCTO)
      - [Google Shopping](https://www.google.com/search?tbm=shop&q=NOMBRE+DEL+PRODUCTO)
    
    Al final incluye:
    - Precio total estimado
    - Resumen de por qué esta configuración es ideal
    - Una nota indicando que los precios pueden variar según la tienda y región
    
    Responde en español, usa formato markdown con encabezados, negritas y listas.
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
        return data["choices"][0]["message"]["content"]