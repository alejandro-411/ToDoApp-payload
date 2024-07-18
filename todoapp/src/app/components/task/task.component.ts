import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { PayloadService } from '../../services/payload.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  tasks: Task[] = [];
  showAlert: boolean = false; // Declare the showAlert property
  alertMessage: string = ''; // Declare the alertMessage property

  constructor(private payloadService: PayloadService) { }

  ngOnInit(): void {
    this.payloadService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    }, error => {
      console.error('Error fetching tasks:', error);
    });
  }

  getTaskImageUrl(imageId: string): string {
    const url = `http://localhost:3000/media/${imageId}`;  
    console.log('Image URL:', url);
    return url;
  }

  toggleTaskCompletion(task: Task): void {
    const wasCompleted = task.completed;
    task.completed = !task.completed;
    this.payloadService.editTask(task).subscribe({
      next: (updatedTask: Task) => {
        if (!wasCompleted) {
          // Solo muestra la alerta si la tarea ahora está completada
          this.showAlert = true;
          this.alertMessage = '¡Tarea completada con éxito!';
          setTimeout(() => this.showAlert = false, 3000);
        }
        console.log('Task updated:', updatedTask);
      },
      error: (error) => {
        console.error('Error updating task:', error);
        // Revertir el cambio si la actualización falla
        task.completed = wasCompleted;
        // Opcional: Mostrar un mensaje de error al usuario
      }
    });
  }

  onTaskCreated(newTask: Task) {
    this.tasks.push(newTask);
  }


}
