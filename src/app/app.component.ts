import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, FormArray} from "@angular/forms";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  @ViewChild('container', {static: false})
  container!: ElementRef;

  title = 'apps-food-discount';
  form!: FormGroup;
  show: any;

  result: number = 0;
  process: any = { submit: false };

  constructor(
    private formBuild: FormBuilder
  ) {
  }

  async ngOnInit() {
    this.show = {
      form: false,
      layout: null,
      final_step: false,
      result: false
    }

    await this.initForm();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  get Person() {
    return this.form.get('total_person') as FormArray;
  }

  initForm() {
    this.form = this.formBuild.group({
      total_split: new FormControl(null),
      total_person: this.formBuild.array([]),
      discount: new FormControl(),
      delivery_price: new FormControl(),
      payment: new FormControl()
    })
  }

  addForm() {
    this.process['submit'] = true;

    if (this.show['layout'] === null) {
      try {
        for (let i = 0; i < this.form.value.total_split; i++) {
          let formGroup = new FormGroup({
            name: new FormControl(''),
            paying: new FormControl(0)
          })
          this.Person.push(formGroup);
        }
      }

      finally {
        setTimeout(() => {
          this.process['submit'] = false;
          this.show['form'] = true;
          this.show['layout'] = 0;
        }, 1000)
      }
    } else {
      this.show['layout'] += 1;
      this.process['submit'] = false;
      if(this.show['layout'] === this.form.value.total_split) {
        this.show['final_step'] = true;
      }
    }
  }

  formatterCurrency(currency: number) {
    const formatter = new Intl.NumberFormat('en-ID', {
      style: 'currency',
      currency: 'IDR',
      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    return formatter.format(currency)
  }

  onSubmit() {
    this.show.result = true;
    const formValue = this.form.value;

    const priceDelivery = (formValue.delivery_price / formValue.total_split);
    const priceDiscount = (formValue.discount / formValue.total_split);

    let totalPayment: number = 0;

    this.Person.value.forEach((value: any, index: number) => {
      value.total_price = ((value.paying - priceDiscount) + priceDelivery);

      totalPayment += value.total_price;

      // result = value.total_price += value.total_price;
    })

    this.result = totalPayment + parseInt(this.form.value.payment);

  }
}
