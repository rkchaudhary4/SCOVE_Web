import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'SCOVE-Web';
  isOpen = true;
  mobile = window.screen.width < 720;

  routes = [
    {
      name: 'Day Wise Data',
      link: './daywise',
    },
    {
      name: 'Student Wise Data',
      link: './student',
    },
    { name: 'Reports', link: './report' },
    {
      name: 'Register Faces From Files',
      link: './camera',
    },
    {
      name: 'Register Faces Using Camera',
      link: './webcam',
    }
  ];

  toggle(button: boolean) {
    if (button) {
      this.isOpen = !this.isOpen;
    } else if (this.mobile) {
      this.isOpen = !this.isOpen;
    }
  }
}
