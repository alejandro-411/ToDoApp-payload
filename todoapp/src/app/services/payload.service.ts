// src/app/payload.service.ts
import { Injectable } from '@angular/core';
//import axios from 'axios';
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

  /**
   * Retrieves tasks from the Payload CMS.
   * @returns {Promise<any>} A promise that resolves to the tasks data.
   * @throws {Error} If there is an error fetching tasks from the Payload CMS.
   */
  /*async getTasks() {
    try {
      const response = await axios.get(`${this.baseUrl}/tasks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks from Payload CMS:', error);
      throw error;
    }
  }*/

    
    /*getTasks(): Observable<Task[]> {
      return this.http.get<Task[]>(`${this.baseUrl}/tasks`);
    }*/

      getTasks(): Observable<Task[]> {
        return this.http.get<{ docs: Task[] }>(`${this.baseUrl}/tasks`).pipe(
          map(response => response.docs)
        );
      }
    
      createTask(task: Task): Observable<Task> {
        const formData = new FormData();
        formData.append('title', task.title);
        formData.append('description', task.description);
        formData.append('completed', task.completed.toString());
        if (task.image) {
          formData.append('image', task.image.id);
        }
    
        return this.http.post<Task>(`${this.baseUrl}/api/tasks`, formData);
      }

/*
  async updateTask(taskId: string, task: any) {
    try {
      const response = await axios.put(`${this.baseUrl}/tasks/${taskId}`, task); // PUT request to update the task
      return response.data;
    } catch (error) {
      console.error('Error updating task in Payload CMS:', error);
      throw error;
    }
  }


  async deleteTask(taskId: string) {
    try {
      const response = await axios.delete(`${this.baseUrl}/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task in Payload CMS:', error);
      throw error;
    }
  }*/
}
