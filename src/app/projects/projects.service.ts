import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import * as moment from 'moment';

import { ApiService } from 'app/core/api/api.service';

import { HasId } from 'app/core/interfaces';
import ProjectModel from './models/ProjectModel';
import ProjectActivityModel from './models/ProjectActivityModel';
import LaunchTypeModel from 'app/projects/models/LaunchTypeModel';
import ProjectLaunchModel from './models/ProjectLaunchModel';
import ProjectLaunchDetailsModel from './models/ProjectLaunchDetailsModel';
import { UpgradeModel, UpgradePackageModel } from './models/upgrade-model';
import FundTypeModel from 'app/projects/models/FundTypeModel';
import ProjectFundTypeDetailsModel from './models/ProjectFundTypeDetailsModel';
import CompanyRoleModel from './models/CompanyRoleModel';
import ProjectFundingModel from 'app/projects/models/ProjectFundingModel';
import ProjectBackerFundingModel from 'app/projects/models/ProjectBackerFundingModel';
import ProjectPaginationModel from 'app/projects/models/ProjectPaginationModel';
import WallmartProductModel from './models/WallmartProductModel';
import ProjectBudgetModel from 'app/projects/models/ProjectBudgetModel';
import { SingleProduct } from './models/single-product';


export class Visibility implements HasId {
  id: number;
  is_visible: boolean;
}

export class NDAVisibility implements HasId {
  id: number;
  show_nda: boolean;
}

/**
 * Projects Service
 * Service provides functions for operations with projects data
 */
@Injectable()
export class ProjectsService {

  tempManageFundSelection: { projectId: number, fundType: ProjectFundingModel }[] = [];
  tempBackerFundSelection: { projectId: number, fundType: ProjectBackerFundingModel }[] = [];

  constructor(
    private api: ApiService,
  ) {}

  /**
   * Get projects list
   *
   * @returns list of projects
   */
  // list(startPage?, pageSize?): Observable<ProjectModel[]> {
  //   if (pageSize) {
  //     const offset = (startPage - 1) * pageSize;
  //     return this.api.get<ProjectModel[]>('projects', {offset: offset, limit: pageSize});
  //   }
  //   return this.api.get<ProjectModel[]>('projects');
  // }

  projectsCount(): Observable<{ count: number }> {
    return this.api.get<{ count: number }>('projects/projects-count');
  }

  list(startPage?, pageSize?, stage?, search?): Observable<ProjectPaginationModel> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<ProjectPaginationModel>('projects', {offset: offset, limit: pageSize, stage: stage, search: search});
    }
    return this.api.get<ProjectPaginationModel>('projects');
  }

  /**
   * Get published projects list
   *
   * @returns list of published projects
   */
  listPublished(startPage?, pageSize?, stage?, search?): Observable<ProjectModel[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<ProjectModel[]>('projects/published', {offset: offset, limit: pageSize, stage: stage, search: search});
    }
    return this.api.get<ProjectModel[]>('projects/published');
  }

  /**
   * Get project data
   *
   * @param projectId - id of project
   * @returns projects data
   */
  get(projectId: number): Observable<ProjectModel> {
    return this.api.get<ProjectModel>(`projects/${projectId}`);
  }

  /**
   * Get project data for backer
   *
   * @param projectId - id of project
   * @returns projects data
   */
  getForBacker(projectId: number): Observable<ProjectModel> {
    return this.api.get<ProjectModel>(`backer-projects/${projectId}`);
  }

  /**
   * Get published project data for Backer
   *
   * @param projectId - id of project
   * @returns projects data
   */
  getPublished(projectId: number) {
    return this.api.get<ProjectModel>(`projects/${projectId}/published`);
  }

  /**
   * Update project data
   *
   * @param project - updated project data
   * @returns updated projects data
   */
  update<T extends HasId>(project: T): Observable<ProjectModel> {
    return this.api.put<T, ProjectModel>(
      `projects/${project.id}`, project,
    );
  }

  /**
   * Set visibility of project
   *
   * @param visibility - project visibility
   * @returns updated projects data
   */
  setVisibility(visibility: Visibility): Observable<ProjectModel> {
    return this.update<Visibility>(visibility);
  }

  /**
   * Set visibility of project
   *
   * @param visibility - project NDA visibility
   * @returns updated projects data
   */
  setNDAVisibility(visibility: NDAVisibility): Observable<ProjectModel> {
    return this.update<NDAVisibility>(visibility);
  }

  /**
   * Get project activity
   *
   * @param projectId - id of project
   * @returns project data with project activities
   */
  getActivity(projectId: number): Observable<ProjectActivityModel> {
    return this.api.get<ProjectActivityModel>(`projects/${projectId}/activity`);
  }

  /**
   * Get project activity for backer
   *
   * @param projectId - id of project
   * @returns project data with project activities
   */
  getActivityForBacker(projectId: number): Observable<ProjectActivityModel> {
    return this.api.get<ProjectActivityModel>(`backer-projects/${projectId}/activity`);
  }

  toDoListPost(task: any, projectId: number): Observable<any> {
    return this.api.post(`projects/${projectId}/todo-list`, task);
  }

  toDoListPut<T extends HasId>(task: T): Observable<any> {
    return this.api.put<T, any>(
      `todo-list/${task.id}`, task,
    );
  }

  toDoListNewPost(task: any, projectId: number): Observable<any> {
    return this.api.post(`projects/${projectId}/todo-list`, task);
  }

  toDoListNewPut(task: any, projectId: number): Observable<any> {
    return this.api.put(
      `projects/${projectId}/todo-list`, task,
    );
  }

  toDoListDelete<T extends HasId>(task: T): Observable<any> {
    return this.api.delete(`todo-list/${task.id}`);
  }

  toDoListGet(projectId: number, startPage?, pageSize?, searchText?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      const title = searchText;
      return this.api.get<any>(`projects/${projectId}/todo-list`, {offset: offset, limit: pageSize, title: title});
    }
    return this.api.get<any>(`projects/${projectId}/todo-list`);
  }

  completedToDoListGet(projectId: number, startPage?, pageSize?, searchText?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      const title = searchText;
      return this.api.get<any>(`projects/${projectId}/todo-list/completed`, {offset: offset, limit: pageSize, title: title});
    }
    return this.api.get<any>(`projects/${projectId}/todo-list/completed`);
  }

  insertNda(projectId: number, ndaData: any): Observable<any> {
    // return this.api.post(`projects/${projectId}/nda-list`, ndaData);
    return this.api.post(`projects/${projectId}/nda`, ndaData);
  }

  fetchNda(projectId: number): Observable<any> {
    // return this.api.get<any>(`projects/${projectId}/nda-list`);
    return this.api.get<any>(`projects/${projectId}/nda-docusign`);
  }

  fetchNdaForBacker(projectId: number): Observable<any> {
    // return this.api.get<any>(`projects/${projectId}/nda-list`);
    return this.api.get<any>(`projects/${projectId}/nda-docusign`);
  }

  updateNdaForBacker(projectId: number, ndaData: any): Observable<any> {
    return this.api.put(`projects/${projectId}/nda-docusign`, ndaData);
  }

  fetchTermsAndCondition(): Observable<any> {
    return this.api.get<any>(`misc/pages/1`);
  }

  updateNda(projectId: number, ndaData: any): Observable<any> {
    return this.api.put(`projects/${projectId}/nda`, ndaData);
  }

  activeFeedlist(startPage?, pageSize?, projectId?: number): Observable<any[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>(`projects/${projectId}/feed`, {offset: offset, limit: pageSize});
    }
    return this.api.get<any[]>(`projects/${projectId}/feed`);
  }

  processDueSoonList(startPage?, pageSize?, projectId?: number): Observable<any[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>(`projects/${projectId}/processes`, {offset: offset, limit: pageSize});
    }
    return this.api.get<any[]>(`projects/${projectId}/processes`);
  }

  activeFeedlistForBacker(startPage?, pageSize?, projectId?: number): Observable<any[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>(`backer-projects/${projectId}/feed`, {offset: offset, limit: pageSize});
    }
    return this.api.get<any[]>(`backer-projects/${projectId}/feed`);
  }

  processDueSoonListForBacker(startPage?, pageSize?, projectId?: number): Observable<any[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>(`backer-projects/${projectId}/processes`, {offset: offset, limit: pageSize});
    }
    return this.api.get<any[]>(`backer-projects/${projectId}/processes`);
  }

  /**
   * Get project launching platforms
   *
   * @returns launching platforms
   */
  getLaunchingPlatforms(): Observable<LaunchTypeModel[]> {
    return this.api.get<LaunchTypeModel[]>(`launch/launch_type`);
  }

  /**
   * Get project launch details
   *
   * @returns project launching details
   */
  getLaunchData(projectId: number): Observable<ProjectLaunchDetailsModel> {
    return this.api.get<ProjectLaunchDetailsModel>(`projects/${projectId}/launch`);
  }


  /**
   * Set project launching platforms
   *
   * @returns launching platforms
   */
  saveProjectLaunch(projectId: number, data: ProjectLaunchModel): Observable<any> {
    return this.api.post(`projects/${projectId}/project_launch`, data);
  }

  /**
   * Get Upgrade Listing
   *
   */
  getUpgradeListing(): Observable<UpgradeModel[]> {
    return this.api.get<UpgradeModel[]>(`package-list`);
  }

  /**
   * Get Upgrade Listing if selected for kthe project
   *
   */
  getSubscribeUpgradeListing(projectId: number): Observable<any[]> {
    return this.api.get<any[]>(`projects/${projectId}/package-details`);
  }

  postUpgradeSubscribePackage(projectId: number, packageData: UpgradePackageModel): Observable<any> {
    return this.api.post(`projects/${projectId}/package-details`, packageData);
  }

  putUpgradeSubscribePackage<T extends HasId>(packageData: T, projectId: number): Observable<any> {
    return this.api.put<T, UpgradePackageModel>(
      `projects/${projectId}/package-details`, packageData,
    );
  }

  /**
   * Get available funding types
   *
   * @returns funding types
   */
  getFundingTypes(): Observable<FundTypeModel[]> {
    return this.api.get<FundTypeModel[]>(`fund/fund_type`);
  }

  getProjectFundingTypeDetails(projectId: number): Observable<ProjectFundTypeDetailsModel> {
    return this.api.get<ProjectFundTypeDetailsModel>(`projects/${projectId}/fund-list`);
  }

  saveProjectFundingDetails(data: ProjectFundingModel[]): Observable<any> {
    data.forEach((item) => {
      if (item.due_by != null) {
        item.due_by = moment(item.due_by).format('YYYY-MM-DD');
      }
    });
    return this.api.post('fund/project_fund', data);
  }

  getProjectFundingDetails(fundId: number): Observable<ProjectFundingModel> {
    return this.api.get<ProjectFundingModel>(`fund/project_fund/${fundId}`);
  }

  saveProjectFundData(data: ProjectFundingModel): Observable<any> {
    if (data.due_by != null) {
      data.due_by = moment(data.due_by).format('YYYY-MM-DD');
    }
    return this.api.put(`fund/project_fund/${data.id}`, data);
  }

  /**
   * Get project launch details for backer
   *
   * @returns project launching details
   */
  getLaunchDataForBacker(projectId: number): Observable<ProjectLaunchDetailsModel> {
    return this.api.get<ProjectLaunchDetailsModel>(`projects/${projectId}/launch-details`);
  }

  getProjectFundingTypesForBacker(projectId: number): Observable<ProjectFundTypeDetailsModel> {
    return this.api.get<ProjectFundTypeDetailsModel>(`projects/${projectId}/selected/fund-list`);
  }

  getProjectFundingTypeDetailsForBacker(projectId: number, fundId: number): Observable<ProjectFundingModel> {
    return this.api.get<ProjectFundingModel>(`projects/${projectId}/selected/fund-list/${fundId}`);
  }

  saveBackerFundingDetails(data: ProjectBackerFundingModel[]): Observable<any> {
    return this.api.post('fund/project-backer-fund', data);
  }

  saveLaunchTypePurchaseData(data: { project_launch: number, quantity: number }): Observable<any> {
    return this.api.post(`launch/project-backer-launch`, data);
  }

  projectRegistration(projectId: number, packageId: number, today: any): Observable<any> {
    today = moment(today).format('YYYY-MM-DD HH:mm:ss');
    return this.api.post(`projects/${projectId}/project-registration`, {package: packageId, registrationDate: today});
  }

  /**
   * Get available Company ROles
   *
   * @returns company roles
   */
  getCompanyRoles(): Observable<CompanyRoleModel[]> {
    return this.api.get<CompanyRoleModel[]>(`fund/company_role`);
  }

  /**
   * Get project launch funds list
   *
   * @param projectId - id of project
   * @returns projects data
   */
  getLaunchFundsList(projectId: number, startPage?, pageSize?, search?): Observable<ProjectPaginationModel> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<ProjectPaginationModel>(`projects/${projectId}/backer-launch-details`, {
        offset: offset,
        limit: pageSize,
        search: search,
      });
    }
    return this.api.get<ProjectPaginationModel>(`projects/${projectId}/backer-launch-details`);
  }

  /**
   * Get project launch funds list for backer
   *
   * @param projectId - id of project
   * @returns projects data
   */
  getBackerLaunchFundsList(projectId: number, startPage?, pageSize?, search?): Observable<ProjectPaginationModel> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<ProjectPaginationModel>(`backer-projects/${projectId}/backer-launch-details`, {
        offset: offset,
        limit: pageSize,
        search: search,
      });
    }
    return this.api.get<ProjectPaginationModel>(`backer-projects/${projectId}/backer-launch-details`);
  }

  /**
   * Get project launch funds list
   *
   * @param projectId - id of project
   * @returns projects data
   */
  getManageFundsList(projectId: number, startPage?, pageSize?, search?): Observable<ProjectPaginationModel> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<ProjectPaginationModel>(`projects/${projectId}/funds`, {offset: offset, limit: pageSize, search: search});
    }
    return this.api.get<ProjectPaginationModel>(`projects/${projectId}/funds`);
  }

  /**
   * Get project launch funds list for backer
   *
   * @param projectId - id of project
   * @returns projects data
   */
  getBackerManageFundsList(projectId: number, startPage?, pageSize?, search?): Observable<ProjectPaginationModel> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<ProjectPaginationModel>(`backer-projects/${projectId}/funds`, {offset: offset, limit: pageSize, search: search});
    }
    return this.api.get<ProjectPaginationModel>(`backer-projects/${projectId}/funds`);
  }


  /*
    Handle in memory manage funding types selection till confirm and submit
  */

  getSelectedFundToProceed(projectId: number) {
    return this.tempManageFundSelection.filter(d => d.projectId === projectId);
  }

  addSelectedFundToProceed(projectId: number, fundTypeId: number, fundTitle: string) {
    const fundTypes = this.tempManageFundSelection.filter(d => d.projectId === projectId && d.fundType.fund === fundTypeId);

    if (!fundTypes || fundTypes.length === 0) {
      const fund: ProjectFundingModel = new ProjectFundingModel();

      fund.project = projectId;
      fund.fund = fundTypeId;
      fund.fund_title = fundTitle;

      this.tempManageFundSelection.push({projectId: projectId, fundType: fund});
    }
  }

  removeSelectedFundToProceed(projectId: number, fundTypeId: number) {
    const index = this.tempManageFundSelection.findIndex(d => d.projectId === projectId && d.fundType.fund === fundTypeId);

    if (index >= 0) {
      this.tempManageFundSelection.splice(index, 1);
    }
  }

  removeAllSelectedFund(projectId: number) {
    this.tempManageFundSelection = this.tempManageFundSelection.filter(d => d.projectId !== projectId);
  }

  getBackerSelectedFundToProceed(projectId: number) {
    return this.tempBackerFundSelection.filter(d => d.projectId === projectId);
  }

  addBackerSelectedFundToProceed(projectId: number, fundId: number, fundTitle: string) {
    const fundTypes = this.tempBackerFundSelection.filter(d => d.projectId === projectId && d.fundType.fund === fundId);

    if (!fundTypes || fundTypes.length === 0) {
      const fund: ProjectBackerFundingModel = new ProjectBackerFundingModel();

      fund.fund = fundId;
      fund.fund_title = fundTitle;

      this.tempBackerFundSelection.push({projectId: projectId, fundType: fund});
    }
  }

  removeBackerSelectedFundToProceed(projectId: number, fundId: number) {
    const index = this.tempBackerFundSelection.findIndex(d => d.projectId === projectId && d.fundType.fund === fundId);

    if (index >= 0) {
      this.tempBackerFundSelection.splice(index, 1);
    }
  }

  removeAllBackerSelectedFund(projectId: number) {
    this.tempBackerFundSelection = this.tempBackerFundSelection.filter(d => d.projectId !== projectId);
  }

  /*
    End Handle in memory manage funding types selection till confirm and submit
  */

  /**
   * Get project doc Notarization response
   *
   * @param projectId - id of project
   * @returns project data with project Notarization response
   */
  getNotarizeResponse(projectId: number): Observable<any> {
    return this.api.get<any>(`projects/${projectId}/notarization-details`);
  }

  postNotarizationDoc(data: any): Observable<any> {
    return this.api.post(`notarization/notary-transaction`, data);
  }

  getNotarizationDetails(transaction_id: string): Observable<any> {
    return this.api.get<any>(`notarization/notary-transaction`, {transaction_id: transaction_id});
  }

  deleteNotarizationDoc(id: number): Observable<any> {
    return this.api.delete(`notarization/notary-transaction?id=${id}`);
  }

  /* Project Budget services */
  productList(projectId: number, startPage?, pageSize?, search?): Observable<ProjectBudgetModel> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<ProjectBudgetModel>(`projects/${projectId}/budget-list`, {offset: offset, limit: pageSize, search: search});
    }
    return this.api.get<ProjectBudgetModel>(`projects/${projectId}/budget-list`);
  }

  productListForBacker(projectId: number, startPage?, pageSize?, search?): Observable<ProjectBudgetModel> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<ProjectBudgetModel>(`backer-projects/${projectId}/budget-list`, {
        offset: offset,
        limit: pageSize,
        search: search,
      });
    }
    return this.api.get<ProjectBudgetModel>(`backer-projects/${projectId}/budget-list`);
  }

  productSearch(searchText: string): Observable<{
    numItems: number,
    totalResults: number,
    start: number,
    products: WallmartProductModel[]
  }> {
    return this.api.get<{
      numItems: number,
      totalResults: number,
      start: number,
      products: WallmartProductModel[]
    }>(`product/search/?product=${searchText}`);
  }

  companySearch(searchText: string, isticker: boolean): Observable<any> {
    let tickerText = '';
    let nameText = '';

    if (isticker) {
      tickerText = searchText;
    } else {
      nameText = searchText;
    }

    return this.api.get(`company/company_comparison_search/?name=${nameText}&ticker=${tickerText}`);
  }

  getSingleProductById(product_id: any, isUrl: boolean): Observable<{ product_features: SingleProduct[], errors?: any[] }> {
    const body = {products: [{product: product_id}], url: isUrl};
    return this.api.post(`single_product`, body);
  }

  getSingleCompanyById(permurl: any): Observable<any> {
    const body = {companies: [{permurl: permurl}]};
    return this.api.post(`company/company_search_by_permid`, body);
  }

  saveProductSelection(projectId: number, product: WallmartProductModel, isUrl: boolean): Observable<any> {
    const data = {project_id: projectId, product_id: product.product_id, qty: product.quantity, url: isUrl};
    return this.api.post(`product/product_details`, data);
  }

  deleteProduct(projectId: number, id: number) {
    return this.api.delete(`projects/${projectId}/product-budget/${id}`);
  }

  addProductManually(product: any): Observable<any> {
    const data = {name: product.name, price: product.price, qty: product.qty, shortdescription: product.shortDescription};
    console.log(`projects/${product.project}/product-budget`);
    console.log(data);
    return this.api.post(`projects/${product.project}/product-budget`, data);
  }

  /* Project Budget services End */

  putLoanCloseInfo(id: number, project: number): Observable<any> {
    const data = {id: id};
    return this.api.put(`projects/${project}/funds`, data);
  }

  /**
   * Project loan closing list
   * get
   */
  getInterestPayList(startPage?, pageSize?, search?, project?, fundId?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>(`projects/${project}/funds/${fundId}/interest-pay`, {offset: offset, limit: pageSize, search: search});
    }
    return this.api.get<any>(`projects/${project}/funds/interest-pay`);
  }

  putInterestPayInfo(id: number[], project: number, fundId: number): Observable<any> {
    const data = {id: id};
    return this.api.put(`projects/${project}/funds/${fundId}/interest-pay`, data);
  }

  /**
   * Get Backer funded projects list
   *
   * @returns list of Backer funded projects
   */
  GetBackerFundedProjectlist(startPage?, pageSize?, stage?, search?): Observable<ProjectModel[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<ProjectModel[]>('backer-projects', {offset: offset, limit: pageSize, stage: stage, search: search});
    }
    return this.api.get<ProjectModel[]>('backer-projects');
  }

  /**
   * Get Creator Payment list
   *
   * @returns list of Payment list for Creator
   */
  getPaymentlist(startPage?, pageSize?, search?, project?): Observable<ProjectModel[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<ProjectModel[]>(`projects/${project}/payment-details`, {offset: offset, limit: pageSize, search: search});
    }
    return this.api.get<ProjectModel[]>(`projects/${project}/payment-details`);
  }

  /**
   * Get Backer Payment list
   *
   * @returns list of Payment list for Backer
   */
  getBackerPaymentlist(startPage?, pageSize?, search?, project?): Observable<ProjectModel[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<ProjectModel[]>(`backer-projects/${project}/payment-details`, {offset: offset, limit: pageSize, search: search});
    }
    return this.api.get<ProjectModel[]>(`backer-projects/${project}/payment-details`);
  }

  getBackerAccessList(startPage?, pageSize?, search?, projectId?: number): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<ProjectModel[]>(`projects/${projectId}/backer-access`, {offset: offset, limit: pageSize, search: search});
    }
    return this.api.get<ProjectModel[]>(`projects/${projectId}/backer-access`);
  }

  putBackerAccess(id, chat_access, operation_access, budget_access): Observable<any> {
    return this.api.put(`backer-access-update/${id}`, {
      chat_access: chat_access,
      operation_access: operation_access,
      budget_access: budget_access,
    });
  }

  getAcessForBacker(projectId: number): Observable<any> {
    return this.api.get<any>(`backer-projects/${projectId}/access`);
  }

  notifyBackerForNewFund(projectId: number): Observable<any> {
    return this.api.post(`new-fund-raised`, {project: projectId});
  }

  getActivityLogQuestions(): Observable<any> {
    return this.api.get<any>(`standupbot-questions`);
  }

  postActivityLogQuestions(activityLog): Observable<any> {
    return this.api.post(`standupbot-answers`, activityLog);
  }

  getCanActivityLog(project): Observable<any> {
    return this.api.get(`check-activity-log`, {project: project});
  }

  getUserActivityLogs(startPage?, pageSize?, search?, project?): Observable<any> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>('project/standupbot-answers', {project: project, offset: offset, limit: pageSize, q: search});
    }
    return this.api.get(`project/standupbot-answers`, {project: project});
  }

  getAllProjectUsers(startPage?, pageSize?, search?, project?): Observable<any[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>('project-user-list', {project: project, offset: offset, limit: pageSize, q: search});
    }
    return this.api.get<any[]>(`project-user-list`, {project: project});
  }

  getActivityLogBasedOnUserId(startPage?, pageSize?, search?, project?, user?): Observable<any[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<any[]>('project/standupbot-answers', {project: project, offset: offset, limit: pageSize, user: user, q: search});
    }
    return this.api.get(`project/standupbot-answers`, {project: project, user: user});
  }

  postPaymentThumsUpDown(data): Observable<any> {
    return this.api.post(`thumbs-up-down`, data);
  }

  /**
   * Get backer Payment list
   *
   * @returns list of backer list for Creator who rated
   */
  getPaymentThumbsUp(startPage?, pageSize?, search?, project?, transaction?): Observable<ProjectModel[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<ProjectModel[]>(`projects/${project}/payment-details/${transaction}`, {
        offset: offset,
        limit: pageSize,
        search: search,
        thumbsup: true,
      });
    }
    return this.api.get<ProjectModel[]>(`projects/${project}/payment-details/${transaction}`, {thumbsup: true});
  }

  /**
   * Get backer Payment list
   *
   * @returns list of backer list for Creator who rated
   */
  getPaymentThumbsDown(startPage?, pageSize?, search?, project?, transaction?): Observable<ProjectModel[]> {
    if (pageSize) {
      const offset = (startPage - 1) * pageSize;
      return this.api.get<ProjectModel[]>(`projects/${project}/payment-details/${transaction}`, {
        offset: offset,
        limit: pageSize,
        search: search,
        thumbsup: false,
      });
    }
    return this.api.get<ProjectModel[]>(`projects/${project}/payment-details/${transaction}`, {thumbsup: false});
  }

  getLunchRoomList(project, is_public_channel): Observable<any> {
    return this.api.get<any>(`lunch-room`, {project: project, is_public_channel: is_public_channel});
  }

  getLunchRoomUserList(project): Observable<any> {
    return this.api.get<any>(`project-user-list`, {room: true, project: project});
  }

  getLunchRoomInfo(id, project): Observable<any> {
    return this.api.get<any>(`lunch-room-edit`, {id: id, project: project});
  }

  addEditLunchRoom(data): Observable<any> {
    if (data.id) {
      return this.api.put(`lunch-room-edit`, data);
    }
    return this.api.post(`lunch-room`, data);
  }

  downloadLaunch(id, project): Observable<any> {
    return this.api.getForFile<any>(`projects/${project}/project_launch/${id}/download`);
  }

  downloadManageFund(id): Observable<any> {
    return this.api.getForFile<any>(`fund/project_fund/${id}/download`);
  }

  downloadRegistrationDetails(projectId: number): Observable<any> {
    return this.api.getForFile<any>(`registration-form`, {project: projectId});
    // return this.api.postForFile('trading/balance-sheet', {id});
  }

  downloadDocusign(path: string) {
    path = path.replace('/api/v1/', '');
    return this.api.getFileAsBlob(path);
  }

  deleteProject(projectId: number) {
    return this.api.delete(`projects/${projectId}`);
  }
}
