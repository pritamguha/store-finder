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
import { deepClone } from "../helper-methods";
import uuid from "react-uuid";

class CreateOrderModal extends Component {
  state = {
    formFields: {
      store: {
        value: "",
        error: null,
        isValid: false,
        isDirty: false,
        isRequired: true
      },

      amount: {
        value: "",
        error: null,
        isValid: false,
        isDirty: false,
        isRequired: true
      }
    },
    isFormValid: false,
    orderId: uuid()
  };

  _validateForm = () => {
    return new Promise(resolve => {
      let { formFields } = deepClone(this.state);

      let isFormValid = true;
      Object.keys(formFields).forEach((fieldName, index) => {
        if (formFields[fieldName]["isRequired"]) {
          switch (fieldName) {
            case "store": {
              if (
                formFields.store.value &&
                formFields.store.value.trim().length
              ) {
                formFields.store.isValid = true;
              } else {
                formFields.store.isValid = false;
                isFormValid = false;
              }
              break;
            }

            case "amount": {
              if (
                formFields[fieldName].value &&
                !isNaN(formFields[fieldName].value) &&
                Number(formFields[fieldName].value.length) >= 1
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

    if (fieldName === "amount") {
      // Check if contains valid number
      if (!isNaN(Number(value))) {
        const inputParts = value.split(".");
        if (inputParts.length === 2) {
          // Has decimals
          if (inputParts[1].length > 2) {
            return;
          }
        }
      }
    }

    formFields[fieldName].value = value;

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

  _submitForm = async e => {
    e.preventDefault();

    await this._makeAllFieldDirty();
    await this._validateForm();

    const { formFields, isFormValid, orderId } = deepClone(this.state);

    if (isFormValid) {
      const selectedStore = this.props.stores.filter(
        store => formFields.store.value === store.id
      );
      const apiData = {
        id: orderId,
        store: selectedStore[0],
        amount: formFields.amount.value
      };

      this.props.onCreateOrder(apiData);
    } else {
    }
  };

  _resetForm = () => {
    let { formFields } = deepClone(this.state);
    formFields = {
      store: {
        value: "",
        error: null,
        isValid: false,
        isDirty: false,
        isRequired: true
      },

      amount: {
        value: "",
        error: null,
        isValid: false,
        isDirty: false,
        isRequired: true
      }
    };
    this.setState({ formFields, isFormValid: false });
  };

  render() {
    const { formFields, orderId } = deepClone(this.state);
    const { stores } = deepClone(this.props);

    return (
      <div>
        <Modal
          isOpen={this.props.isOpen}
          toggle={() => this.props.closeModal("Order")}
          className={"float-right"}
          style={{ marginRight: 20, width: 400 }}
        >
          <ModalHeader>
            {" "}
            <i
              className="fa fa-fw fa-close pointer"
              style={{ fontSize: 20 }}
              onClick={() => this.props.closeModal("Order")}
            />
          </ModalHeader>
          <Form onSubmit={e => this._submitForm(e)}>
            <ModalBody>
              <p className="order-id-text">order ID: {orderId}</p>
              <FormGroup>
                <Label>Select Store</Label>
                <Input
                  type="select"
                  className="create-order-modal-selct"
                  onChange={e =>
                    this._updateFieldValue("store", e.target.value)
                  }
                  value={formFields.store.value}
                  onBlur={() => this._markAsDirty("store")}
                >
                  <option value={""}>Select Store</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </Input>
                <div className="form-error pl0">
                  {formFields.store.isDirty && !formFields.store.isValid ? (
                    <p>Select one store</p>
                  ) : (
                    ""
                  )}
                </div>
              </FormGroup>
              <FormGroup>
                <Label>Amount</Label>
                <Input
                  type="text"
                  value={formFields.amount.value}
                  onChange={e =>
                    this._updateFieldValue("amount", e.target.value)
                  }
                  onBlur={() => this._markAsDirty("amount")}
                  onFocus={() => this._markAsFocused("amount")}
                />
                <div className="form-error pl0">
                  {formFields.amount.isDirty && !formFields.amount.isValid ? (
                    <p>Enter order amount</p>
                  ) : (
                    ""
                  )}
                </div>
              </FormGroup>
              {stores.length ? null : (
                <p className="create-order-note">
                  Note: Add a store first before placing your order
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit">
                Submit
              </Button>{" "}
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default CreateOrderModal;
