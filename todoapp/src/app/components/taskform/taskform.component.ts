import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayloadService } from '../../services/payload.service';
import { Task } from '../../models/task.model';


@Component({
  selector: 'app-taskform',
  templateUrl: './taskform.component.html',
  styleUrls: ['./taskform.component.css']
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;

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
  
  onSubmit(): void {
    if (this.taskForm.valid) {
      const task: Task = this.taskForm.value;
      this.payloadService.createTask(task).subscribe({
        next: (newTask: Task) => {
          console.log('Task created:', newTask);
          this.taskForm.reset();
        },
        error: (error) => {
          console.error('Error creating task:', error);
        }
      });
    }
  }

  /*createTask(){
    if(this.taskForm.valid){
      const task: Task = this.taskForm.value;
      this.payloadService.createTask(task).subscribe({
        next: (newTask: Task) => {
          console.log('Task created:', newTask);
          this.taskForm.reset();
        },
        error: (error) => {
          console.error('Error creating task:', error);
        }
      })};
  }*/
}
