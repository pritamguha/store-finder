import React, { Component } from "react";
import fire from "../firebase/fire";
import { Table } from "reactstrap";
import { deepClone } from "../helper-methods";

class OrdersPage extends Component {
  state = {
    orders: [],
    isLoading: true
  };

  componentDidMount() {
    const { orders } = deepClone(this.state);
    let orderRef = fire
      .database()
      .ref("orders")
      .orderByKey();
    orderRef.on("child_added", snapshot => {
      orders.push(snapshot.val());
      this.setState({ orders, isLoading: false });
    });
  }

  render() {
    const { orders, isLoading } = deepClone(this.state);
    console.log("OrdersPage -> render -> orders", orders);
    return !isLoading && orders.length ? (
      <Table>
        <thead>
          <tr>
            <th>#</th>
            <th>Order Id</th>
            <th>Store Name</th>
            <th> Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.reverse().map((order, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{order.id}</td>
              <td>{order.store.name}</td>
              <td>{order.amount}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    ) : isLoading ? (
      <h3 style={{ textAlign: "center" }}>Fetching Order List...</h3>
    ) : (
      <p>No orders found yet</p>
    );
  }
}

export default OrdersPage;
