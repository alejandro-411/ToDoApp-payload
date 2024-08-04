# To-Do List Application

## Descripción

Esta es una aplicación sencilla de lista de tareas (To-Do List) creada con Angular en el frontend y Payload CMS en el backend. Los usuarios pueden crear, editar y eliminar tareas, así como asociar imágenes a las tareas.

## Características

- Crear, editar y eliminar tareas.
- Asociar imágenes a las tareas.
- Interfaz de usuario construida con Angular.
- Backend gestionado con Payload CMS.
- Base de datos PostgreSQL.

## Tecnologías Utilizadas

- Angular
- Payload CMS
- Express
- PostgreSQL

## Configuración del Proyecto

1. Clona el repositorio:


    git clone https://github.com/alejandro-411/ToDoApp-payload.git
    cd ToDoApp-payload

2. Instala las dependencias:

    npm install

3. Configura las variables de entorno

    Crea un archivo .env y agrega las siguientes variables:

        PAYLOAD_SECRET=tu_secreto
        DATABASE_URI=postgres://usuario:contraseña@localhost:5432/tu_base_de_datos

4. Inicia el backend

    En la raíz del proyecto:

        npm run dev

5. Inicia el frontend

    cd todoapp
    ng serve

    Esto iniciará la aplicación Angular en http://localhost:4200.

## Uso de la aplicación

1. Abre tu navegaodr y ve a http://localhost:4200

2. Utiliza la interfaz para crear, editar y eliminar tareas.
