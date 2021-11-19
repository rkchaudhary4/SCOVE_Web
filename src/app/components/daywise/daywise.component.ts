import { environment } from './../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './daywise.component.html',
  styleUrls: ['./daywise.component.css'],
})
export class DaywiseComponent implements OnInit {
  currDate = new Date();
  loaded = false;
  present: string[] = [];
  absent: string[] = [];
  disallowed: { name: string; reason: string }[] = [];
  options: any;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const from = new Date(this.currDate.setHours(0, 0, 0, 0));
    const to = new Date(this.currDate.setHours(23, 59, 59, 99));
    const opts = {
      params: new HttpParams().appendAll({
        from: (from.getTime() / 1000).toString(),
        to: (to.getTime() / 1000).toString(),
      }),
    };
    this.loaded = false;
    this.http
      .get(environment.server + '/attendance', opts)
      .subscribe((res: any) => {
        this.present = [];
        this.absent = [];
        this.disallowed = [];
        for (const i of Object.keys(res.all)) {
          const name = res.all[i];
          const arr = res.att.filter((e: any) => e.faceLabel === name);
          if (arr.length === 0) {
            this.absent.push(name);
          } else if (arr[arr.length - 1].disallowReason.length === 0) {
            this.present.push(name);
          }
        }
        res.att.forEach((e: any) => {
          if (
            e.disallowReason.length > 0 &&
            (this.present.findIndex((s) => s === e.faceLabel) === -1 ||
              e.faceLabel === 'unknown')
          ) {
            this.disallowed.push({
              name: e.faceLabel,
              reason: e.disallowReason,
            });
          } else if (e.faceLabel === 'unknown') {
            this.present.push(e.faceLabel);
          }
        });

        const data = [
          { value: this.present.length, name: 'Present Students' },
          { value: this.absent.length, name: 'Absent Students' },
        ];
        this.options = {
          title: {
            text: 'Attendance of students',
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
                {
                  value: res.att.filter(
                    (e: any) => e.disallowReason.length === 0
                  ).length,
                  name: 'Present Students',
                },
                {
                  value: this.absent.length,
                  name: 'Absent Students',
                },
                {
                  value: this.disallowed.length,
                  name: 'Disallowed Students',
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
