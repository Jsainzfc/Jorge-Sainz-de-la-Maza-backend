# Entrega clase 39 - Documentación API

## Alcance clase 2
Se ha creado una clase Product con un constructor que inicializa todas las variables necesarias al valor introducido al crear una instancia.
Se ha creado una clase ProductManager. Su constructor no recibe parámetros e inicializa un array de prodcutos vacío. Tiene varios métodos: 
- addProduct: recibe todas las variables necesarias para la inicialización de un producto excepto el id. El id es una variable privada que crece secuencialmente. Verifica que todos los campos están incluidos y además que el código del producto sea único a través de un método privado.
- getProducts: devuelve un array de productos o un array vacío si el manager no tiene productos aún.
- getProductById: devuelve el producto con un id determinado si lo encuentra o indica un error por consola.

## Alcance clase 4
Se parte del desarrollo realizado para el entregable de la clase número 2 (mirar Alcance clase 2). El objetivo de este entregable es emplear filesystem para agregar persistencia al programa. Adiciones al proyecto:
- Empleo de filesystem para el manejo de archivos.
- El ProductManager va a contar con un path a inicializar en el constructor que indica la ruta en la que manejar los archivos. En esa ruta debe crear el archivo que guarda el array de productos.
- addProduct: actualiza el array de productos en el archivo.
- getProducts y getProductById: ahora leen el array de productos del archivo.
- updateProduct: nuevo método para actualizar un producto sin borrar su ID
- deleteProduct: nuevo método para borrar un producto.

### Testeo clase 4
- Se creará una instancia de la clase “ProductManager”
- Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
- Se llamará al método “addProduct” con los campos:
  - title: “producto prueba”
  - description:”Este es un producto prueba”
  - price:200,
  - thumbnail:”Sin imagen”
  - code:”abc123”,
  - stock:25
- El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
- Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
- Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
- Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
- Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.

## Alcance clase 6
Se ha creado un servidor en express que emplea el ProductManager como se dejó listo en la entrega de la clase 4. Los endpoints son los siguientes:
- / : Genera una explicación sencilla sobre el empleo del servidor.
- /products : retorna todos los productos de la base de datos.
- /products?limit=x : retorna x productos de la base de datos.
- /products/:pid : retorna el productos con id pid de la base de datos.

## Alcance Pre-Entrega 1
Se ha implementado el Router de express para contar con dos grupos de rutas: /api/products y /api/carts. Las rutas se han implementado siguiendo la arquitectura API REST. El proyecto cuenta con persistencia mediante fs de node.

## Alcance clase 10
Se han implementado plantillas mediante handlebars par crear dos nuevos endpoints: / y /realtimeproducts, que se sirven mediante dicho motor de plantillas y proporciona una lista de los productos.
La información proporcionada en / es estática mediante el servidor de express.
La información proporcionada en /realtimeproducts es dinámica gracias a un websocket server que actualiza la lista de productos cada vez que se recibe un nuevo producto o se elimina un producto.

## Alcance clase 15
Se ha implementado un chat en tiempo real mediante el uso de websocket.
Se ha creado una vista en tiempo real del carrito mediante el uso de websocket.
La persistencia de productos, mensajes del chat y carritos se ha integrado con MongoDB + mongoose, conservando el uso de filesystem, pero sin emplearlo.

## Alcance pre Entrega 2
Se han profesionalizado las rutas existentes así como creado nuevas.
Se permite hacer queries a api/products con limit, filter, paginado.
Se han creado nuevas rutas estáticas para ver/comprar productos, ver/comprar producto individual, ver carritos.
Se han implementado funcionalidades a las rutas estáticas para acceder a la api.
Se ha creado un nuevo modelo category que está relacionado con los productos. Se ha creado su manager y su router en /api/categories.
Se ha añadido Sass con la sintaxis SCSS para el estilado.

## Alcance clase 19
Se ha añadido autenticación en la página. La autenticación es necesaria para ver el contenido de la aplicación.
Existe un usuario admin que se registra en .env como ADMINMAIL y ADMINPASSWORD y que se corresponde con lo solicitado.
Se han empleado sessions y cookies para registrar el acceso de los usuarios.
El carrito se ha vinculado con el usuario para agregarle persistencia en db.
Se ha creado una nueva tabla de users en la db para agregarle persistencia.

## Alcance clase 21
Se han añadido estrategias de login mediante passport, incluyendo un login a través de github.

## Alcance clase 24
Se han refactorizado las estrategias de autenticación mediante el uso de Session.

## Alcance clase 34
Añadido un logger y un endpoint para el testeo de los logs: /loggerTest

## Alcance clase 37
Añadidos nuevos endpoints para gestionar products: /manage, /addProduct, /editProduct/:pid.
Añadido owner al modelo de producto.
Añadido rol 'premium' a los users. Un usuario premium puede modificar sus propios productos. Un usuario admin puede modificar todos los productos.
Un usuario premium no puede añadir al carrito sus propios productos.
Se puede cambiar el rol de un user a premium con la ruta /api/users/premium/:uid

## Alcance clase 39
Se ha documentado el módulo de productos y de carrito de la API mediante swagger. Se puede ver en el endpoint /apidocs.

## Alcance clase 44
Se ha añadido un endpoint para subir archivos /uploadDocuments. Este llama con POST al endpoint /api/users/premium/:uid/documents que sube los archivos al user (modelo actualizado).
Si los archivos son imágenes, deja subir los que se quiera. Si son documentación, solo deja subir uno y reemplaza si ya existe.
Subida de archivos implementada con multer.

## Estructura
El código está dentro de la carpeta src.
La carpeta database recoge unas bases de datos, ahora en desuso, para el uso de filesystem en carritos y productos.
La carpeta dao recoge los managers para el carrito, los productos y las categorías. Se divide en dos subcarpetas: fs y mongoose. En cada una están los managers. En este momento solo se emplea la subcarpeta mongoose.
La carpeta errors recoge una serie de errores declarados para mejorar el manejo de errores en el proyecto.
La carpeta models recoge todos los modelos (Schemas y colecciones) que se recogen en la base de datos de MongoDB.
La carpeta routes incluye, en la subcarpeta api los enrutados de los endpoints de carritos, productos y categorías para su uso modo api, un router de las rutas estáticas de home:
- / : Todos los productos de la base de datos en ese momento sin actualización en tiempo real.
- /realtimeproducts : Todos los productos de la base de datos en ese momento con actualización en tiempo real.
- /buyproducts : Vista de todos los productos que además permite añadir al carrito
- /product/:pid : Vista detalle del producto con id pid. Se ha añadido un efecto lightbox a la galería de imágenes.
- /buyproduct/:pid : Igual que la anterior. Permite comprar.
- /chat : Chat en tiempo real.
- /cart/:cid : Visión del carrito con id=cid a tiempo real.
- /login : Acceso cuando ya tienes usuario.
- /logout : Desconexión.
- /signup : Registro de usuario.
y un index.js que distribuye las rutas.
La carpeta scss recoge los estilados.
La carpeta testing recoge todos los archivos necesarios para testear los managers y los endpoints en express.
La carpeta websocket recoge la gestión en servidor del socket para el uso del chat.
El servidor de express y el socket están en el archivo app.js, pero el socket solo se inicializa en las rutas que lo usan.
Las vistas de handlebars están enla carpeta views.
El archivo utils.js está en desuso en este momento. Proporciona la ruta para la conexión del filesystem.
La carpeta public proporciona el lado cliente de los websockets así como estilados para las diferentes vistas de handlebars. También incluye lógica para la gestión de compra de productos y de carrito.

## Endpoints de la api de categories:

### POST /api/categories
Crea una categoría con el contenido del cuerpo de la petición.

### GET /api/categories
Devuelve todas las categorías.

### DELETE /api/categories/:id
Elimina la categoría con id = id

## Estilado
Para mejorar un poco más el estilo de la aplicación, se está usando sass. Es por ello que he añadido un script al package.json "watch-sass" para que compile el estilo.

## Testeo

### Testing de clases managers
Para testear los managers de carrito y producto, se puede ejecutar el comando npm run test, que incluye una serie de test cases ya recogidos en las actividades de clase anteriores, así como algún test más que he considerado óptimo.

### Testing del servidor
Para arrancar se ha creado un comando "dev" en el package.json con lo cual es suficiente con ejecutar npm run dev. 
La base de datos de testeo de productos ya está generada. Si hiciera falta volver a generarla basta con ejecutar el archivo testing/createDatabaseFiles.js 
La base de datos de carrito se inicializa con un único carrito, ya que al generar los id de forma aleatoria, se emplea uno ya creado para poder tener unas peticiones de testing.
El testeo del servidor se puede hacer mediante los archivos products_endpoints_testing.rest y carts_endpoints_testing.rest en la carpeta testing que recoge todas las request al servidor para probar su funcionamiento.

### Testing clase 10
- Se instalará y correrá el servidor en el puerto indicado.
  - El servidor debe levantarse sin problema.
- Se abrirá la ruta raíz
  - Debe visualizarse el contenido de la vista index.handlebars
  - No se debe activar el websocket aún.
- Se buscará en la url del navegador la ruta “/realtimeproducts”.
  - Se corroborará que el servidor haya conectado con el cliente, en la consola del servidor deberá mostrarse un mensaje de “cliente conectado”.
  - Se debe mostrar la lista de productos y se corroborará que se esté enviando desde websocket.

### Accesos a la base de datos y puerto del servidor
Tanto el puerto de la app de express como el usuario y contraseña de la base de datos están en un archivo .env que no está en github. Las variables de entorno son:
PORT
MONGOUSER
MONGOPASSWORD
El usuario y contraseña se proporcionan en la entrega.

### Testing pre Entrega 2
La ruta / permite hacer el testeo del endpoint GET /api/products. Una vez cargado, clicar en cualquier producto permite probar el endpoint GET /api/products/:pid.

La ruta /buyproducts y /buyproducts/:pid permiten probar el endpoint POST /api/carts/ (se hace automáticamente y se guarda con persistencia en system storage). Además añadir productos permite probar el endpoint POST /api/carts/:cid/product/:pid. Si clicas en See Cart en la alerta de Sweet alert tras añadir un producto puedes ir a la página de carrito (/cart/:id) y probar el endpoint GET /api/carts/:cid. Empleando los botones con icono de cubo de basura se puede probar el endpoint DELETE /api/carts/:cid/product/:pid, y empleando el botón empty Cart se puede probar el endpoint ### DELETE /api/carts/:cid.

El resto de endpoints de la api se pueden testear mediante cualquier herramienta de envío de queries.

### Testing clase 19
Al cargar el proyecto, éste deberá comenzar en la pantalla de login
Al no tener un usuario, primero se creará un usuario, para esto, la pantalla de login deberá tener un link de redirección “Regístrate” 
El proceso de registro deberá guardar en la base de datos al usuario
Se regresará al proceso de login y se colocarán las credenciales de manera incorrecta, esto para probar que no se pueda avanzar a la siguiente pantalla.
Posteriormente, se colocarán las credenciales de manera correcta, esto para corroborar que se cree una sesión correctamente y que se haga una redirección a la vista de productos.
La vista de productos tendrá en una parte de arriba de la página el mensaje “Bienvenido” seguido de los datos del usuario que se haya logueado (NO mostrar password). Es importante que se visualice el “rol” para ver que aparezca “usuario” o “user”
Se presionará el botón de logout y se destruirá la sesión, notando cómo nos redirige a login.
Se ingresarán las credenciales específicas de admin indicadas en las diapositivas, el login debe redirigir correctamente y mostrar en los datos del rol: “admin” haciendo referencia a la correcta gestión de roles. 
Se revisará que el admin NO viva en base de datos, sino que sea una validación que se haga de manera interna en el código.

## Ejecución
El programa se podrá ejecutar en los siguientes entornos:
npm run dev -> Entorno de desarollo
npm run production -> Entorno de producción

## Manejo de errores
El manejo de errores se ha realizado mediante la instanciación de diferentes clases de errores que se transforman en diferentes respuestas por parte del servidor