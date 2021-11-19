import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfirmerComponent } from './confirmer/confirmer.component';

@Component({
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.css'],
})
export class WebcamComponent implements OnInit {
  showWebcam = true;
  isCameraExist = true;
  errors: WebcamInitError[] = [];
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();
  numImages = 3;
  numFixed = false;
  started = false;
  name = '';
  error = false;
  sending = false;
  train: { name: string; files: any[] }[] = [];
  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.isCameraExist = mediaDevices && mediaDevices.length > 0;
      }
    );
  }

  takeSnapshot(): void {
    this.trigger.next();
  }

  onOffWebCame() {
    this.showWebcam = !this.showWebcam;
  }

  handleInitError(error: WebcamInitError) {
    this.errors.push(error);
  }

  changeWebCame(directionOrDeviceId: boolean | string) {
    this.nextWebcam.next(directionOrDeviceId);
  }

  start(): void {
    const exist = this.train.find((item) => item.name === this.name);
    if (exist) {
      this.error = true;
      return;
    }
    this.error = false;
    this.train.push({ name: this.name, files: [] });
    this.started = true;
  }

  handleImage(webcamImage: WebcamImage) {
    const d = this.dialog.open(ConfirmerComponent, {
      data: webcamImage.imageAsDataUrl,
    });

    d.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        const len = this.train.length;
        this.train[len - 1].files.push(result);
        if (this.train[len - 1].files.length === this.numImages) {
          this.started = false;
        }
      }
    });
  }

  sendData(): void {
    this.sending = true;
    this.http
      .post(`${environment.server}/register`, { train: this.train })
      .subscribe((data) => {
        console.log(data);
        this.sending = false;
        this.train = [];
      });
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
}
