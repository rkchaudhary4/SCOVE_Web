import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './confirmer.component.html',
  styleUrls: ['./confirmer.component.css'],
})
export class ConfirmerComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    private dialog: MatDialogRef<ConfirmerComponent>
  ) {}

  ngOnInit(): void {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const image = new Image();
    image.src = this.data;
    canvas.width = window.innerWidth * 0.6;
    image.onload = () => {
      canvas.height = (image.height * canvas.width) / image.width;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  }

  proceed(bool: boolean): void {
    if (bool) {
      const canvas = document.getElementById('c') as HTMLCanvasElement;
      this.dialog.close(canvas.toDataURL());
    } else {
      this.dialog.close();
    }
  }
}
