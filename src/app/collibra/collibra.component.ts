import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Storage } from "aws-amplify";
import { summaryFileName } from "@angular/compiler/src/aot/util";

@Component({
  selector: "app-collibra",
  templateUrl: "./collibra.component.html",
  styleUrls: ["./collibra.component.css"],
})
export class CollibraComponent implements OnInit {
  public collibraForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.collibraForm = this.fb.group({
      name: ["", Validators.required],
      asuriteId: ["", Validators.required],
      communityName: ["", Validators.required],
      schemaName: ["", Validators.required],
      tableName: ["", Validators.required],
      columnName: ["", Validators.required],
      comments: ["", Validators.required],
    });
  }
  onSubmit(value: any) {
    if (value.name == "") value.name = "unnamed";
    const fileName: string =
      value.name + "_" + Math.floor(Math.random() * Math.floor(1000)) + ".txt";
    console.log(fileName);
    Storage.put(fileName, value)
      .then((result) => {
        window.alert("Request Submitted");
        console.log(result);
        this.collibraForm.reset();
      })
      .catch((err) => console.log(err));
  }
}