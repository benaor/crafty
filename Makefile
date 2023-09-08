# Nom du conteneur Docker
CONTAINER_NAME=crafty_postgres

# Image Docker de PostgreSQL
IMAGE=postgres:latest

# Port sur lequel PostgreSQL sera exposé
PORT=5432

# Mot de passe de l'utilisateur 'postgres'
POSTGRES_PASSWORD=admingres

# Créer le conteneur Docker
build:
	docker pull $(IMAGE)

# Exécuter le conteneur Docker
run:
	docker run --name $(CONTAINER_NAME) -e POSTGRES_PASSWORD=$(POSTGRES_PASSWORD) -p $(PORT):5432 -d $(IMAGE)

# Arrêter et supprimer le conteneur Docker
stop:
	docker stop $(CONTAINER_NAME)
	docker rm $(CONTAINER_NAME)

# Afficher les logs du conteneur
logs:
	docker logs $(CONTAINER_NAME)

# Prisma generate
prisma-generate:
	npx prisma generate --schema=./src/infra/prisma/schema.prisma
