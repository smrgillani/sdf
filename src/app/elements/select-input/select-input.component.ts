import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.css']
})
export class SelectInputComponent implements OnInit {
  loginMethod = [
    { label: 'Email', value: 'email' },
    { label: 'Phone', value: 'phone' },
    { label: 'User Name', value: 'username' },
    { label: 'ID Proof', value: 'idproof' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
