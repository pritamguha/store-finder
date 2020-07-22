import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Form,
  FormGroup
} from "reactstrap";
import { RegexConfig } from "../config/RegexConfig";
import fire from "../firebase/fire";
import { deepClone } from "../helper-methods";
import uuid from "react-uuid";

class CreateStoreModal extends Component {
  state = {
    formFields: {
      storeName: {
        value: "",
        error: null,
        isValid: false,
        isDirty: false,
        isRequired: true
      },
      lat: {
        value: "",
        error: null,
        isValid: false,
        isDirty: false,
        isRequired: true
      },
      long: {
        value: "",
        error: null,
        isValid: false,
        isDirty: false,
        isRequired: true
      },
      storeImage: {
        value: "",
        previewBlob: null,
        isValid: false,
        error: null,
        isDirty: false,
        isRequired: true,
        uploadData: null,
        uploadUrl: ""
      }
    },
    isFormValid: false,
    isLoading: false
  };

  _validateForm = () => {
    return new Promise(resolve => {
      let { formFields } = deepClone(this.state);

      let isFormValid = true;
      Object.keys(formFields).forEach((fieldName, index) => {
        if (formFields[fieldName]["isRequired"]) {
          switch (fieldName) {
            case "storeName": {
              if (
                formFields.storeName.value &&
                formFields.storeName.value.trim().length
              ) {
                formFields.storeName.isValid = true;
              } else {
                formFields.storeName.isValid = false;
                isFormValid = false;
              }
              break;
            }

            case "lat":
            case "long": {
              if (
                formFields[fieldName].value &&
                !isNaN(formFields[fieldName].value) &&
                formFields[fieldName].value.length &&
                RegexConfig.latLong.test(
                  String(formFields[fieldName].value).toLowerCase()
                )
              ) {
                formFields[fieldName].isValid = true;
              } else {
                formFields[fieldName].isValid = false;
                isFormValid = false;
              }
              break;
            }

            default: {
              break;
            }
          }
        }
      });
      console.log("12345 :>> ", 12345);
      this.setState(
        {
          formFields,
          isFormValid
        },
        () => {
          resolve();
        }
      );
    });
  };

  _markAsDirty = fieldName => {
    let { formFields } = deepClone(this.state);
    formFields[fieldName].isDirty = true;
    this.setState({ formFields }, () => {
      this._validateForm();
    });
  };

  _updateFieldValue = (fieldName, value) => {
    const { formFields } = deepClone(this.state);

    formFields[fieldName].value = value;

    console.log("_updateFieldValue -> formFields", formFields);

    this.setState({ formFields }, () => {
      if (formFields[fieldName].isDirty) {
        this._validateForm();
      }
    });
  };

  _markAsFocused = fieldName => {
    const { formFields } = deepClone(this.state);
    formFields[fieldName].isFocused = true;
    this.setState({ formFields });
  };

  _makeAllFieldDirty = () => {
    return new Promise(resolve => {
      const { formFields } = this.state;
      Object.keys(formFields).forEach((fieldName, index) => {
        formFields[fieldName].isDirty = true;
      });
      this.setState({ formFields }, () => {
        resolve();
      });
    });
  };

  _readFile = e => {
    const { formFields } = deepClone(this.state);

    let image = null;
    if (e && e.target && e.target.files && e.target.files.length) {
      for (let i = 0; i < e.target.files.length; i++) {
        image = e.target.files[i];
        formFields["storeImage"].previewBlob = URL.createObjectURL(image);
        formFields["storeImage"].uploadData = image;
      }

      formFields["storeImage"] = { ...formFields["storeImage"], image };

      this.setState(
        {
          formFields
        },
        () => {
          if (formFields["storeImage"].isDirty) {
            this._validateForm();
          }
        }
      );
    }
  };

  _resetForm = () => {
    let { formFields } = deepClone(this.state);
    formFields = {
      storeName: {
        value: "",
        error: null,
        isValid: false,
        isDirty: false,
        isRequired: true
      },
      lat: {
        value: "",
        error: null,
        isValid: false,
        isDirty: false,
        isRequired: true
      },
      long: {
        value: "",
        error: null,
        isValid: false,
        isDirty: false,
        isRequired: true
      },
      storeImage: {
        value: "",
        previewBlob: null,
        isValid: false,
        error: null,
        isDirty: false,
        isRequired: true,
        uploadData: null,
        uploadUrl: ""
      }
    };
    this.setState({ formFields, isFormValid: false, isLoading: false });
  };

  _submitForm = async e => {
    console.log("qwertyu");

    e.preventDefault();

    this.setState({ isLoading: true }, async () => {
      await this._makeAllFieldDirty();
      await this._validateForm();

      const { formFields, isFormValid } = deepClone(this.state);

      if (isFormValid) {
        const apiData = {
          id: uuid(),
          name: formFields.storeName.value,
          lat: Number(formFields.lat.value),
          long: Number(formFields.long.value),
          image: ""
        };

        if (
          formFields.storeImage.previewBlob &&
          formFields.storeImage.uploadData
        ) {
          const storage = fire.storage();
          const name = new Date().getTime().toString();
          const uploadTask = storage
            .ref(`/images/${name}`)
            .put(formFields.storeImage.uploadData);
          uploadTask.on(
            "state_changed",
            snapShot => {
              //takes a snap shot of the process as it is happening
              console.log(snapShot);
            },
            err => {
              //catches the errors
              console.log(err);
            },
            () => {
              // gets the download url then sets the image from firebase as the value for the imgUrl key:
              storage
                .ref("images")
                .child(name)
                .getDownloadURL()
                .then(fireBaseUrl => {
                  apiData["image"] = fireBaseUrl;
                  console.log("fireBaseUrl", fireBaseUrl);
                  console.log("apiData :>> ", apiData);
                  this.props.onCreateStore(apiData);
                });
            }
          );
        } else {
          console.log("apiData :>> ", apiData);
          this.props.onCreateStore(apiData);
        }
      } else {
        this.setState({ isLoading: false });
      }
    });
  };

  render() {
    const { formFields, isLoading } = this.state;
    return (
      <div>
        <Modal
          isOpen={this.props.isOpen}
          toggle={() => this.props.closeModal("Store")}
          className={"float-right"}
          style={{ marginRight: 20, width: 400 }}
        >
          <ModalHeader>
            {" "}
            <i
              className="fa fa-fw fa-close pointer"
              style={{ fontSize: 20 }}
              onClick={() => this.props.closeModal("Store")}
            />
          </ModalHeader>
          <Form onSubmit={e => this._submitForm(e)}>
            <ModalBody>
              <FormGroup style={{ textAlign: "center" }}>
                <Label for="store" className="store-image-label">
                  {!formFields.storeImage.previewBlob && (
                    <i className="fa fa-fw fa-plus" style={{ fontSize: 30 }} />
                  )}
                  {formFields.storeImage.previewBlob && (
                    <div className="image-overlay">
                      <i
                        className="fa fa-fw fa-plus"
                        style={{ fontSize: 30, color: "#fff" }}
                      />
                    </div>
                  )}
                  {formFields.storeImage.previewBlob ? (
                    <img
                      src={formFields.storeImage.previewBlob}
                      alt="store image"
                      className="img-fluid create-store-img"
                    />
                  ) : null}
                </Label>
                <Input
                  id="store"
                  type="file"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={e => this._readFile(e)}
                />
              </FormGroup>
              <FormGroup>
                <Label>Store Name</Label>
                <Input
                  type="text"
                  value={formFields.storeName.value}
                  onChange={e =>
                    this._updateFieldValue("storeName", e.target.value)
                  }
                  onBlur={() => this._markAsDirty("storeName")}
                  onFocus={() => this._markAsFocused("storeName")}
                />
                <div className="form-error pl0">
                  {formFields.storeName.isDirty &&
                  !formFields.storeName.isValid ? (
                    <p>Enter valid long</p>
                  ) : (
                    ""
                  )}
                </div>
              </FormGroup>
              <FormGroup>
                <Label>Latitude</Label>
                <Input
                  type="text"
                  value={formFields.lat.value}
                  onChange={e => this._updateFieldValue("lat", e.target.value)}
                  onBlur={() => this._markAsDirty("lat")}
                  onFocus={() => this._markAsFocused("lat")}
                />
                <div className="form-error pl0">
                  {formFields.lat.isDirty && !formFields.lat.isValid ? (
                    <p>Enter valid long</p>
                  ) : (
                    ""
                  )}
                </div>
              </FormGroup>
              <FormGroup>
                <Label>Longitude</Label>
                <Input
                  type="text"
                  value={formFields.long.value}
                  onChange={e => this._updateFieldValue("long", e.target.value)}
                  onBlur={() => this._markAsDirty("long")}
                  onFocus={() => this._markAsFocused("long")}
                />
                <div className="form-error pl0">
                  {formFields.long.isDirty && !formFields.long.isValid ? (
                    <p>Enter valid long</p>
                  ) : (
                    ""
                  )}
                </div>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit" disabled={isLoading}>
                Submit
              </Button>{" "}
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default CreateStoreModal;
