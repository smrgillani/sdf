import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PaginationMethods } from 'app/elements/pagination/paginationMethods';
import { BlockService } from 'app/block-explore/block-explores/services/block.service';
import { SignedDocumentModel } from 'app/block-explore/block-explores/models/signed-document-model';

@Component({
  selector: 'app-signed-documents',
  templateUrl: './signed-documents.component.html',
  styleUrls: ['./signed-documents.component.scss']
})
export class SignedDocumentsComponent implements OnInit {

  signedDocumentListInfo: SignedDocumentModel[];
  searchText: '';
  pageSize = 5;
  count: number;

  constructor(private blockService: BlockService, private route: ActivatedRoute,
    private router: Router) { 
      this.signedDocumentListInfo = [];
    }

  ngOnInit() {
    this.getSignedDocumentList();
  }

  getSignedDocumentList(newPage?) {
    //if (newPage) {
      this.blockService.getSignedDocumentListInfo(newPage, this.pageSize, this.searchText).subscribe((infoList) => {
        this.signedDocumentListInfo = infoList;
      });
    //}
  }

  valueChange() {
    //this.errorMessage = undefined;
  }

}
