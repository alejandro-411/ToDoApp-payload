import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayloadService } from '../../services/payload.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-taskform',
  templateUrl: './taskform.component.html',
  styleUrls: ['./taskform.component.css']
})
export class TaskFormComponent implements OnInit {
  @Output() taskCreated = new EventEmitter<void>();
  taskForm: FormGroup;
  isFormCollapsed: boolean = false;

  constructor(
    private fb: FormBuilder,
    private payloadService: PayloadService
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      completed: [false],
      image: [null]
    });
  }

  ngOnInit(): void {}

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
  }
  
  onSubmit(): void {
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
  }
  

}
