import { Component, OnInit } from '@angular/core';
import { TasksService } from 'app/projects/tasks.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'app/core/custom-form-validator';
import { ExtensionProcessModel } from './extension-process-model';

@Component({
  selector: 'app-extension-process',
  templateUrl: './extension-process.component.html',
  styleUrls: ['./extension-process.component.scss']
})
export class ExtensionProcessComponent implements OnInit {

  frmExtensionHours: FormGroup;
  extended_hours: FormControl;
  extensionInfo: ExtensionProcessModel;
  processId: number;

  constructor(private tasksService: TasksService,
    private router: Router,
    private route: ActivatedRoute, private fb: FormBuilder) {
    console.log(route.snapshot.params['processId']);
    this.processId = parseInt(route.snapshot.params['processId']);
  }

  ngOnInit() {
    this.extensionInfo = new ExtensionProcessModel();
    this.extended_hours = new FormControl("", [Validators.required, CustomValidators.numeric]);

    this.frmExtensionHours = this.fb.group({
      extended_hours: this.extended_hours
    });
  }

  clear() {
    this.frmExtensionHours.reset();
  }

  submit() {
    if (this.frmExtensionHours.valid) {
      console.log(this.extensionInfo.extended_hours);
      this.extensionInfo.task = this.processId;
      this.tasksService.postExtensionHour(this.extensionInfo).subscribe((obj)=>{
        this.router.navigate([{
          outlets: { documents: ['process', this.processId] }
        }], { relativeTo: this.route.parent })
      });
    }
    else {
      this.validateAllFormFields(this.frmExtensionHours);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

}
