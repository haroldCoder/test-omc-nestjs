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

Puedes ejecutar este proyecto de dos formas distintas: **Modo Contenerizado con Docker Compose (Recomendado)** para levantar todo el ecosistema (Base de datos + API + Visualizador) con un solo comando, o **Modo de Desarrollo Local** para trabajar directamente sobre el código.

---

### Opción A: Modo Contenerizado Completo (Docker Compose) - ¡Recomendado! 🚀

Este modo compila la aplicación NestJS en una imagen multi-etapa súper ligera y optimizada, y la orquesta junto con MongoDB y Mongo Express.

1. **Configurar Variables de Entorno:**
   Copia el archivo de ejemplo para crear tu archivo `.env`:
   ```bash
   cp .env.example .env
   ```
   *Abre el archivo `.env` y configura tus claves (como `GEMINI_API_KEY` y `JWT_SECRET`).*

2. **Levantar todo el ecosistema con un solo comando:**
   ```bash
   docker compose up --build -d
   ```

3. **Verificar Servicios en Línea:**
   * **API de NestJS (Backend):** Disponible en [http://localhost:3000](http://localhost:3000)
   * **Swagger UI (Documentación):** Disponible en [http://localhost:3000/api/docs](http://localhost:3000/api/docs)
   * **Mongo Express (Gestor de BD):** Disponible en [http://localhost:8081](http://localhost:8081) *(Credenciales: admin / pass)*

---

### Opción B: Modo de Desarrollo Local (Host) 💻

Utiliza este modo si deseas realizar cambios de código en tiempo real con recarga en caliente (*hot-reload*).

1. **Instalar dependencias de Node.js:**
   ```bash
   npm install
   ```

2. **Configurar Variables de Entorno:**
   ```bash
   cp .env.example .env
   ```
   *(Asegúrate de rellenar los valores correspondientes en el `.env`).*

3. **Levantar base de datos en Docker:**
   Inicia únicamente el servicio de base de datos en segundo plano:
   ```bash
   docker compose up mongodb mongo-express -d
   ```

4. **Iniciar el Servidor en modo Desarrollo:**
   ```bash
   npm run start:dev
   ```
   *El servidor local levantará en [http://localhost:3000](http://localhost:3000)*

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

> [!IMPORTANT]
> **Autenticación en Swagger UI (¡Evita el error 401!)**
> Al hacer clic en el botón **Authorize** en la esquina superior derecha de la interfaz de Swagger UI para inyectar tu token:
> * **Formato Correcto:** Pega **únicamente** la cadena larga del token (ej. `eyJhbGciOi...`). Swagger UI de forma automática añade el prefijo `Bearer ` en la cabecera de la petición.
> * **Formato Incorrecto:** Evita escribir la palabra `Bearer ` manualmente. Si ingresas `Bearer eyJ...`, Swagger transmitirá `Bearer Bearer eyJ...`, lo que provocará que el servidor rechace la petición con un error **`401 Unauthorized`**.

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

---

## ☁️ Despliegue en Vercel (Serverless)

Esta API está completamente preparada para ser desplegada en **Vercel** como una función Serverless de alto rendimiento.

### 1. Requisitos e Integración
Hemos añadido los siguientes archivos de configuración necesarios:
* **`vercel.json`**: Configura la redirección de todo el tráfico HTTP entrante hacia nuestra función de entrada.
* **`api/index.ts`**: Inicializa de forma óptima el servidor de NestJS con soporte para CORS, DTOs y Swagger en el entorno serverless de Vercel, reutilizando la instancia inicializada para acelerar las peticiones posteriores.

### 2. Pasos para el Despliegue con Vercel CLI
Desde la carpeta raíz del proyecto, ejecuta el siguiente comando en tu terminal:
```bash
# Iniciar el proceso de despliegue e interactuar con Vercel CLI
vercel
```

Vercel CLI te hará un par de preguntas básicas. Puedes presionar **Enter** para usar las opciones por defecto:
* `Set up and deploy?` **yes**
* `Which scope?` **[Tu Usuario]**
* `Link to existing project?` **no**
* `What's your project's name?` **test-omc-nestjs**
* `In which directory is your code located?` **./**
* `Want to modify these settings?` **no**

### 3. Configurar Variables de Entorno en Vercel
Una vez que el proyecto esté vinculado, debes configurar tus secretos directamente en el dashboard de tu proyecto en Vercel o usando la terminal:
```bash
vercel env add MONGO_URI
vercel env add GEMINI_API_KEY
```

### 4. Despliegue en Producción
Para desplegar la versión final a producción, ejecuta:
```bash
vercel --prod
```

