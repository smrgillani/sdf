
import FundTypeModel from "./FundTypeModel";
import ProjectFundingModel from "./ProjectFundingModel";

export default class ProjectFundTypeDetailsModel {
    id: number;
    title: string;
    is_registered:boolean;
    funds:FundTypeModel[];
    fund_details:ProjectFundingModel[];
  }