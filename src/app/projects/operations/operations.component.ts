import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import ProjectModel from '../models/ProjectModel';
import MilestoneModel from '../models/MilestoneModel';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { MilestoneWorkAdapter } from './adapters';
import { MilestonesService } from '../milestones.service';
import { HasId } from '../../core/interfaces';
import { ProjectsService } from '../projects.service';
import { animate, keyframes, transition, trigger } from '@angular/animations';
import * as kf from '../../elements/hammertime/keyframes';

@Component({
  templateUrl: './operations.component.html',
  styleUrls: ['./operations.component.scss'],
  animations: [
    trigger('cardAnimator', [
      transition('* => wobble', animate(1000, keyframes(kf.wobble))),
      transition('* => swing', animate(1000, keyframes(kf.swing))),
      //  transition('* => jello', animate(1000, keyframes(kf.jello))),
      //  transition('* => zoomOutRight', animate(1000, keyframes(kf.zoomOutRight))),
      //  transition('* => slideOutLeft', animate(1000, keyframes(kf.slideOutLeft))),
      // transition('* => rotateOutUpRight', animate(1000, keyframes(kf.rotateOutUpRight))),
      //  transition('* => flipOutY', animate(1000, keyframes(kf.flipOutY))),
    ]),
  ],
})
export class OperationsComponent implements OnInit {
  project = new ProjectModel();
  showNextForm = false;
  milestone: MilestoneModel;
  modalRef: NgbModalRef;
  chartMode = 'week';
  operations: MilestoneWorkAdapter[];
  animationState: string;
  pinchOut = false;
  milestoneInfo: any[];
  showDetails = false;
  showDetailIndex = 0;
  projectMilestones = [];
  categoryImageList = [];
  confirmDeletingModalRef: NgbModalRef;
  routePrefix: string[] = [];
  allowEdit = false;
  backRoutePath = [];

  readonly slideConfig = {
    slidesToShow: 5,
    slidesToScroll: 5,
    infinite: false,
    arrows: true,
    adaptiveHeight: true,
    responsive: [
      {
        'breakpoint': 1200,
        settings: {
          'slidesToShow': 4,
          'slidesToScroll': 4,
        },
      },
      {
        'breakpoint': 768,
        settings: {
          'slidesToShow': 3,
          'slidesToScroll': 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.5,
          'slidesToScroll': 2,
        },
      },
    ],
  };

  private projectId: number;
  private selectedMilestone: MilestoneModel;
  private slickCurrentSlide = 0;

  private readonly modalOptions: NgbModalOptions = {
    backdrop: true,
    container: '#operations-chart',
    size: 'lg',
    windowClass: 'saffron-popup modal-dialog-centered',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modal: NgbModal,
    private milestonesService: MilestonesService,
    private projectsService: ProjectsService,
  ) {}

  ngOnInit() {
    this.routePrefix = this.route.snapshot.data['routePrefix'];
    this.allowEdit = this.route.snapshot.data['allowEdit'];
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProject();
      // this.loadMilestones();
      this.backRoutePath = [...this.routePrefix, this.projectId];
    });
    this.milestonesService.getMilestoneCategoryImages().subscribe(obj => {
      console.log(obj);
      this.categoryImageList = obj;
    });
  }

  openModal(template: TemplateRef<any>, milestone?: MilestoneModel) {
    this.showNextForm = false;

    if (milestone) {
      this.milestone = _.cloneDeep(milestone);
      this.milestone.isPlaceAfterChanged = false;
    } else {
      this.milestone = new MilestoneModel();
      this.milestone.date_start = moment().hour(8).minute(0).second(0).toDate();
      this.milestone.date_end = moment().hour(17).minute(0).second(0).toDate();
      this.milestone.project = this.projectId;
      this.milestone.icon_name = '';
      this.milestone.icon_category = 'Apartments & Private';
      this.milestone.order = 0;
    }

    this.modalRef = this.modal.open(template, this.modalOptions);
  }

  openMilestone(milestone) {
    console.log('yakkoo ye kya ho raha hai');
    if (!milestone.is_milestone_in_startup_stage) {
      this.router.navigate([this.project.id, 'boards', milestone.id], {
        relativeTo: this.route.parent,
      });
    } else {
      if (this.project.stage === 'startup' && this.project.progress === 100) {
        this.router.navigate([this.project.id, 'summary'], {
          relativeTo: this.route.parent,
        });
      } else {
        this.router.navigate(['../startup', this.project.id], {
          relativeTo: this.route.parent,
        });
      }
    }
  }

  setChartMode(chartMode: string) {
    this.chartMode = chartMode;
  }

  onSelectedWorkChange(work: MilestoneWorkAdapter) {
    this.selectedMilestone = work ? work.milestone : null;
  }

  resetAnimationState() {
    this.animationState = '';
  }

  deselectMilestone() {
    this.milestoneInfo = null;
    this.showDetails = false;
    this.showDetailIndex = 0;
  }

  afterChange(e) {
    console.log(e);
    this.slickCurrentSlide = e.slick.currentLeft;
    this.showDetails = false;
  }

  selectMilestone(e, getMilestone, index) {
    if (this.pinchOut) {
      this.milestoneInfo = getMilestone;
      this.showDetails = true;
      this.showDetailIndex = index;
    }
  }

  createMilestone() {
    this.milestonesService.create(this.milestone)
      .subscribe(() => {
        this.loadMilestones();
        this.modalRef.close();
      }, (error) => {
        console.log(error);
      });
  }

  confirmDeleting(template) {
    this.confirmDeletingModalRef = this.modal.open(template, {backdrop: false});
  }

  updateMilestone() {
    this.milestonesService.update(this.milestone as HasId)
      .subscribe(() => {
        this.loadMilestones();
        this.modalRef.close();
      });
  }

  deleteMilestone() {
    this.milestonesService.delete(this.milestone as HasId)
      .subscribe(() => {
        this.loadMilestones();
        this.modalRef.close();
        this.confirmDeletingModalRef.close();
      });
  }

  private loadProject() {
    if (this.allowEdit) {
      this.projectsService.get(this.projectId).subscribe((project) => {
        this.project = project;
        this.loadMilestones();
      });
    } else {
      this.projectsService.getForBacker(this.projectId).subscribe((project) => {
        this.project = project;
        this.loadMilestones();
      });
    }
  }

  private loadMilestones() {
    if (this.allowEdit) {
      this.milestonesService.list(this.projectId).subscribe((milestones) => {
        const is_startup = milestones.findIndex(a => a.is_milestone_in_startup_stage === true);
        if (is_startup > -1) {
          milestones[is_startup].progress = this.project.stage === 'startup' ? this.project.progress : 0;
        }
        const operations = _.map(milestones, (milestone) => new MilestoneWorkAdapter(milestone));
        this.operations = _.orderBy(operations, 'order');
        this.projectMilestones = _.orderBy(milestones, 'order');
      });
    } else {
      this.milestonesService.listForBacker(this.projectId).subscribe((milestones) => {
        const is_startup = milestones.findIndex(a => a.is_milestone_in_startup_stage === true);
        if (is_startup > -1) {
          milestones[is_startup].progress = this.project.stage === 'startup' ? this.project.progress : 0;
        }
        const operations = _.map(milestones, (milestone) => new MilestoneWorkAdapter(milestone));
        this.operations = _.orderBy(operations, 'order');
        this.projectMilestones = _.orderBy(milestones, 'order');
      });
    }
  }
}
