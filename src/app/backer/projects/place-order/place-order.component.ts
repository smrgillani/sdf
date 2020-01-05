import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import {ProjectsService} from 'app/projects/projects.service';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import {AuthService} from 'app/auth/auth.service';
import ProjectModel from 'app/projects/models/ProjectModel';


@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss'],
  providers: [
    ProjectsService
  ],
})
export class PlaceOrderComponent implements OnInit {
  projectId: number;
  project: ProjectModel;

  isCollapsedArray : boolean[] = [];
  fundtypes: any[] = [
    {
      "fundtypeid": "1",
      "fundtypename": "Equity crowd funding / exchangeable equity",
      "funddesc": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
      "questions": [{
        "id": 1,
        "question": "Minimum Target Offering Amount ($)",
        "question_type": "textbox",
      }, {
        "id": 2,
        "question": "Due by",
        "question_type": "calendar",
      },
      {
        "id": 3,
        "question": "Amount of equity (%)",
        "question_type": "textbox",
      }, {
        "id": 4,
        "question": "Return in form",
        "question_type": "selectbox",
      }, {
        "id": 5,
        "question": "Price/ Security ($)",
        "question_type": "textbox",
      },
      {
        "id": 6,
        "question": "Quantity",
        "question_type": "number",
      }],
      "terms_n_conditions": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",

    },
    {
      "fundtypeid": "2",
      "fundtypename": "Debt financing / corporate bond long term debt instruments",
      "bodytext": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
      "questions": [{
        "id": 1,
        "question": "Minimum Target Offering Amount ($)",
        "question_type": "textbox",
      }, {
        "id": 2,
        "question": "Due by",
        "question_type": "calendar",
      },
      {
        "id": 3,
        "question": "Amount of equity (%)",
        "question_type": "textbox",
      }, {
        "id": 4,
        "question": "Return in form",
        "question_type": "selectbox",
      }, {
        "id": 5,
        "question": "Price/ Security ($)",
        "question_type": "textbox",
      },
      {
        "id": 6,
        "question": "Quantity",
        "question_type": "number",
      }],
      "terms_n_conditions": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",

    }, {
      "fundtypeid": "3",
      "fundtypename": "Loans services",
      "bodytext": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
      "questions": [{
        "id": 1,
        "question": "Amount of Loan ($)",
        "question_type": "textbox",
      }, {
        "id": 2,
        "question": "Type of Payment",
        "question_type": "textbox",
      },
      {
        "id": 3,
        "question": "Interest rate, which you wish to pay (%)",
        "question_type": "textbox",
      }, {
        "id": 4,
        "question": "Amount of Sanction ($)",
        "question_type": "textbox",
      }],
      "terms_n_conditions": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",

    },
    {
      "fundtypeid": "4",
      "fundtypename": "Normal crowdfunding",
      "bodytext": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
      "questions": [{
        "id": 1,
        "question": "Minimum Target Offering Amount ($)",
        "question_type": "textbox",
      }, {
        "id": 2,
        "question": "Due by",
        "question_type": "calendar",
      },
      {
        "id": 3,
        "question": "Return in form",
        "question_type": "selectbox",
      }, {
        "id": 4,
        "question": "Price/ Security ($)",
        "question_type": "textbox",
      },
      {
        "id": 5,
        "question": "Quantity",
        "question_type": "number",
      }],
      "terms_n_conditions": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",

    },
    {
      "fundtypeid": "5",
      "fundtypename": "P2P loan/lend",
      "bodytext": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
      "questions": [{
        "id": 1,
        "question": "Amount of Loan ($)",
        "question_type": "textbox",
      }, {
        "id": 2,
        "question": "Min. Amount from each peer ($)",
        "question_type": "textbox",
      },
      {
        "id": 3,
        "question": "Type of Payment",
        "question_type": "textbox",
      }, {
        "id": 4,
        "question": "Interest rate, which you wish to pay (%)",
        "question_type": "textbox",
      }, {
        "id": 5,
        "question": "Amount of Sanction ($)",
        "question_type": "textbox",
      }],
      "terms_n_conditions": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",

    },
    {
      "fundtypeid": "6",
      "fundtypename": "Company buy offer",
      "bodytext": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
      "questions": [{
        "id": 1,
        "question": "Current valuation of company ($)",
        "question_type": "textbox",
      }, {
        "id": 2,
        "question": "Details of the organization",
        "question_type": "textarea",
      }],
      "terms_n_conditions": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",

    },
    {
      "fundtypeid": "7",
      "fundtypename": "Offer buy-in for shares for a role in company",
      "bodytext": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
      "questions": [{
        "id": 1,
        "question": "CEO",
        "question_type": "boxradio",
        "boxfield": [{
          "price": "2000",
          "Role": "CEO",
          "Percentage": "20"
        }, {
          "price": "1000",
          "Role": "CTO",
          "Percentage": "15"
        },
        ],

      }],
      "terms_n_conditions": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",

    }, {
      "fundtypeid": "8",
      "fundtypename": "Split equity with new founders / request to join a startup",
      "bodytext": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
      "questions": [{
        "id": 1,
        "question": "Minimum Target Offering Amount ($)",
        "question_type": "boxradio",
        "boxfield": [{
          "price": "2000",
          "Role": "CEO",
          "Percentage": "20"
        }, {
          "price": "1000",
          "Role": "CTO",
          "Percentage": "15"
        },
        ],
      }],
      "terms_n_conditions": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",

    },
    {
      "fundtypeid": "9",
      "fundtypename": "Initial bond offering - debt based bonds",
      "bodytext": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p><p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",
      "questions": [{
        "id": 1,
        "question": "Minimum Target Offering Amount ($)",
        "question_type": "textbox",
      }, {
        "id": 2,
        "question": "Due by",
        "question_type": "calendar",
      },
      {
        "id": 3,
        "question": "Amount of equity (%)",
        "question_type": "textbox",
      }, {
        "id": 4,
        "question": "Return in form",
        "question_type": "selectbox",
      }, {
        "id": 5,
        "question": "Price/ Security ($)",
        "question_type": "textbox",
      },
      {
        "id": 6,
        "question": "Quantity",
        "question_type": "number",
      }],
      "terms_n_conditions": "<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>",

    }
  ];

  constructor(
    private projectsService: ProjectsService,
    private location: Location,
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.projectId = parseInt(this.activatedRoute.snapshot.params['id'], 10);
    this.project = new ProjectModel();
  }

  ngOnInit(
  ): void {
  
    this.getProject();
    // this.getQAList();
    this.fundtypes.forEach((item, index) => {
      this.isCollapsedArray[index] = true;
    });

  }
  getProject() {
    this.projectsService.getPublished(this.projectId)
      .subscribe((project: ProjectModel) => {
        this.project = project;
      });
  }

  

  toggleAccordian(e,x){
    let lastopen=this.isCollapsedArray[x];
    this.fundtypes.forEach((item, index) => {
      this.isCollapsedArray[index] = true;
    });
    this.isCollapsedArray[x] = !lastopen;
  
   }
}
