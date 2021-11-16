import { HttpParams, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  start = new Date(new Date().getTime() - 7 * 60 * 60 * 24 * 1000);
  end = new Date(new Date().setHours(23, 59, 59, 99));
  loaded = false;
  options: any;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  fetchData(): void {
    this.end = new Date(this.end.setHours(23, 59, 59, 99));
    const opts = {
      params: new HttpParams().appendAll({
        from: (this.start.getTime() / 1000).toString(),
        to: (this.end.getTime() / 1000).toString(),
        expand: '1',
      }),
    };
    this.loaded = false;
    this.http
      .get(environment.server + '/attendance', opts)
      .subscribe((res: any) => {
        let dates: { [key: string]: any } = {};
        const len = Object.keys(res.all).length;
        for (const k of res.att) {
          const date = new Date(k.attTime * 1000);
          const key =
            date.getFullYear() +
            '-' +
            +(date.getMonth() + 1) +
            '-' +
            date.getDate();
          if (!(key in dates)) {
            dates[key] = {
              present: 0,
              absent: len,
              disallowed: 0,
            };
          }
          if (k.disallowReason.length > 0) {
            dates[key].disallowed++;
          } else {
            dates[key].present++;
            if (k.faceLabel !== 'unknown') {
              dates[key].absent--;
            }
          }
        }
        const keys = Object.keys(dates).sort();
        this.options = {
          title: {
            text: 'Report of the selected dates',
            left: 'center',
          },
          tootltip: {
            trigger: 'item',
          },
          legend: {
            orient: 'horizontal',
            bottom: 'bottom',
          },
          xAxis: {
            type: 'category',
            data: keys,
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: 'Present Students',
              data: keys.map((e: string) => dates[e].present),
              type: 'line',
            },
            {
              name: 'Absent Students',
              data: keys.map((e: string) => dates[e].absent),
              type: 'line',
            },
            {
              name: 'Disallowed Students',
              data: keys.map((e: string) => dates[e].disallowed),
              type: 'line',
            },
          ],
        };
        console.log(this.options);
        this.loaded = true;
      });
  }
}
