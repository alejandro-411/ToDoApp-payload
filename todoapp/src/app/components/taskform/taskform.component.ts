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

    this.editTaskService.taskToEdit$.subscribe((task: Task) => {
      this.taskToEdit = task;
      if(task){
        this.taskForm.patchValue(task);
      }else{
        this.taskForm.reset();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['taskToEdit'] && changes['taskToEdit'].currentValue){
      this.isEditMode = true;
      this.isFormCollapsed = false;
      this.taskForm.patchValue(this.taskToEdit as any);
    }
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.taskForm.patchValue({
        image: file
      });
    }
  }

  toggleForm(): void{
    this.isFormCollapsed = !this.isFormCollapsed;
    if(this.isFormCollapsed){
      this.isEditMode = false;
      this.taskForm.reset();
      this.taskToEdit = null;
    }
  }
  
  /*onSubmit(): void {
    if (this.taskForm.valid) {
      const task: Task = this.taskForm.value;
      this.payloadService.createTask(task).subscribe({
        next: (newTask: Task) => {
          console.log('Task created:', newTask);
          this.taskForm.reset();
          this.taskCreated.emit();
          this.toggleForm();
        },
        error: (error) => {
          console.error('Error creating task:', error);
        }
      });
    }
  }*/
  
    onSubmit(): void {
      if (this.taskForm.invalid) {
        return;
      }
    
      const task: Task = {
        id: 0, // Add the 'id' property with a default value
        title: this.taskForm.get('title')?.value,
        description: this.taskForm.get('description')?.value,
        completed: this.taskForm.get('completed')?.value,
        image: this.taskForm.get('image')?.value
      };
    
      if (this.isEditMode && this.taskToEdit) {
        task.id = this.taskToEdit.id;
        this.payloadService.editTask(task).subscribe((updatedTask: Task) => {
          this.taskUpdated.emit(updatedTask);
          this.toggleForm();
        }, error => {
          console.error('Error updating task:', error);
        });
      } else {
        this.payloadService.createTask(task).subscribe(() => {
          this.taskCreated.emit();
          this.toggleForm();
        }, error => {
          console.error('Error creating task:', error);
        });
      }
    }


}
