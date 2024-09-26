Contexto

Imagine que está construyendo una aplicación de gestión de tareas. 
Necesita crear una API REST para gestionar las tareas de los usuarios. 
Cada tarea tiene un título, una descripción y un estado (pendiente, en progreso, completada, eliminada).

Requisitos

    -Crea una API RESTful utilizando Node.js y Express.js (o el framework que prefieras) 
     que permita realizar operaciones CRUD (Crear, Leer, Actualizar y Borrar) en el recurso “Tareas”.

    -Debe ser posible realizar las siguientes operaciones:
        -Crear una nueva tarea.
        -Leer una lista de todas las tareas.
        -Leer una tarea específica por su ID.
        -Actualizar una tarea existente (título y descripción).
        -Borrar de manera lógica una tarea por su ID.
    
    -Implementa una ruta adicional para filtrar tareas por estado. Por ejemplo, /tareas/pendientes debería devolver todas las tareas pendientes.
    
    -Implementa servicios que permitan cambiar de estado una tarea en particular.
    
    -Implementa una lógica de negocio adicional que calcule el tiempo transcurrido desde la creación de una tarea en días. Puedes agregar una nueva ruta, por ejemplo, /tareas/:id/dias-transcurridos, que devuelva el número de días transcurridos desde la creación de la tarea con el ID proporcionado.
    
    -Utiliza una base de datos de tu elección (por ejemplo, MongoDB, MYSQL, etc.) para almacenar las tareas.
    
    -Desarrolle los tests unitarios sobre cada caso de uso.