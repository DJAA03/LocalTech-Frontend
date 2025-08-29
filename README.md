# 🚀 LocalTech - Frontend

Pasos para levantar el frontend de nuestra tienda de tecnología, LocalTech. Está hecho con React,
TypeScript y Vite.


### ### ✅ Requisitos Previos

Antes de empezar, se debe de revisar tener instalado:

* **Node.js**: Ojalá una versión reciente (v18 o superior).
* **npm** o **yarn**: Para manejar los paquetes.
* Tu editor de código favorito (Visual Studio Code).


### ### ⚙️ Instalación

 Abre la terminal y sigue estos pasos:

1.  **Clona el repositorio** (si no lo has hecho ya).
2.  **Navega a la carpeta del frontend**:
   
    cd localtech-frontend
    
3.  **Instala todas las dependencias**:
 
    npm install
    
    Esto puede tardar un par de minutos.

### ### 🔑 Configuración de Variables de Entorno

Este paso es súper importante.

1.  En la raíz de la carpeta `localtech-frontend`, crea un archivo nuevo llamado `.env`.
2.  Copia y pega esto dentro de ese archivo:

   
    VITE_CLOUDINARY_CLOUD_NAME=dqrhqqpqv
    VITE_CLOUDINARY_UPLOAD_PRESET=localtech_preset
    VITE_API_URL=http://localhost:5000/api
    

    Con esto, el frontend ya sabe cómo subir imágenes y a dónde conectarse con el backend. No se necesita cambiar nada mas.


### ### ▶️ Cómo Ejecutar la Aplicación

1.  En la terminal, dentro de `localtech-frontend`, corre el siguiente comando:
  
    npm run dev
   
2.  Esto levantará el servidor de desarrollo. La terminal te dará una URL local. Generalmente es:
    `http://localhost:5173/`
3.  Abre esa dirección en el navegador y ¡listo! Ya deberías ver la tienda funcionando.

> 💡 **Nota**: Recuerda que el **servidor del backend debe estar corriendo** al mismo tiempo para que todo funcione (cargar productos, iniciar sesión, etc.).
