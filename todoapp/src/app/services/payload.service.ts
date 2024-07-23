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
         // map(response => response.docs)
         map(response =>{
          console.log('tasks received from api', response.docs);
          return response.docs;
         })
        );
      }

      createTask(formData: FormData): Observable<Task> {
        return this.http.post<Task>(`${this.baseUrl}/tasks`, formData);
      }
      
      editTask(formData: FormData): Observable<Task> {
        const taskId = formData.get('id');
        return this.http.put<Task>(`${this.baseUrl}/tasks/${taskId}`, formData);
      }

    deleteTask(task: Task): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/tasks/${task.id}`);
    }

}
