import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from '../employee.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.css'],
})
export class EmpAddEditComponent implements OnInit {
  empForm: FormGroup;
  dataSource: MatTableDataSource<any>;

  constructor(
    private _fb: FormBuilder,
    private _empService: EmployeeService,
    private _dialogRef: MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.empForm = this._fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      status: ['', Validators.required],
    });

    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit(): void {
    this.empForm.patchValue(this.data);
  }

  onFormSubmit() {
    if (this.empForm.valid) {
      if(this.data) {
        const formData = this.empForm.value;

        this._empService.updateEmployee(this.data.id,formData).subscribe(
          (response: any) => {
            // Handle the successful response from the API
            console.log('Employee detail updated!', response);
  
            // Fetch the updated list of users from the API
            this._empService.getEmployeeList().subscribe(
              (users: any[]) => {
                // Update the table data source with the new list of users
                this.dataSource.data = users;
  
                // Close the dialog
                this._dialogRef.close(true);
              },
              (error: any) => {
                // Handle the error response from the API
                console.error('Failed to fetch users:', error);
              }
            );
          },
          (error: any) => {
            // Handle the error response from the API
            console.error('Failed to add user:', error);
          }
        );
      }else{
        const formData = this.empForm.value;

      this._empService.addEmployee(formData).subscribe(
        (response: any) => {
          // Handle the successful response from the API
          console.log('User added successfully:', response);

          // Fetch the updated list of users from the API
          this._empService.getEmployeeList().subscribe(
            (users: any[]) => {
              // Update the table data source with the new list of users
              this.dataSource.data = users;

              // Close the dialog
              this._dialogRef.close(true);
            },
            (error: any) => {
              // Handle the error response from the API
              console.error('Failed to fetch users:', error);
            }
          );
        },
        (error: any) => {
          // Handle the error response from the API
          console.error('Failed to add user:', error);
        }
      );
      }
      
  }
}
}