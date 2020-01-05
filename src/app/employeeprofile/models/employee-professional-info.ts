export class EmployeeProfessionalInfo {
  id: number;
  tempId: number;
  highest_qualification: SelectItem;
  highest_qualification_name?: string;
  programs: SelectItem;
  programs_name?: string;
  campus: SelectItem[];
  other_campus: string;
  // university:  SelectItem;
  university: number;
  university_name: string;
  other_university: string;
  from_date: Date;
  to_date?: Date;
  present = false;
  is_completed: boolean;
  duration: string;
}

export class ResumeDetail {
  resume?: string = null;
  file_name?: string = null;
  uploaded? = false;
}

export class ListingData {
  id: number;
  title: string;
}

export class SelectItem {
  label: string;
  value: any;
  // styleClass?: string;
  // icon?: string;
  title?: string;
  id: number;
}
