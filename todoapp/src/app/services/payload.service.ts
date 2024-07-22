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

      createTask(task: Task): Observable<Task> {
        const formData = new FormData();
        formData.append('title', task.title);
        formData.append('description', task.description);
        formData.append('completed', (task.completed ?? false).toString());
        if (task.image instanceof Blob) {  
          formData.append('image', task.image, task.image.filename);
        }
      
        return this.http.post<Task>(`${this.baseUrl}/tasks`, formData);
      }
      

      editTask(task: Task): Observable<Task> {
        const formData = new FormData();
        formData.append('title', task.title);
        formData.append('description', task.description);
        formData.append('completed', task.completed.toString());
        if (task.image) {
          formData.append('image', task.image.id);
        }
    
        return this.http.put<Task>(`${this.baseUrl}/tasks/${task.id}`, formData);
      }

      deleteTask(task: Task): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/tasks/${task.id}`);
      }

}
