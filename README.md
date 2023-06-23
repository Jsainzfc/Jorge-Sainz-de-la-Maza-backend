# Desafío entregable clase 4

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

## Estructura
Todo el código está en index.js. Incluye diversas llamadas para testear el funcionamiento.

## Testeo
Ejecutar node index.js. El testeo de este entregable consiste en:
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