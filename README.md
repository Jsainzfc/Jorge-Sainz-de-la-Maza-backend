# Pre-Entrega 1

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

## Estructura
El código está dentro de la carpeta src. 
La carpeta database recoge products.json y carts.json, base de datos de productos y de carritos.
La carpeta managers recoge el CartManager y el ProductManager, clases para manejar los productos y los carritos.
La carpeta testing recoge todos los archivos necesarios para testear los managers.
La carpeta routes incluye los enrutados de los endpoints de la aplicación.
El servidor de express está en el archivo app.js.

## Endpoints de products:

### GET /api/products/?limit=x
Retorna todos los productos de la base de datos hasta un límite = x. 
Limit ha de ser un número entero, si no retorna un status 400.
Si limite es superior al máximo de productos disponibles en la base de datos o no se ha fijado un límite, devuelve todos los productos disponibles.
Si no hay productos en la base de datos se retorna un status 204.

### GET /api/products/:pid
Retorna el producto con id pid.
Si el producto no se encuentra, retorna un status 404.

### POST /api/products/
Añade el producto del cuerpo de la petición a la base de datos.
Si la petición es correcta, retorna un status 201.
Si la petición tiene algún error, retorna un status 400.

### PUT /api/products/:pid
Actualiza el product con el id pid de la base de datos con la información del cuerpo de la petición.
Si el producto no se encuentra, retorna un status 404.

### DELETE /api/products/:pid
Elimina el producto con id pid de la base de datos.
Si el producto no se encuentra, retorna un status 404.
Si el producto se elimina correctamente, retorna un status 204.

## Endpoints de carts:

### POST /api/carts/
Crea un carrito con un id aleatorio y único y sin productos. 

### GET /api/carts/:cid
Retorna los productos del carrito con id cid.
Si el carrito no se encuentra, retorna un status 404.

### POST /api/carts/:cid/product/:pid
Añade un item del producto con id pid al carrito con id cid.
Si el carrito no se encuentra, retorna un status 404.
Si el carrito no contiene aún el id de product pid, se añade con una cantidad de 1.
Si el carrito ya contiene el producto con id pid, se suma 1 a la cantidad presente.


## Testeo

### Testing de clases managers
Para testear los managers de carrito y producto, se puede ejecutar el comando npm run test, que incluye una serie de test cases ya recogidos en las actividades de clase anteriores, así como algún test más que he considerado óptimo.

### Testing del servidor
Para arrancar se ha creado un comando "dev" en el package.json con lo cual es suficiente con ejecutar npm run dev. 
La base de datos de testeo de productos ya está generada. Si hiciera falta volver a generarla basta con ejecutar el archivo testing/createDatabaseFiles.js 
La base de datos de carrito se inicializa vacía. Una vez lanzado el servidor todo el testeo puede hacerse en el navegador.
El testeo del servidor se puede hacer mediante el archivo testing.REST en la carpeta testing que recoge todas las request al servidor para probar su funcionamiento.
