import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';

@Component({
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css'],
})
export class CameraComponent implements OnInit {
  sending = false;
  train: { name: string; files: any[] }[] = [];
  uploading = false;
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  setFiles(name: string, fileList: Event): void {
    if (fileList === null) {
      return;
    } else {
      const files = (fileList.target as HTMLInputElement).files;
      if (files !== null) {
        for (const file of files) {
          if (!file.type.includes('image')) {
            this.snackBar.open('Only images are allowed', '', {
              duration: 2000,
            });
            return;
          }
        }
        if (files.length < 3) {
          this.snackBar.open('Upload at least 3 images', '', {
            duration: 2000,
          });
          return;
        }
        if (files.length > 5) {
          this.snackBar.open('Upload maximum 5 images', '', {
            duration: 2000,
          });
          return;
        }
        this.train.push({ name, files: [] });
        let done = 0;
        this.uploading = true;
        for (const file of files) {
          const reader = new FileReader();
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              this.train[this.train.length - 1].files.push(canvas.toDataURL());
              done++;
              if (done === files.length) {
                this.uploading = false;
                this.snackBar.open('Uploaded successfully', '', {
                  duration: 2000,
                });
              }
            };
            img.src = (e.target as FileReader).result as string;
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  sendData(): void {
    this.sending = true;
    if (this.train.length <= 1) {
      return;
    }
    this.http
      .post(`${environment.server}/register`, { train: this.train })
      .subscribe((data) => {
        this.sending = false;
        this.train = [];
      });
  }
}
