import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditTaskService {

  constructor() { }

  private formCollapsedSubject = new BehaviorSubject<boolean>(true);
  fromCollapsed$ = this.formCollapsedSubject.asObservable();

  private taskToEditSubject = new BehaviorSubject<any>(null);
  taskToEdit$ = this.taskToEditSubject.asObservable();

  setFormCollapsed(value: boolean): void {
    this.formCollapsedSubject.next(value);
  }

  setTaskToEdit(task: any): void {
    this.taskToEditSubject.next(task);
  }

}
