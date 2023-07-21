import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  standalone:true
})
export class TestComponent {

  constructor(
    private api:ApiService
  ){}

  getData(){
    this.api.getUsers().subscribe((res)=>{
      console.log(res,'GOT USERS');
    },(error)=>{
      this.api.backgroundSync('get-users')
    })
  }

  downloadFile(){
    const url = 'https://onlinetestcase.com/wp-content/uploads/2023/06/1.5-MB.pdf';

  }
}
