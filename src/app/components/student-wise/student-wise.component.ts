import { HttpParams, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './student-wise.component.html',
  styleUrls: ['./student-wise.component.css'],
})
export class StudentWiseComponent implements OnInit {
  start = new Date(new Date().getTime() - 7 * 60 * 60 * 24 * 1000);
  end = new Date(new Date().setHours(23, 59, 59, 99));
  options: any;
  loaded = false;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  fetchData(name: string): void {
    this.end = new Date(this.end.setHours(23, 59, 59, 99));
    const opts = {
      params: new HttpParams().appendAll({
        person: name,
        from: (this.start.getTime() / 1000).toString(),
        to: (this.end.getTime() / 1000).toString(),
        expand: '1',
      }),
    };
    this.loaded = false;
    this.http
      .get(environment.server + '/attendance', opts)
      .subscribe((res: any) => {
        const disallow = res.att.filter(
          (e: any) => e.disallowReason.length === 0
        ).length;
        this.options = {
          title: {
            text: `Attendance of ${name}`,
            left: 'center',
          },
          tooltip: {
            trigger: 'item',
          },
          legend: {
            orient: 'horizontal',
            bottom: 'bottom',
          },
          series: [
            {
              name: 'Attendance',
              type: 'pie',
              radius: '50%',
              data: [
                { value: res.att.length - disallow, name: 'Present Times' },
                {
                  value: disallow,
                  name: 'Disallowed Times',
                },
                {
                  value: Math.floor(
                    (this.end.getTime() - this.start.getTime()) /
                      (1000 * 3600 * 24) -
                      res.att.length
                  ),
                  name: 'Absent Times',
                },
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
          animationEasing: 'elasticOut',
        };
        this.loaded = true;
      });
  }
}
