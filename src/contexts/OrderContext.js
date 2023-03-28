import { createContext, useContext, useState } from "react";
import { DataStore } from "aws-amplify";

import { Order, User, OrderDish } from "../models";
import { useAuthContext } from "./AuthContext";

const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {
  const { dbCourier } = useAuthContext();
  const [order, setOrder] = useState();
  const [user, setUser] = useState();
  const [dishes, setDishes] = useState();

  const fetchOrder = async (id) => {
    if (!id) {
      setOrder(null);
      return;
    }
    const fetchedOrder = await DataStore.query(Order, id).then(setOrder);
    setOrder(fetchedOrder);

    DataStore.query(User, fetchedOrder.userID).then(setUser);

    DataStore.query(OrderDish, (od) => od.orderID("eq", fetchedOrder.id)).then(
      setDishes
    );
  };

  useEffect(() => {
    if (!order) {
      return;
    }

    const subscription = DataStore.observe(Order, order.id).subscribe(
      ({ opType, element }) => {
        if (opType === "UPDATE") {
          fetchOrder(element.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [order?.id]);

  const acceptOrder = async () => {
    //update the order , change the status and assign the courier
    const updatedOrder = await DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "ACCEPTED";
        updated.Courier = dbCourier;
      })
    );
    setOrder(updatedOrder);
  };

  const completeOrder = async () => {
    const updatedOrder = await DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "COMPLETED";
        updated.Courier = dbCourier;
      })
    );
    setOrder(updatedOrder);
  };
  const pickUpOrder = async () => {
    const updatedOrder = await DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "PICKED_UP";
        updated.Courier = dbCourier;
      })
    );
    setOrder(updatedOrder);
  };

  return (
    <OrderContext.Provider
      value={{
        acceptOrder,
        order,
        user,
        dishes,
        fetchOrder,
        completeOrder,
        pickUpOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

export const UseOrderContext = () => useContext(OrderContext);
