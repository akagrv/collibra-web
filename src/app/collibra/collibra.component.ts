import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Storage } from "aws-amplify";
import { AlertService } from "../_alert";
import axios from "axios";
import { dropdownConfig } from "./constants";

@Component({
  selector: "app-collibra",
  templateUrl: "./collibra.component.html",
  styleUrls: ["./collibra.component.css"],
})
export class CollibraComponent implements OnInit {
  public collibraForm: FormGroup;
  private submitted: boolean = false;
  private assetTypes = ["Schema", "Table", "Column"];
  private dropdownConfig: object = dropdownConfig;
  private communityDropdownOptions: any;
  private domainDropdownOptions: any;
  private IMPORT_URL: string =
    "https://asu-dev.collibra.com/rest/2.0/import/json-job";
  private DOMAIN_URL: string = "https://asu-dev.collibra.com/rest/2.0/domains";
  private COMMUNITY_URL: string =
    "https://asu-dev.collibra.com/rest/2.0/communities";

  constructor(private fb: FormBuilder, private alerts: AlertService) {}

  ngOnInit() {
    this.initForm();
    axios
      .get(this.COMMUNITY_URL, {
        auth: {
          username: "CollibraDevID",
          password: "c%R<U{,y!;45%[E8",
        },
      })
      .then((res) => {
        this.communityDropdownOptions = res.data.results;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  initForm() {
    this.collibraForm = this.fb.group({
      //name: ["", Validators.required],
      asuriteId: ["", Validators.required],
      communityName: ["", Validators.required],
      domainName: ["", Validators.required],
      assetType: [this.assetTypes[2], Validators.required],
      assetName: ["", Validators.required],
      comment: ["", Validators.required],
    });
  }

  get form() {
    return this.collibraForm.controls;
  }

  getDomainList(selected: any) {
    axios
      .get(this.DOMAIN_URL, {
        params: {
          communityId: selected.value.id,
        },
        auth: {
          username: "CollibraDevID",
          password: "c%R<U{,y!;45%[E8",
        },
      })
      .then((res) => {
        this.domainDropdownOptions = res.data.results;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onSubmit(value: any) {
    this.submitted = true;
    if (this.collibraForm.invalid) return;

    /* const fileName: string =
      value.name + "_" + Math.floor(Math.random() * Math.floor(1000)) + ".txt";
    console.log(fileName);
    Storage.put(fileName, value)
      .then((result) => {
        this.alerts.success("Request Submitted!", { autoClose: true });
        console.log(result);
        this.collibraForm.reset();
      })
      .catch((err) => {
        this.alerts.error(JSON.stringify(err), { autoClose: true });
        console.log(err);
      }); */
    let file: File;
    file = this.getJSONTemplate(
      value.communityName.name,
      value.domainName.name,
      value.assetType,
      value.assetName,
      value.comment
    );

    const formData = new FormData();
    formData.append("file", file);
    axios
      .post(this.IMPORT_URL, formData, {
        auth: {
          username: "CollibraDevID",
          password: "c%R<U{,y!;45%[E8",
        },
      })
      .then((res) => {
        console.log(res);
        this.alerts.success("Success!", { autoClose: true });
        this.collibraForm.reset();
        this.submitted = false;
      })
      .catch((err) => {
        this.alerts.error(JSON.stringify(err), { autoClose: true });
        console.log(err);
      });
  }

  getJSONTemplate(
    communityName: string,
    domainName: string,
    assetType: string,
    assetName: string,
    comment: string
  ): File {
    let jsonObj: object = {
      resourceType: "Asset",
      identifier: {
        name: assetName,
        domain: {
          name: domainName,
          community: {
            name: communityName,
          },
        },
      },
      attributes: {
        Note: [{ value: comment }],
      },
      type: {
        name: assetType,
      },
    };

    console.log(JSON.stringify(jsonObj));
    let file = new File([JSON.stringify(jsonObj)], "collibra_template.json");

    return file;
  }
}
