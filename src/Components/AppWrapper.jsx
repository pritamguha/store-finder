import React, { Component } from "react";
import Sidebar from "./Sidebar";
import CreateOrderModal from "./CreateOrder";
import CreateStoreModal from "./CreateStore";
import { deepClone, showToast } from "../helper-methods";
import fire from "../firebase/fire";

class AppWrapper extends Component {
  state = {
    stores: [],
    showCreateOrderModal: false,
    showCreateStoreModal: false
  };
  constructor(props) {
    super(props);
    this.createOrderModalRef = React.createRef();
    this.createStoreModalRef = React.createRef();
  }

  componentDidMount() {
    let { stores } = deepClone(this.state);

    let orderRef = fire
      .database()
      .ref("stores")
      .orderByKey();
    orderRef.on("child_added", snapshot => {
      console.log(
        "StoresPage -> componentDidMount -> snapshot",
        snapshot.val()
      );
      stores.push(snapshot.val());
      this.setState({ stores });
    });
  }

  _toggleModal = (key = "Store") => {
    console.log("AppWrapper -> _toggleModal -> key", key);
    let { showCreateOrderModal, showCreateStoreModal } = deepClone(this.state);
    if (key === "Store") {
      showCreateStoreModal = !showCreateStoreModal;
      this.setState({ showCreateStoreModal }, () => {
        this.createStoreModalRef.current._resetForm();
      });
    } else {
      showCreateOrderModal = !showCreateOrderModal;
      this.setState({ showCreateOrderModal }, () => {
        this.createOrderModalRef.current._resetForm();
      });
    }
  };

  _createStore = data => {
    console.log("AppWrapper -> componentDidMount -> data", data);
    fire
      .database()
      .ref("stores")
      .push(data);
    showToast("Store created successfully", "success");

    this.setState(
      {
        showCreateStoreModal: false
      },
      () => {
        this.createStoreModalRef.current._resetForm();
      }
    );
  };

  _createOrder = data => {
    console.log("AppWrapper -> data", data);
    fire
      .database()
      .ref("orders")
      .push(data);
    showToast("Order created successfully", "success");
    this.setState(
      {
        showCreateOrderModal: false
      },
      () => {
        this.createOrderModalRef.current._resetForm();
      }
    );
  };

  render() {
    const { showCreateOrderModal, showCreateStoreModal, stores } = deepClone(
      this.state
    );

    const { location, history } = deepClone(this.props);

    return (
      <>
        <CreateOrderModal
          ref={this.createOrderModalRef}
          isOpen={showCreateOrderModal}
          closeModal={() => {
            this._toggleModal("Order");
          }}
          stores={stores}
          onCreateOrder={data => this._createOrder(data)}
        />
        <CreateStoreModal
          ref={this.createStoreModalRef}
          isOpen={showCreateStoreModal}
          onCreateStore={data => this._createStore(data)}
          closeModal={() => {
            this._toggleModal("Store");
          }}
        />
        <Sidebar
          {...this.props}
          {...location}
          {...history}
          onToggleModal={type => this._toggleModal(type)}
        />
      </>
    );
  }
}

export default AppWrapper;
