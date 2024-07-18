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

  constructor(private payloadService: PayloadService) { }

  ngOnInit(): void {
    this.payloadService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    }, error => {
      console.error('Error fetching tasks:', error);
    });
  }

  getTaskImageUrl(imageId: string): string {
    const url = `http://localhost:3000/media/${imageId}.jpg`;  // Asegúrate de que la extensión es correcta
    console.log('Image URL:', url);
    return url;
  }

}
