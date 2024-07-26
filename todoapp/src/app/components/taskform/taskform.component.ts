import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayloadService } from '../../services/payload.service';
import { Task } from '../../models/task.model';
import { EditTaskService } from 'src/app/services/edit-task.service';

@Component({
  selector: 'app-taskform',
  templateUrl: './taskform.component.html',
  styleUrls: ['./taskform.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() taskToEdit: Task | null = null;
  @Output() taskCreated = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<Task>();
  taskForm: FormGroup;
  isFormCollapsed: boolean = true;
  isEditMode: boolean = false;
  taskId: number = 0;

  constructor(
    private fb: FormBuilder,
    private payloadService: PayloadService,
    private editTaskService: EditTaskService
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      completed: [false],
      image: [null]
    });
  }

   ngOnInit(): void {
    this.editTaskService.fromCollapsed$.subscribe((value: boolean) => {
      this.isFormCollapsed = value;
    });

    this.editTaskService.taskToEdit$.subscribe((task: Task | null) => {
      if (task) {
        this.isEditMode = true;
        this.isFormCollapsed = false;
        this.taskForm.patchValue(task);
        this.taskId = task.id;
      } else {
        this.isEditMode = false;
        this.isFormCollapsed = true;
        this.taskForm.reset();
      }
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.taskForm.patchValue({
        image: file
      });
    }
    console.log('Imagen (onfileChange):', this.taskForm.get('image')?.value);
  }

  toggleForm(): void{
    console.log('toggleform:');
    this.isFormCollapsed = !this.isFormCollapsed;
    if(this.isFormCollapsed){
      console.log('toggle condition');
      this.isEditMode = false;
      this.taskForm.reset();
      this.taskToEdit = null;
    }
  }

   /* onSubmit(): void {
      if (this.taskForm.invalid) {
        return;
      }

      const task: Task = {
        id: this.taskId,
        title: this.taskForm.get('title')?.value,
        description: this.taskForm.get('description')?.value,
        completed: this.taskForm.get('completed')?.value,
        image: this.taskForm.get('image')?.value,
      };
      console.log('Imagen:', task.image);
      if (this.isEditMode && task.id) {
        this.payloadService.editTask(task).subscribe((updatedTask: Task) => {
          this.taskUpdated.emit(updatedTask);
          //this.toggleForm();
          this.hideForm();
          console.log('ID de la tarea (editmode):', task.id);
        }, error => {
          console.error('Error updating task:', error);
        });
      } else {
        this.payloadService.createTask(task).subscribe(() => {
          console.log('ID de la tarea (createtask):', task.id);
          console.log('Datos imagen (createTask):', task.image);
          this.taskCreated.emit();
          this.toggleForm();
          this.hideForm();
        }, error => {
          console.error('Error creating task:', error);
        });
      }
      console.log('Tarea::', task);
    }*/

    onSubmit(): void {
    if (this.taskForm.invalid) {
        return;
    }

    const task: Task = {
        id: this.taskId,
        title: this.taskForm.get('title')?.value,
        description: this.taskForm.get('description')?.value,
        completed: this.taskForm.get('completed')?.value,
        image: this.taskForm.get('image')?.value,
    };
    console.log('Imagen:', task.image);

    if (this.isEditMode && task.id) {
        this.payloadService.editTask(task).subscribe((updatedTask: Task) => {
            this.taskUpdated.emit(updatedTask);
            this.hideForm();
            console.log('ID de la tarea (editmode):', task.id);
        }, error => {
            console.error('Error updating task:', error);
        });
    } else {
        this.payloadService.createTask(task).subscribe(() => {
            console.log('ID de la tarea (createtask):', task.id);
            console.log('Datos imagen (createTask):', task.image);
            this.taskCreated.emit();
            this.toggleForm();
            this.hideForm();
        }, error => {
            console.error('Error creating task:', error);
        });
    }
    console.log('Tarea:', task);
}
  
    
    

    private hideForm(): void {
      this.isFormCollapsed = true;
      this.isEditMode = false;
      this.taskForm.reset();
      this.editTaskService.setFormCollapsed(true);
      this.editTaskService.setTaskToEdit(null);
    }

}
