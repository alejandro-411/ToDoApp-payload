import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EditTaskService } from 'src/app/services/edit-task.service';
import { Task } from '../../models/task.model';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


@Component({
  selector: 'app-taskform',
  templateUrl: './taskform.component.html',
  styleUrls: ['./taskform.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() taskToEdit: Task | null = null;
  @Output() taskCreated = new EventEmitter<Task>();
  @Output() taskUpdated = new EventEmitter<Task>();
  taskForm: FormGroup;
  isFormCollapsed = true;
  isEditMode = false;
  taskId = 0;

  constructor(
    private fb: FormBuilder,
    private editTaskService: EditTaskService,
    private http: HttpClient
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

 /* onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.taskForm.patchValue({
        image: file
      });
    }
  }*/

  toggleForm(): void {
    this.isFormCollapsed = !this.isFormCollapsed;
    if (this.isFormCollapsed) {
      this.isEditMode = false;
      this.taskForm.reset();
      this.taskToEdit = null;
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
  
  /*onSubmit(): void {
    if (this.taskForm.invalid) {
      return;
    }
  
    const formData = new FormData();
    formData.append('title', this.taskForm.get('title')?.value);
    formData.append('description', this.taskForm.get('description')?.value);
    formData.append('completed', (this.taskForm.get('completed')?.value ?? false).toString());
  
    const imageFile = this.taskForm.get('image')?.value;
    if (imageFile instanceof File) {
      this.uploadImage(imageFile).then((imageId) => {
        formData.append('image', imageId);
        this.submitTaskForm(formData);
      }).catch(error => {
        console.error('Error uploading image:', error);
      });
    } else {
      this.submitTaskForm(formData);
    }
  }
  
  private async uploadImage(imageFile: File): Promise<string> {
    const uploadFormData = new FormData();
    uploadFormData.append('file', imageFile);
  
    const response: any = await this.http.post('http://localhost:3000/api/media', uploadFormData).toPromise();
    return response.id; // Asegúrate de que el ID de la imagen se devuelve correctamente desde el servidor
  }*/

    onSubmit(): void {
      if (this.taskForm.invalid) {
        return;
      }
    
      const formData = new FormData();
      formData.append('title', this.taskForm.get('title')?.value);
      formData.append('description', this.taskForm.get('description')?.value);
      formData.append('completed', (this.taskForm.get('completed')?.value ?? false).toString());
    
      const imageFile = this.taskForm.get('image')?.value as File;
      /*if (imageFile) {
        console.log('Uploading file:', imageFile);
        this.uploadImage(imageFile).then(imageId => {
          console.log('Image uploaded, received id:', imageId);
          formData.append('image', imageId); // Añadir el ID de la imagen al formulario
          this.saveTask(formData);
        }).catch(error => {
          console.error('Error uploading image:', error);
        });
      } else {
        this.saveTask(formData);
      }*/

        if (imageFile) {
          console.log('Uploading image:', imageFile);
          this.uploadImage(imageFile).subscribe(
            (imageId: any) => {
              console.log('Image uploaded, received ID:', imageId);
              formData.append('image', imageId);
              this.saveTask(formData);
            },
            (error: any) => {
              console.error('Error uploading image:', error);
            }
          );
        } else {
          this.saveTask(formData);
        }
    }
    
    private saveTask(formData: FormData): void {
      const baseUrl = 'http://localhost:3000/api/tasks'; // URL base de tu API
      const url = this.isEditMode && this.taskId ? `${baseUrl}/${this.taskId}` : baseUrl;
      const method = this.isEditMode ? 'PUT' : 'POST';
    
      const headers = new HttpHeaders();
      
      // No establecer 'Content-Type', el navegador lo hará automáticamente incluyendo el boundary
      this.http.request(method, url, {
        body: formData,
        headers: headers
      }).subscribe(
        (response: any) => {
          console.log('Tarea creada o actualizada:', response);
          if (this.isEditMode) {
            this.taskUpdated.emit(response);
          } else {
            this.taskCreated.emit(response);
          }
          this.hideForm();
        },
        error => {
          console.error('Error:', error);
        }
      );
    }
    
    /*private async uploadImage(imageFile: File): Promise<string> {
      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFile);
      uploadFormData.append('altText', ''); // Puedes añadir texto alternativo si lo deseas
    
      const response: any = await this.http.post('http://localhost:3000/api/media', uploadFormData).toPromise();
      return response.id; // Asegúrate de que el ID de la imagen se devuelve correctamente desde el servidor
    }*/
    
      private uploadImage(imageFile: File): Observable<string> {
        const uploadFormData = new FormData();
        uploadFormData.append('file', imageFile);
        uploadFormData.append('alt', imageFile.name);
      
        return this.http.post('http://localhost:3000/api/media', uploadFormData).pipe(
          map((response: any) => {
            console.log('Server response:', response);
            if (response && response.doc && response.doc.id) {
              return response.doc.id;
            } else {
              throw new Error('Invalid response from server: ' + JSON.stringify(response));
            }
          }),
          catchError((error) => {
            console.error('Error uploading image:', error);
            return throwError(error);
          })
        );
      }
            
    
  
  private submitTaskForm(formData: FormData): void {
    const baseUrl = 'http://localhost:3000/api/tasks';
    const url = this.isEditMode && this.taskId ? `${baseUrl}/${this.taskId}` : baseUrl;
    const method = this.isEditMode ? 'PUT' : 'POST';
  
    this.http.request(method, url, {
      body: formData,
      headers: new HttpHeaders()
    }).subscribe(
      (response: any) => {
        console.log('Tarea creada o actualizada:', response);
        if (this.isEditMode) {
          this.taskUpdated.emit(response);
        } else {
          this.taskCreated.emit(response);
        }
        this.hideForm();
      },
      error => {
        console.error('Error:', error);
      }
    );
  }
  

  private hideForm(): void {
    this.isFormCollapsed = true;
    this.isEditMode = false;
    this.taskForm.reset();
    this.editTaskService.setFormCollapsed(true);
    this.editTaskService.setTaskToEdit(null);
  }
}
