<div align="center">
  <table>
    <tr>
      <td style="width: 100px; vertical-align: middle; padding-right: 10px; border: none;">
        <img src="https://github.com/user-attachments/assets/c796d947-572a-42d0-8645-12870bedd03a" alt="BidMon Universe" style="width: 100px; height: auto; border-radius: 5px;">
      </td>
      <td style="border: none;">
        <h1 style="margin: 0;">BidMon Universe</h1>
        <h2 style="margin: 0; color: #555;">Plataforma de Coleccionismo de Cartas Digitales</h2>
      </td>
    </tr>
  </table>
</div>






## Índice

1. [Introducción](#introducción)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Documentación](#documentación)
4. [Manual de Instalación y Ejecución](#manual-de-instalación-y-ejecución)
5. [Contacto](#contacto)

## Introducción

Las plataformas digitales han popularizado un modo de juego basado en la colección de cartas, permitiendo a los usuarios acceder a un mercado de intercambio de estas. Este modelo de juego genera miles de millones de euros al año, convirtiéndose en una de las formas de entretenimiento más destacadas en la actualidad.

Este trabajo presenta el desarrollo de una plataforma online de coleccionismo e intercambio de activos digitales, concretamente de cartas de Pokémon. Esta plataforma permitirá a los usuarios adquirir sobres de cartas con distinta rareza, lo que añade un componente de exclusividad y emoción a la colección. Además, las cartas podrán ser subastadas en tiempo real, permitiendo a los usuarios adquirir las cartas más deseadas mediante pujas, mejorando así la experiencia de coleccionismo digital.

## Tecnologías Utilizadas

- **Frontend (webapp)**: ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
- **Backend (restapi)**: ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
- **Base de Datos**: ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
- **Despliegue**: ![Azure](https://img.shields.io/badge/Azure-0089D6?style=for-the-badge&logo=microsoft-azure&logoColor=white)

## Documentación

Se ha documentado el proyecto mediante una memoria detallada que explica el funcionamiento del sistema, su implementación, así como la planificación realizada para completar el proyecto con éxito dentro del plazo establecido.

La documentación está elaborada en LaTeX y se puede consultar en el repositorio [Documentación](https://github.com/paulasuarezp/TFG-Documentacion) o se puede descargar el documento en formato pdf haciendo clic 
[aquí](https://github.com/user-attachments/files/16589185/MemoriaTFG.pdf).


## Manual de Instalación y Ejecución

El código fuente se adjunta en un archivo comprimido junto con la memoria del proyecto. Para instalar y ejecutar la aplicación, sigue estos pasos:

1. **Clonar el repositorio de GitHub en un entorno local.**
2. **Instalar Node.js y npm en el sistema.**
    - Para instalar Node.js, puedes descargar el instalador desde la página oficial de Node.js [nodejs.org](https://nodejs.org/en/download/prebuilt-installer).
    - npm se instala automáticamente con Node.js.
    - Para comprobar que Node.js y npm se han instalado correctamente, ejecuta los siguientes comandos en una terminal:
        ```bash
        node -v
        npm -v
        ```
3. **Instalar las dependencias de `webapp`.** Ejecuta los siguientes comandos:
    ```bash
    cd webapp
    npm install
    ```
4. **Instalar las dependencias de `restapi`.** Ejecuta los siguientes comandos:
    ```bash
    cd restapi
    npm install
    ```
5. **Configurar las variables de entorno.**
    - Crea un archivo `.env` en la carpeta `restapi` con las siguientes variables de entorno:
        ```bash
        MONGO_URI=URI_de_la_base_de_datos_de_MongoDB
        TOKEN_SECRET=Clave_secreta_para_la_generación_de_tokens_JWT
        TEST_MONGO_URI=URI_de_la_base_de_datos_de_pruebas_de_MongoDB
        PAYPAL_CLIENT_ID=ID_de_cliente_de_PayPal
        PAYPAL_CLIENT_SECRET=Clave_secreta_de_PayPal
        NODE_ENV=development
        ```
6. **Iniciar la aplicación.** Ejecuta los siguientes comandos:
    ```bash
    cd backend
    npm start
    cd ../frontend
    npm start
    ```
7. **Acceder a la aplicación en un navegador web a través de la dirección** [http://localhost:3000](http://localhost:3000).

## Contacto

<div align="center">
  <table>
    <tr>
      <td style="width: 50px; vertical-align: middle; padding-right: 10px; border: none;">
        <img src="https://img.icons8.com/ios-glyphs/30/BDD3E7/email.png" alt="Email Icon" style="width: 24px; height: 24px; color: #BDD3E7;">
      </td>
      <td style="border: none;">
        <a href="mailto:paulasp24@icloud.com" style="text-decoration: none; color: #BDD3E7;">
          <span style="font-size: 1.2em;">paulasp24@icloud.com</span>
        </a>
      </td>
    </tr>
    <tr>
      <td style="width: 50px; vertical-align: middle; padding-right: 10px; border: none;">
        <img src="https://img.icons8.com/ios-glyphs/30/BDD3E7/linkedin.png" alt="LinkedIn Icon" style="width: 24px; height: 24px; color: #BDD3E7;">
      </td>
      <td style="border: none;">
        <a href="https://www.linkedin.com/in/paula-suárez-prieto?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" style="text-decoration: none; color: #BDD3E7;">
          <span style="font-size: 1.2em;">linkedin.com/in/paula-suárez-prieto</span>
        </a>
      </td>
    </tr>
  </table>
</div>



