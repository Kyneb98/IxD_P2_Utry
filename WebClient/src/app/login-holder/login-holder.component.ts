import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { ZalandoTopBarComponent } from '../home/zalando-top-bar/zalando-top-bar.component';
import { LoginInComponent } from './login-in/login-in.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
@Component({
  selector: 'app-login-holder',
  imports: [CommonModule, MatGridListModule, ZalandoTopBarComponent, LoginInComponent],
  templateUrl: './login-holder.component.html',
  styleUrl: './login-holder.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginHolderComponent {

}
