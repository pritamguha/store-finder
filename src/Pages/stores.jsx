import React, { Component } from "react";
import fire from "../firebase/fire";
import { deepClone } from "../helper-methods";
import { Table } from "reactstrap";

class StoresPage extends Component {
  state = {
    stores: [],
    isLoading: true
  };

  componentDidMount() {
    let { stores } = deepClone(this.state);

    let orderRef = fire
      .database()
      .ref("stores")
      .orderByKey();
    orderRef.on("child_added", snapshot => {
      stores.push(snapshot.val());
      this.setState({ stores, isLoading: false });
    });
  }

  render() {
    const { stores, isLoading } = deepClone(this.state);

    return !isLoading && stores.length ? (
      <Table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
        </thead>
        <tbody>
          {stores.reverse().map((store, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>
                {store.image && store.image.length ? (
                  <img
                    className="store-list-img"
                    src={store.image}
                    alt="store image"
                  />
                ) : null}

                {store.name}
              </td>
              <td>{store.lat}</td>
              <td>{store.long}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : isLoading ? (
      <h3 style={{ textAlign: "center" }}>Fetching store list</h3>
    ) : (
      <p>No stores added yet</p>
    );
  }
}

export default StoresPage;
