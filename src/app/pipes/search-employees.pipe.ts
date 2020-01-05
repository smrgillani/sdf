import {Pipe, PipeTransform} from '@angular/core';


/**
 * Search employees by name.
 *
 * Usage:
 *   {{employeesList | searchEmployee:'text'}}
 */
@Pipe({
  name: 'searchEmployees'
})
export class SearchEmployeesPipe implements PipeTransform {
  searchText = '';
  assignedUsers;

  checkList(employeer) {
    const namePattern = employeer.first_name + ' ' + employeer.last_name;
    if (namePattern.toLowerCase().match(this.searchText.toLowerCase())) {
      return employeer;
    }
  }

  checkForRepeatedUsers(employeer) {
    for (let i = 0; i < this.assignedUsers.length; i++) {
      if (employeer.user_id === this.assignedUsers[i].user_id) {
        return;
      }
    }
    return employeer;
  }

  transform(employeesList, text: string, assignedUsers) {
    if (employeesList) {
      this.assignedUsers = assignedUsers;

      if (this.assignedUsers) {
        employeesList = employeesList.filter(this.checkForRepeatedUsers, this);
      }

      if (text) {
        this.searchText = text;
        return employeesList.filter(this.checkList, this);
      }
      return employeesList;
    }
  }
}

