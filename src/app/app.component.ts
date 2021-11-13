import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Autores y Libros';
  loginSuccess: string = 'false';

  loginUserEvent(isLogin: string) {
    this.loginSuccess = isLogin;
  }

  signOutSessionEvent() {
    this.loginSuccess = 'false';
  }
}
