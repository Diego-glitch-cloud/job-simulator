# 🎸 Bands REST API

Bienvenido a la documentación oficial del proyecto **Bands REST API**, un gestor de bandas musicales construido bajo estrictos estándares técnicos para calificar al **Nivel 3 (Senior)** del laboratorio.

Este proyecto demuestra un dominio arquitectónico profundo utilizando **Node.js puro**, **PostgreSQL**, y orquestación integral con **Docker**, cumpliendo a rajatabla la regla de "Cero Frameworks".

---

## 🏗️ Arquitectura y Tecnologías Principales

El proyecto se divide físicamente en 3 servicios automatizados por `docker-compose.yml`:

- **Base de Datos (`db`)**: Recreada sobre `PostgreSQL 16 Alpine`. Maneja la persistencia de los datos mediante volúmenes virtuales y se inicializa autónomamente a través de un script que inserta una semilla primaria de 25 bandas musicales famosas.
- **Backend API (`api`)**: Escrita en `Node.js 20 Alpine`. Se construyó **sin** utilizar Express.js ni dependencias ajenas. Implementa un servidor web HTTP nativo con ruteo casero inteligente, extrayendo los cuerpos JSON y administrando firmemente el CORS.
- **Frontend (`frontend`)**: Interfaz modular entregada mediante `Nginx Alpine`. Reescrita completamente descartando clases de Tailwind en línea en favor de semántica Vainilla CSS y JavaScript moderno ES6, capaz de consumir la API en estado puro.

---

## 🚀 Cómo Inicializar el Proyecto

Todo el engranaje depende de Docker. Para gozar de las instalaciones en tu computadora te recomendamos:

1. Renombra (o copia) el archivo `.env.example` dejándolo únicamente como `.env`.
2. Para levantar la infraestructura, ejecuta en tu terminal:

```bash
# Limpiar dependencias antiguas colgadas (opcional pero muy recomendado)
docker system prune -f && docker compose down -v

# Construir e iniciar todos los servicios
docker compose up -d --build
```

Una vez que los contenedores reporten estar _"Healthy"_, podrás verificar todo mediante:

- **Interfaz Gráfica (Frontend UI)**: [http://localhost:8088](http://localhost:8088)
- **API REST Directa**: [http://localhost:8080/bands](http://localhost:8080/bands)

---

## 🗃️ Diccionario de Datos del Contrato

La API tiene una capa de validación ultra dura antes de tocar la base de datos. El envío de tipos de datos incorrectos es castigado con un Status HTTP `400 Bad Request`.

| Campo en DB | Significado en UI   | Tipo de Dato | Ejemplo de Entrada |
| ----------- | ------------------- | ------------ | ------------------ |
| `name`    | **Banda / Artista** | `String`     | "The Beatles"      |
| `genre`    | **Género**          | `String`     | "Rock Clásico"     |
| `country`    | **País**            | `String`     | "UK"               |
| `year_formed`    | **Año Inicio**      | `Integer`    | 1960               |
| `rating`    | **Rating (1-5)**    | `Float`      | 5.0                |
| `is_active`    | **Activa**          | `Boolean`    | true               |

---

## 🛠️ Casos de Uso Demostrativos

Con un nivel de exactitud Senior, los 5 métodos canónicos RESTful se encuentran completamente operativos.

### 1. Listar el Catálogo (GET)

- **Ruta:** `GET http://localhost:8080/bands`
- **Descripción:** Lee la base de datos y despliega el arreglo total de bandas registradas y en orden incremental.
- **Respuesta Esperada:** Código `200 OK`

### 2. Recuperar Identidad Única (GET simple)

- **Ruta:** `GET http://localhost:8080/bands/2`
- **Descripción:** Acciona un mapeo por ID y recupera los datos puros.
- **Reglas:** Si el ID provisto no existe arrojará `404 Not Found`.
- **Respuesta Esperada:** Código `200 OK`

### 3. Crear una Identidad (POST)

- **Ruta:** `POST http://localhost:8080/bands`
- **Descripción:** Inyecta en el sistema una nueva agrupación. Su validador vigila rigurosamente que integres los 6 campos del contrato en simultáneo.
- **Body Inicial (JSON):**

```json
{
  "name": "Pink Floyd",
  "genre": "Progressive Rock",
  "country": "UK",
  "year_formed": 1965,
  "rating": 4.9,
  "is_active": false
}
```

- **Respuesta Esperada:** Código `201 Created`

### 4. Sobreescritura Total (PUT)

- **Ruta:** `PUT http://localhost:8080/bands/2`
- **Descripción:** Obliga al usuario a insertar los 6 campos intactos al igual que el Post y reemplaza de lleno tu información.
- **Respuesta Esperada:** Código `200 OK`

### 5. Mutación Específica (PATCH) - _Sello Senior_

- **Ruta:** `PATCH http://localhost:8080/bands/2`
- **Descripción:** Funcionalidad sofisticada donde puedes elegir modificar únicamente uno o los renglones que prefieras ignorando los demás. Por ejemplo, si en 2030 esa banda se retira, únicamente empujas `is_active` y un false hacia su base sin ensuciar la red enviando el nombre completo, el país y el género innecesariamente.
- **Body Único:**

```json
{
  "is_active": false
}
```

- **Respuesta Esperada:** Código `200 OK`

### 6. Desintegración de Datos (DELETE)

- **Ruta:** `DELETE http://localhost:8080/bands/2`
- **Descripción:** Borra de forma contundente la memoria de esta banda musical.
- **Respuesta Esperada:** Código obligatorio `204 No Content`
