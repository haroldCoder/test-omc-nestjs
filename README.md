# 📊 OMC Leads Management API

Una API REST premium de alto rendimiento diseñada con una arquitectura limpia, estructurada en capas y modular, construida para registrar, buscar, filtrar y analizar "leads" (contactos de clientes potenciales) en tiempo real, integrando análisis avanzados y generación de resúmenes ejecutivos impulsados por Inteligencia Artificial (**Google Gemini**).

---

## 🛠️ Tecnologías Usadas y Justificación

Para este proyecto se seleccionaron herramientas modernas e industriales de la más alta calidad:

* **NestJS (V11):** Elegido como el framework de backend principal porque **es la tecnología de desarrollo del lado del servidor que mejor conozco, domino y con la que me siento más cómodo y eficiente**. Su arquitectura estructurada basada en inyección de dependencias me permite crear un sistema mantenible, desacoplado y de nivel empresarial altamente escalable.
* **MongoDB & Mongoose (V9):** Base de datos NoSQL robusta y flexible elegida por su capacidad para manejar esquemas dinámicos e irregulares (típico de leads de marketing) sin penalizar el rendimiento. Permite búsquedas agregadas de alto rendimiento.
* **Google Gemini API (`gemini-2.5-flash`):** Integrado como el proveedor de LLM premium. Su velocidad, rentabilidad e inteligencia superior lo convierten en la opción perfecta para procesar el JSON de leads y generar reportes analíticos y recomendaciones ejecutivas. Ademas de que es gratuita.
* **Jest:** Framework de testing unitario y de integración para garantizar estabilidad absoluta en cada release.
* **Swagger (OpenAPI):** Para auto-documentar de forma interactiva y detallada cada endpoint de la API con tipado y descripciones enriquecidas.
* **Docker & Docker Compose:** Para simplificar al 100% el despliegue local de la base de datos y la inicialización limpia de colecciones y seeds.

---

## 🚀 Requisitos Previos

Asegúrate de tener instalados en tu sistema local:
* **Node.js** (versión 18 o superior)
* **npm** (versión 9 o superior)
* **Docker** y **Docker Compose**

---

## 📦 Instalación e Inicio de la Aplicación

1. **Clonar e ingresar al repositorio:**
   ```bash
   cd /home/koder/Documentos/test-omc-nestjs
   ```

2. **Instalar dependencias de Node.js:**
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno:**
   Copia el archivo de ejemplo para crear tu archivo `.env`:
   ```bash
   cp .env.example .env
   ```
   *Nota: Abre el archivo `.env` resultante y configura tu `GEMINI_API_KEY` (clave de Google AI Studio) para habilitar el resumen real de IA.*

4. **Levantar base de datos en Docker:**
   Inicia el contenedor de MongoDB en segundo plano:
   ```bash
   docker-compose up -d
   ```

5. **Iniciar el Servidor en modo Desarrollo:**
   ```bash
   npm run start:dev
   ```
   *El servidor levantará en [http://localhost:3000](http://localhost:3000)*

---

## 🌱 Sembrado de Datos (Seed)

La base de datos cuenta con una inicialización automatizada. Al levantar el entorno con `docker-compose up -d`, Docker ejecuta automáticamente el script de inicialización ubicado en `scripts/init-mongo.js`. 

Este script realiza:
1. La creación limpia de la base de datos `omc_leads_db` y la colección `leads`.
2. Define restricciones estrictas de tipo **JSON Schema Validator** a nivel físico de base de datos.
3. Configura un **índice único** para el campo `email`.
4. Siembra **10 leads reales altamente detallados** con presupuestos y orígenes variados.

### ¿Cómo re-sembrar la base de datos manualmente?
Si por algún motivo deseas limpiar y re-sembrar la base de datos de manera manual, puedes ejecutar en tu terminal:
```bash
docker-compose exec -T mongodb mongosh mongodb://localhost:27017/omc_leads_db /scripts/init-mongo.js
```

---

## 🗺️ Ejemplos de Cómo Probar los Endpoints (cURL)

La API cuenta con soporte completo interactivo en Swagger. Puedes ingresar a la interfaz visual desde tu navegador en:  
👉 **[http://localhost:3000/api/docs](http://localhost:3000/api/docs)**

También puedes probar los endpoints principales utilizando `curl` en tu terminal:

### 1. Registrar un Lead (Creación)
```bash
curl -X POST http://localhost:3000/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Clara Dominguez",
    "email": "clara.dominguez@example.com",
    "phone": "+573123456789",
    "fountain": "facebook",
    "interest_product": "Curso Avanzado de NestJS",
    "budget": 250
  }'
```

### 2. Listar Leads (Con paginación, filtros y ordenación determinista)
Obtiene los leads registrados. Soporta filtros dinámicos estables para evitar solapamiento entre páginas:
```bash
curl -s "http://localhost:3000/api/v1/leads?page=1&limit=5&fountain=facebook&range_date=2026-05-01,2026-05-31"
```

### 3. Obtener Estadísticas Avanzadas de Leads (`/stats`)
Obtiene agrupaciones reales en MongoDB con el total de leads por fuente, el presupuesto promedio exacto y los leads creados en los últimos 7 días:
```bash
curl -s http://localhost:3000/api/v1/leads/stats
```

### 4. Generar Resumen Ejecutivo Inteligente por IA (`/ai/summary`)
Genera un análisis en formato markdown utilizando la API de Google Gemini. Soporta filtrado previo por fechas y fuente. Si no hay `GEMINI_API_KEY` en el `.env`, el servidor utiliza su **Fallback Analítico Inteligente** basado en cálculos matemáticos exactos en tiempo real:
```bash
curl -s "http://localhost:3000/api/v1/leads/ai/summary?fountain=facebook&range_date=2026-04-01,2026-05-31"
```

---

## 🛡️ Manejo de Errores Consistente

Toda la API sigue una estructura de gestión de errores centralizada y predecible. El sistema maneja dos tipos de errores principales:

1. **Excepciones de Dominio (Capa de Negocio):**  
   Implementamos excepciones específicas para encapsular reglas de negocio, tales como `LeadNotFoundException` o fallos en formatos. Estas son capturadas de forma consistente por NestJS y transformadas en respuestas HTTP enriquecidas:
   ```json
   {
     "statusCode": 404,
     "message": "El lead solicitado no existe.",
     "error": "Not Found"
   }
   ```
2. **Validación Automática de DTOs (`ValidationPipe`):**  
   Gracias a `class-validator` y `class-transformer`, cada endpoint que recibe datos (como `POST /leads` o queries en `GET /leads`) valida de manera estricta los datos de entrada antes de tocar el controlador. Si hay campos inválidos, retorna un JSON estructurado con todos los detalles en español:
   ```json
   {
     "statusCode": 400,
     "message": [
       "email debe ser un correo electrónico válido",
       "budget debe ser un número entero"
     ],
     "error": "Bad Request"
   }
   ```
   
Toda respuesta de error en la API garantiza ser **consistente en formato, código HTTP e idioma de cara al cliente**, previniendo fugas de información interna de base de datos.

---

## 🧪 Ejecutar la Suite de Pruebas Unitarias

Para asegurar que ningún cambio rompa la lógica del negocio o de la IA, ejecuta Jest:
```bash
npm run test
```
