# PWA Vitrix App

## Acerca

- Proyecto de desarrollo de front para Vitrix - TAC
  Vitrix permite a los encargados de tienda o DT realizar evaluaciones a las tiendas con locaciones a nivel regional en los paises de Colombia, Panamá, Perú, Ecuador y Paraguay.
- Estado: En proceso de construcción :nerd_face:

Dirección Web sitio productivo:

- <https://texmoda.com.co:8406/>

## Tecnologías

[![Azure DevOps](https://img.shields.io/badge/Azure_DevOps-0078D7?style=for-the-badge&logo=azure-devops&logoColor=white)](https://azure.microsoft.com/es-es/)
[![Visual Studio Code](https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)](https://code.visualstudio.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://es.reactjs.org/)
[![Nodejs](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/es/)
[![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Javascript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)](https://www.ecma-international.org/publications-and-standards/standards/ecma-262/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://dev.w3.org/html5/spec-LC/)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/standards/webdesign/htmlcss)

## Tabla de contenido

> - [PWA Vitrix App](#pwa-vitrix-app)
>   - [Acerca](#acerca)
>   - [Tecnologías](#tecnologías)
>   - [Tabla de contenido](#tabla-de-contenido)
>   - [Instalación](#instalación)
>     - [Dependencias](#dependencias)
>     - [Construir el compilado (Build)](#construir-el-compilado-build)
>     - [Desplegar (Cómo instalar el producto)](#desplegar-cómo-instalar-el-producto)
>   - [Uso](#uso)
>     - [Capturas](#capturas)
>     - [Características](#características)
>   - [Code](#code)
>     - [Contenido de la aplicación](#contenido-de-la-aplicación)
>     - [Requerimientos](#requerimientos)
>     - [Limitaciones](#limitaciones)
>   - [Licencia](#licencia)
>   - [Acerca Tradealliance Corp](#acerca-tradealliance-corp)

## Instalación

### Dependencias

Al interior de la carpeta del proyecto ejecutar:

    npm install

Para ejecutar y comprobar funcionamiento después de instalar las dependencias:

    npm start

Para hacer el despliegue en el archivo `package.json`, en el key 'homepage' se debe colocar el URL donde se desplegara el proyecto.

```json
{
  "name": "vitrix",
  "version": "0.1.0",
  "homepage": "https://texmoda.com.co:8406/", // <= ejemplo Url
  "description": "Vitrix",
  "main": "index.js",
  "private": false
}
```

En el archivo `service-worker.js`, en la constante `cacheName` se debe actualizar el numero de la version, para refrescar el cache en el dispositivo del usuario.

```javascript
// Cambiar el numero de la versión con la implementada
const cacheName = "vitrix_v1.01"; // <= versión
```

### Construir el compilado (Build)

Para generar el compilado para desplegar a servidor

    npm run build

Resultado después de ejecutar el comando anterior:

```
The build folder is ready to be deployed.
You may serve it with a static server:

  npm install -g serve
  serve -s build

Find out more about deployment here:

  https://cra.link/deployment


Para la documentación:

En la carpeta `/styleguide` se puede acceder a un empaquetado con la documentación referente a los componentes del proyecto.
Se debe abrir el archivo `index.html` en el navegador.

Para actualizar el empaquetado se debe correr `npx styleguidist build`.
```

### Desplegar (Cómo instalar el producto)

Después de tener el compilado, se toman todos los archivos que se generaron dentro de la carpeta `Build`

> Copie el artefacto compilado dentro de `C:\inetpub\wwwroot\VitrixReact_QA` y refresque el sitio en el IIS.

## Uso

### Capturas

por definir...

### Características

por definir...

## Code

### Contenido de la aplicación

Description, sub-modules organization...

### Requerimientos

Por definir...

### Limitaciones

Por definir...

## Licencia

[Software propietario](http://www.apache.org/licenses/LICENSE-2.0.html)

## Acerca Tradealliance Corp

¡Hola, somos Trade Alliance Corporation!
Una compañía conformada por jóvenes de diferentes nacionalidades, con más de 15 años de experiencia en Fashion Retail.

Nuestra cultura está basada en lograr lo que nos proponemos trabajando con pasión y apoyándonos en nuestro talento interno.

> Más información disponible en [tradealliancecorporation.com](https://tradealliancecorporation.com/).
