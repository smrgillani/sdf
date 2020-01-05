import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-swot-analysis',
  templateUrl: './swot-analysis.component.html',
  styleUrls: ['./swot-analysis.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwotAnalysisComponent),
      multi: true,
    },
  ],
})
export class SwotAnalysisComponent implements ControlValueAccessor {
  addStrength = false;
  addWeakness = false;
  addOpportunity = false;
  addThreats = false;
  editStrength = false;
  editWeakness = false;
  editOpportunity = false;
  editThreats = false;

  swot: { 'strength': string[], 'weakness': string[], 'opportunity': string[], 'threat': string[] } = {
    'strength': [],
    'weakness': [],
    'opportunity': [],
    'threat': [],
  };

  @Input() isSummary = false;
  @Input() isViewOnly = false;

  writeValue(value: any) {
    if (value) {
      this.swot = value;
    }
  }

  onChange = (_) => { };
  onTouched = () => { };

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  changeHeight(event, docId) {
    const input = document.getElementById(docId);
    if (input) {
      input.style.height = '0px';
      input.style.height = input.scrollHeight + 'px';
    }
  }

  updateHeight(docId) {
    const input = document.getElementById(docId);
    if (input) {
      input.style.height = '0px';
      input.style.height = input.scrollHeight + 'px';
    }
  }

  onDataChange(identifier: string, index: number, newData: string) {
    if (newData.trim().length > 0) {
      switch (identifier) {
        case 'strength':
          if (this.swot.strength.filter(item => item.toLowerCase() === newData.trim().toLowerCase()).length > 1) {
            alert('Duplicate Record');
          } else {
            this.swot.strength[index] = newData.trim();
          }
          break;
        case 'weakness':
          if (this.swot.weakness.filter(item => item.toLowerCase() === newData.trim().toLowerCase()).length > 1) {
            alert('Duplicate Record');
          } else {
            this.swot.weakness[index] = newData.trim();
          }
          break;
        case 'opportunity':
          if (this.swot.opportunity.filter(item => item.toLowerCase() === newData.trim().toLowerCase()).length > 1) {
            alert('Duplicate Record');
          } else {
            this.swot.opportunity[index] = newData.trim();
          }
          break;
        case 'threat':
          if (this.swot.threat.filter(item => item.toLowerCase() === newData.trim().toLowerCase()).length > 1) {
            alert('Duplicate Record');
          } else {
            this.swot.threat[index] = newData.trim();
          }
          break;
        default:
          break;
      }
      this.onChange(this.swot);
    }
  }

  delete(identifier: string, data: string) {
    switch (identifier) {
      case 'strength':
        this.swot.strength = this.swot.strength.filter(item => item !== data);
        break;
      case 'weakness':
        this.swot.weakness = this.swot.weakness.filter(item => item !== data);
        break;
      case 'opportunity':
        this.swot.opportunity = this.swot.opportunity.filter(item => item !== data);
        break;
      case 'threat':
        this.swot.threat = this.swot.threat.filter(item => item !== data);
        break;
      default:
        break;
    }
    this.onChange(this.swot);
  }

  save(identifier: string, val: HTMLTextAreaElement) {
    const value = val.value.trim();
    if (value.length > 0) {
      switch (identifier) {
        case 'strength':
          if (this.swot.strength.filter(item => item.toLowerCase() === value.toLowerCase()).length > 0) {
            alert('Duplicate Record');
          } else {
            this.swot.strength.push(value);
            this.addStrength = false;
          }
          break;
        case 'weakness':
          if (this.swot.weakness.filter(item => item.toLowerCase() === value.toLowerCase()).length > 0) {
            alert('Duplicate Record');
          } else {
            this.swot.weakness.push(value);
            this.addWeakness = false;
          }
          break;
        case 'opportunity':
          if (this.swot.opportunity.filter(item => item.toLowerCase() === value.toLowerCase()).length > 0) {
            alert('Duplicate Record');
          } else {
            this.swot.opportunity.push(value);
            this.addOpportunity = false;
          }
          break;
        case 'threat':
          if (this.swot.threat.filter(item => item.toLowerCase() === value.toLowerCase()).length > 0) {
            alert('Duplicate Record');
          } else {
            this.swot.threat.push(value);
            this.addThreats = false;
          }
          break;
        default:
          break;
      }
      this.onChange(this.swot);
    }
    val.value = '';
  }
}
