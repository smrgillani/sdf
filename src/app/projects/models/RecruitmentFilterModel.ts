export class RecruitmentFilterModel {
  id: number;
  title: string;
  is_active: boolean;
  role?: RecruitmentRole;
}

export class RecruitmentRole {
  id: number;
  title: string;
  is_active: boolean;
  expertise?: RecruitmentExpertise;
}

export class RecruitmentExpertise {
  id: number;
  title: string;
  is_active: boolean;
}