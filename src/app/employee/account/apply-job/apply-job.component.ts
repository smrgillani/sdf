import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StageStorage } from 'app/employeeprofile/stage-storage.service';

@Component({
  selector: 'app-apply-job',
  templateUrl: './apply-job.component.html',
  styleUrls: ['./apply-job.component.scss']
})
export class ApplyJobComponent implements OnInit {

  id: number;
  cover_letter: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private applyJobService: StageStorage) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  applyMyJob() {
    this.applyJobService.applyMyJob({job:this.id, cover_letter: this.cover_letter }).subscribe((appliedJob)=>{
      this.router.navigate(['find-work'], {relativeTo: this.route.parent});
    });
  }

}
