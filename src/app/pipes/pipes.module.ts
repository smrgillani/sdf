import {NgModule} from '@angular/core';
import {FilterLastPipe} from './filter-last.pipe';
import {FormatRelativeTimePipe} from './format-relative-time.pipe';
import {PaginationPipe} from './pagination.pipe';
import {SearchEmployeesPipe} from './search-employees.pipe';
import { SafeUrlPipe } from './safe-url.pipe';


@NgModule({
  exports: [
    FilterLastPipe,
    FormatRelativeTimePipe,
    PaginationPipe,
    SearchEmployeesPipe,
    SafeUrlPipe
  ],
  declarations: [
    FilterLastPipe,
    FormatRelativeTimePipe,
    PaginationPipe,
    SearchEmployeesPipe,
    SafeUrlPipe
  ]
})
export class AppPipesModule {}
