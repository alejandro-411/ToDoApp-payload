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

  /**
   * Initializes the component after Angular has initialized all data-bound properties.
   * Subscribes to the `fromCollapsed$` and `taskToEdit$` observables of the `editTaskService`.
   * Updates the component's state based on the emitted values.
   */
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

  /**
   * Handles the file change event.
   * 
   * @param event - The file change event.
   */
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.taskForm.patchValue({
        image: file
      });
    }
    console.log('Imagen (onfileChange):', this.taskForm.get('image')?.value);
  }

  /**
   * Toggles the form visibility and resets the form fields.
   * If the form is currently collapsed, it expands it and sets the edit mode to false.
   * If the form is currently expanded, it collapses it, resets the form fields, and clears the task to edit.
   */
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

    /**
     * Handles the form submission
     * If the form is invalid, the function returns early.
     * Creates a new task object based on the form values.
     * If the form is in edit mode and the task has an ID, it calls the payloadService to edit the task.
     * If the form is not in edit mode, it calls the payloadService to create a new task.
     * Emits events and logs relevant information.
     * 
     * @returns void
     */
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
    console.log('Tarea::', task);
}

    /**
     * Hides the task form and resets its state.
     * Sets the form collapsed state to true.
     * Sets the edit mode to false.
     * Resets the task form.
     * Sets the form collapsed state in the edit task service to true.
     * Sets the task to edit in the edit task service to null.
     */
    private hideForm(): void {
      this.isFormCollapsed = true;
      this.isEditMode = false;
      this.taskForm.reset();
      this.editTaskService.setFormCollapsed(true);
      this.editTaskService.setTaskToEdit(null);
    }

}
