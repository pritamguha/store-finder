import React from "react";
import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";

const Sidebar = props => {
  const { onToggleModal } = props;

  const onNavItemClick = key => {
    console.log("key", key);

    switch (key) {
      case "home": {
        props.push("/home");
        break;
      }
      case "createStore": {
        onToggleModal("Store");
        break;
      }
      case "viewStores": {
        props.push("/stores");
        break;
      }
      case "createOrder": {
        onToggleModal("Order");
        break;
      }
      case "viewOrders": {
        props.push("/orders");
        break;
      }
      default:
        break;
    }
  };

  return (
    <>
      <SideNav>
        <SideNav.Toggle />
        <SideNav.Nav defaultSelected="home">
          <NavItem onClick={() => onNavItemClick("home")}>
            <NavIcon>
              <i className="fa fa-fw fa-home" style={{ fontSize: "1.75em" }} />
            </NavIcon>
            <NavText>Home</NavText>
          </NavItem>
          <NavItem onClick={() => onNavItemClick("createStore")}>
            <NavIcon>
              <i
                className="fa fa-fw fa-plus-square-o"
                style={{ fontSize: "1.75em" }}
              />
            </NavIcon>
            <NavText>Create Store</NavText>
          </NavItem>
          <NavItem onClick={() => onNavItemClick("viewStores")}>
            <NavIcon>
              <i className="fa fa-fw fa-bank" style={{ fontSize: "1.75em" }} />
            </NavIcon>
            <NavText>View Stores</NavText>
          </NavItem>
          <NavItem onClick={() => onNavItemClick("createOrder")}>
            <NavIcon>
              <i
                className="fa fa-fw fa-first-order"
                style={{ fontSize: "1.75em" }}
              />
            </NavIcon>
            <NavText>Create Order</NavText>
          </NavItem>
          <NavItem onClick={() => onNavItemClick("viewOrders")}>
            <NavIcon>
              <i
                className="fa fa-fw fa-list-alt"
                style={{ fontSize: "1.75em" }}
              />
            </NavIcon>
            <NavText>View Orders</NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
    </>
  );
};

export default Sidebar;
