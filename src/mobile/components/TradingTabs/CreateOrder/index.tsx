import * as React from 'react';
import { useSelector } from 'react-redux';
// import { OrderBook, OrderComponent } from '../../../../containers';
import { OrderComponent } from '../../../../containers';
import { selectUserLoggedIn } from '../../../../modules';
import { OpenOrders } from '../../index';

const CreateOrderComponent = props => {
    const userLoggedIn = useSelector(selectUserLoggedIn);
    console.log("---", userLoggedIn);
    return (
        <div className="pg-mobile-create-order">
            <div className="pg-mobile-create-order__row-double">
                {/* <OrderBook /> */}
                <OrderComponent defaultTabIndex={props.currentOrderTypeIndex} />
            </div>
            {/* {userLoggedIn ? <OpenOrders /> : null} */}
            { <OpenOrders />}
        </div>
    );
};

export const CreateOrder = React.memo(CreateOrderComponent);
