import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PayloadService {
  private baseUrl: string = 'http://localhost:3000/api';

  constructor(private http: HttpClient ) { }


      getTasks(): Observable<Task[]> {
        return this.http.get<{ docs: Task[] }>(`${this.baseUrl}/tasks`).pipe(
          map(response => response.docs)
        );
      }
    /*
    createTask(task: Task): Observable<Task> {
        const formData = new FormData();
        formData.append('title', task.title);
        formData.append('description', task.description);
        formData.append('completed', task.completed.toString());
        if (task.image) {
          formData.append('image', task.image.id);
        }
    
        return this.http.post<Task>(`${this.baseUrl}/tasks`, formData);
      }*/

        createTask(task: Task): Observable<Task> {
          const formData = new FormData();
          formData.append('title', task.title);
          formData.append('description', task.description);
          formData.append('completed', task.completed.toString());
          if (task.image instanceof Blob) {  // Asegúrate de que task.image es un Blob
            formData.append('image', task.image, task.image.filename);
          }
        
          return this.http.post<Task>(`${this.baseUrl}/tasks`, formData);
        }
        

          editTask(task: Task): Observable<Task> {
            const formData = new FormData();
            formData.append('title', task.title);
            formData.append('description', task.description);
            formData.append('completed', task.completed.toString());
        
            if (task.image && (task.image instanceof Blob)) {
              formData.append('image', task.image);  // Asume que task.image es un Blob
            } else if (task.image && task.image.filename) {
              // Si la imagen ya existe y solo estamos enviando el identificador
              formData.append('imageID', task.image.id); 
            }
        
            return this.http.put<Task>(`${this.baseUrl}/tasks/${task.id}`, formData);
          }
  
}
