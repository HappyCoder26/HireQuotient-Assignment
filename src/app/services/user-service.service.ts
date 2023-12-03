import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PeriodicElement } from '../app.component';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserServiceService implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

  }

  getUsers(): Observable<PeriodicElement[]> {
    return this.http.get<PeriodicElement[]>("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
  }

}
