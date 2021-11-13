import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserModel } from 'src/app/model/user.model';
import { SharedService } from 'src/app/services/shared.service';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Output() loginUser = new EventEmitter();
  login: UserModel;
  submitSearch: boolean = false;
  isSuccess: boolean = true;
  constructor(private sharedService: SharedService) {
    this.login = new UserModel();
   }

  ngOnInit(): void {
  }

  submit() {
    console.log(this.login);
    this.submitSearch = true;
    this.sharedService.authenticationUser(this.login).subscribe((success: boolean) => {
      this.submitSearch = false;
      this.isSuccess = success;
      this.loginUser.emit(this.isSuccess.toString());
    });
  }

}
