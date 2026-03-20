FROM postgres:16-alpine

# Las credenciales se inyectan en docker-compose.yml con las variables de entorno
COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
