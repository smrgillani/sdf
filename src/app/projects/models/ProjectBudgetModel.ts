import ProjectPaginationModel from "./ProjectPaginationModel";

export default class ProjectBudgetModel
{
    id:number;
    title:string;
    subtotal:number;
    project_product_budget: ProjectPaginationModel;
}