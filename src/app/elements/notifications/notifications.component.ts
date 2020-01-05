import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { AccountService } from 'app/founder/account/account.service';
import { NotificationModel } from 'app/projects/models/notification-model';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExtensionApproveRejectComponent } from './extension-approve-reject/extension-approve-reject.component';
import { ServiceExtensionApproveRejectComponent } from './service-extension-approve-reject/service-extension-approve-reject.component';
import { Subscription } from 'rxjs/Rx';
import { StageStorage as EmployeeService } from 'app/employeeprofile/stage-storage.service';
import { BonusHikeRejectStatusComponent } from './bonus-hike-reject-status/bonus-hike-reject-status.component';
import { DeletePromptComponent } from '../delete-prompt/delete-prompt.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  providers: [EmployeeService]
})
export class NotificationsComponent implements OnInit, OnDestroy, AfterViewInit {  
  notifications: NotificationModel[] = [];
  private notificationCountSubscription: Subscription;

  constructor(
    private accountService: AccountService,
    private modalService: NgbModal,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.accountService.markAsSeenAllNotifications().subscribe();

    this.notificationCountSubscription = this.accountService.notificationCountSubject.subscribe(() => {
      this.getNotificationList();
      localStorage.setItem('notificationsCount_', '0');
    });
  }

  ngAfterViewInit(): void {
    this.getNotificationList();
  }

  ngOnDestroy() {
    this.notificationCountSubscription.unsubscribe();
  }

  getNotificationList() {
    this.accountService.markAsSeenAllNotifications().subscribe();

    this.accountService.getNotificationList().subscribe((listInfo) => {
      for (var i = 0, item; item = listInfo[i]; i++) {
        if (item.title.indexOf('decline') != -1 || item.title.indexOf('accepted') != -1) {
          item['request_response_status'] = 'responded';
        }
      }

      this.notifications = listInfo;
      console.log('notification list: ', this.notifications);
    });
  }

  deleteNotification(notification: NotificationModel, e: Event, index: number) {
    e.stopPropagation();
    
    const modalRef = this.modalService.open(DeletePromptComponent, {
      windowClass: 'interviewmodel modal-dialog-centered',
    });

    modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
      this.accountService.deleteNotification(notification.id).subscribe((obj) => {
        this.notifications.splice(index, 1);
      });

      modalRef.close();
    });
  }

  goTo(notification: NotificationModel) {
    if (!notification.read) {
      this.accountService.cachedNotificationCount = (this.accountService.cachedNotificationCount - 1);
      notification.read = true;
    }

    this.accountService.markAsReadNotification(notification).subscribe(() => {
      if (notification.role === 'creator' && notification.is_redirect) {
        if (notification.to_do_list) {
          this.router.navigate([`/founder/projects/${notification.project}/task`]);
        } else if (notification.service_extension_request) {
          const modalRef = this.modalService.open(ServiceExtensionApproveRejectComponent, {
            windowClass: 'interviewmodel modal-dialog-centered',
          });

          modalRef.componentInstance.id = notification.service_extension_request;

          modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
            if (emmitedValue === true) {
              this.getNotificationList();
            }
          });
        } else if (notification.bonus_request) {
          this.router.navigate(['/founder/projects/' + notification.project + '/recruitment/requests'], {
            queryParams: { bonus_requestId: notification.bonus_request, projectId: notification.project },
          });
          // const modalRef = this.modalService.open(BonusHikeRejectStatusComponent, {
          //   windowClass: 'interviewmodel modal-dialog-centered',
          // });

          // modalRef.componentInstance.id = notification.bonus_request;
          // modalRef.componentInstance.type = 'Bonus';

          // modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
          //   if (emmitedValue === true) {
          //     this.getNotificationList();
          //   }
          // });
        } else if (notification.hike_request) {
          this.router.navigate(['/founder/projects/' + notification.project + '/recruitment/requests'], {
            queryParams: { hike_requestId: notification.hike_request, projectId: notification.project },
          });
        } else if (notification.quitjob_request) {
          this.router.navigate(['/founder/projects/' + notification.project + '/recruitment/requests'], {
            queryParams: { quitjob_requestId: notification.quitjob_request, projectId: notification.project },
          });
        } else if (notification.service && notification.project) {
          this.router.navigate([`/founder/projects/${notification.project}/services/${notification.service}/work-area`]);
        } else if (notification.interview_details && notification.interview_details.length > 0) {
          this.router.navigate([`/founder/projects/${notification.project}/recruitment`]);
        } else if (notification.is_chat) {
          this.router.navigate([`/founder/projects/${notification.project}/collaboration`]);
        } else if (notification.task_extension_request) {
          const modalRef = this.modalService.open(ExtensionApproveRejectComponent, {
            windowClass: 'interviewmodel modal-dialog-centered',
          });

          modalRef.componentInstance.id = notification.task_extension_request;
        } else if (notification.is_direct_chat && notification.room_id) {
          this.router.navigate([`/founder/chat-rooms/${notification.room_id}`]);
        } else if (notification.event_invitation_id) {
          this.router.navigate(['/founder/forum-overview/events/list'], {
            queryParams: {invitationId: notification.event_invitation_id},
          });
        }
      } else if (notification.role === 'employee' && notification.is_redirect) {
        if (notification.interview_details && notification.interview_details.length > 0 && notification.interview_details[0].job_application) {
          this.router.navigate([`/employee/account/${notification.interview_details[0].job_application}/true/interview`]);
        } else if (notification.title && notification.title.indexOf('Receieved new assignment') !== -1 && notification.service) {
          this.router.navigate([`/employee/account/project-list`]);
        } else if (notification.title && notification.title.indexOf('Assign new task') !== -1) {
          this.router.navigate([`/employee/account/${notification.project}/collaboration`]);
        } else if (notification.service) {
          this.router.navigate([`/employee/account/${notification.service}/work-area`]);
        } else if (notification.is_chat) {
          this.router.navigate([`/employee/account/${notification.project}/collaboration`]);
        } else if (notification.hire_details) {
          this.router.navigate([`/employee/account/my-proposals`]);
        } else if (notification.is_chat) {
          this.router.navigate([`/employee/account/${notification.project}/collaboration`]);
        } else if (notification.is_direct_chat && notification.room_id) {
          this.router.navigate([`/employee/chat-rooms/${notification.room_id}`]);
        } else if (notification.bonus_request) {
          this.router.navigate(['/employee/account/founder-list']);
        } else if (notification.hike_request) {
          this.router.navigate(['/employee/account/founder-list']);
        } else if (notification.quitjob_request) {
          this.router.navigate(['/employee/account/founder-list']);
        }
      } else if (notification.role === 'backer' && notification.is_redirect) {
        if (notification.is_chat) {
          // this.router.navigate([`/backer/account/${notification.project}/collaboration`]);
          this.router.navigate([`/backer/my-projects/${notification.project}/collaboration`]);
        } else if (notification.is_direct_chat && notification.room_id) {
          this.router.navigate([`/backer/chat-rooms/${notification.room_id}`]);
        }
      } else if (notification.title.indexOf('$') !== -1) {
        this.router.navigate(['/founder/transactions']);
      }
      this.getNotificationList();
    });
  }

  updateRequestStatus(notification: NotificationModel, status: string, e: Event) {
    e.stopPropagation();

    if (notification.bonus_request > 0) {
      this.employeeService.putBounusRequest({ id: notification.bonus_request, status: status}).subscribe((obj) => {
        console.log(obj);
        this.getNotificationList();
      });
    } else if (notification.hike_request > 0) {
      this.employeeService.putHikeRequest({ id: notification.hike_request, status: status}).subscribe((obj) => {
        console.log(obj);
        this.getNotificationList();
      });
    } else if (notification.quitjob_request > 0) {
      if (status == 'accept') {
        const modalRef = this.modalService.open(BonusHikeRejectStatusComponent, {
          windowClass: 'interviewmodel modal-dialog-centered',
        });
  
        modalRef.componentInstance.id = notification.quitjob_request;
        modalRef.componentInstance.type = 'QuitJob';
        modalRef.componentInstance.openFrom = 'notifications';
  
        modalRef.componentInstance.emitService.subscribe((emmitedValue) => {
          if (emmitedValue === true) {
            this.getNotificationList();
          }
        });
      } else if (status == 'decline') {
        this.employeeService.putQuitJobRequest({ id: notification.quitjob_request, status: status, notice_period: 0}).subscribe((obj) => {
          console.log('updateRequestStatus decline:', obj);
          this.getNotificationList();
        });
      }
    }
  }
}
