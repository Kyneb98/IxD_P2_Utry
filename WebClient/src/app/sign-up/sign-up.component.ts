import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { CommonModule } from '@angular/common';
import { ZalandoTopBarComponent } from '../home/zalando-top-bar/zalando-top-bar.component';
import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-sign-up',
  imports: [MatGridListModule, SignUpFormComponent, CommonModule, ZalandoTopBarComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SignUpComponent {

}
