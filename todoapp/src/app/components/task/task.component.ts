import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Task } from '../../models/task.model';
import { PayloadService } from '../../services/payload.service';
import { EditTaskService } from 'src/app/services/edit-task.service';
import { TaskFormComponent } from '../taskform/taskform.component';


@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})

export class TaskComponent implements OnInit {
  tasks: Task[] = [];
  showAlert: boolean = false; // Declare the showAlert property
  alertMessage: string = ''; // Declare the alertMessage property
  taskToEdit: Task | null = null; // Declare the taskToEddit property

  constructor(
    private payloadService: PayloadService,
    private editTaskService: EditTaskService // Inyecta el servicio
  ) {}

  /**
   * Initializes the component.
   * Fetches tasks from the payload service and assigns them to the component's tasks property.
   * Handles any errors that occur during the fetch operation.
   */
  ngOnInit(): void {
    this.payloadService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    }, error => {
      console.error('Error fetching tasks:', error);
    });
  }

  /**
   * Deletes a task.
   * 
   * @param task - The task to be deleted.
   */
  deleteTask(task: Task): void {
    this.payloadService.deleteTask(task).subscribe({
      next: () => {
        console.log('Task deleted');
        this.tasks = this.tasks.filter(t => t.id !== task.id);
      },
      error: (error) => {
        console.error('Error deleting task:', error);
      }
    });
  }
 

  /**
   * Loads tasks from the payload service.
   */
  loadTasks(): void{
    this.payloadService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    }, error => {
      console.error('Error fetching tasks:', error);
    });
  }

  /**
   * Callback function triggered when a task is created.
   * It loads the tasks.
   */
  onTaskCreated(): void {
    this.loadTasks()}

  /**
   * Returns the URL for the task image based on the provided image ID.
   * @param imageId - The ID of the image.
   * @returns The URL of the task image.
   */
  getTaskImageUrl(imageId: string): string {
    const url = `http://localhost:3000/media/${imageId}`;  
    console.log('Image URL:', url);
    return url;
  }


  /**
   * Toggles the completion status of a task.
   * If the task was completed, it marks it as incomplete.
   * If the task was incomplete, it marks it as completed and shows an alert message.
   * If there is an error updating the task, it reverts the change and logs an error message.
   * @param task - The task to toggle completion status for.
   */
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

  editTask(task: Task): void {
    this.taskToEdit = task;
    this.editTaskService.setTaskToEdit(task);
    this.editTaskService.setFormCollapsed(false);
    

    console.log('Task to edit:', this.taskToEdit);
    console.log('Task id:', task.id)
  }

  onTaskUpdated(updatedTask: Task): void {
   const index = this.tasks.findIndex(t => t.id === updatedTask.id);
   if(index !== -1) {
     this.tasks[index] = updatedTask;
   }
  }

}
