import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { Task } from '../models/task.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PayloadService {
  private baseUrl: string = 'http://localhost:3000/api';

  constructor(private http: HttpClient ) { }


    /**
     * Retrieves the tasks from the server.
     * @returns An Observable that emits an array of Task objects.
     */
    getTasks(): Observable<Task[]> {
      return this.http.get<{ docs: Task[] }>(`${this.baseUrl}/tasks`).pipe(
        map(response => response.docs)
      );
    }

      
    /**
     * Creates a new task.
     * 
     * @param task - The task object to be created.
     * @returns An observable that emits the created task.
     * @throws An error if the task creation fails.
     */
    createTask(task: Task): Observable<Task> {
        let taskData: any = { //let permite reasignar valores si es necesario, any es un tipo de dato que puede ser cualquier cosa
        title: task.title,
        description: task.description,
        completed: task.completed ?? false //el operador ?? devuelve el operando derecho cuando el operando izquierdo es null o undefined
      };
    
      if (task.image instanceof Blob) {
        const altText = 'Image for task';
        return this.uploadImage(task.image, 'uploaded-image.jpg', altText).pipe(
          switchMap((imageId: string) => {
            console.log('Received image ID:', imageId);
            console.log('Received image id:', imageId.valueOf());
            // Asignamos el ID de la imagen directamente
            taskData.image = imageId.valueOf();
            // Enviamos el objeto JSON directamente
            return this.http.post<Task>(`${this.baseUrl}/tasks`, taskData);
          }),
          catchError(error => {
            console.error('Error in createTask:', error);
            return throwError(() => new Error('Failed to create task: ' + error.message));
          })
        );
      } else {
        // Si no hay imagen, enviamos el objeto JSON directamente
        return this.http.post<Task>(`${this.baseUrl}/tasks`, taskData);
      }
    }

    /**
     * Uploads an image to the server.
     * 
     * @param image - The image to be uploaded.
     * @param filename - The name of the file.
     * @param altText - The alternative text for the image.
     * @returns An Observable that emits the ID of the uploaded image.
     * @throws An error if the response from the server does not contain the expected ID.
     */
    uploadImage(image: Blob, filename: string, altText: string): Observable<string> {
      const imageFormData = new FormData();
      imageFormData.append('file', image, filename);
      imageFormData.append('altText', altText);
      return this.http.post<any>(`${this.baseUrl}/media`, imageFormData).pipe(
        map((response: any) => {
          console.log('Full response from image upload:', response);
          if (response && response.doc && response.doc.id) {
            console.log('image:', response.doc)
            console.log('uploadImage() Image ID:', response.doc.id);
            return response.doc.id;
          } else {
            console.error('Unexpected response structure:', response);
            throw new Error('Image upload response does not contain expected id');
          }
        })
      );
    }

      
    /**
     * Edits a task.
     * 
     * @param task - The task to be edited.
     * @returns An observable that emits the edited task.
     */
    editTask(task: Task): Observable<Task> {
      // Creamos un objeto en lugar de FormData
      let taskData: any = {
        title: task.title,
        description: task.description,
        completed: task.completed
      };
    
      // Si hay una imagen, añadimos su ID al objeto
      if (task.image && task.image.id) {
        taskData.image = task.image.id;
      } else if (task.image === null) {
        // Si la imagen se ha eliminado, enviamos null
        taskData.image = null;
      }
    
      // Utilizamos PATCH en lugar de PUT para actualizar solo los campos proporcionados
      return this.http.patch<Task>(`${this.baseUrl}/tasks/${task.id}`, taskData);
    }

    deleteTask(task: Task): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/tasks/${task.id}`);
    }

}
