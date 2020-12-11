// import classnames from 'classnames';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
// import { FormattedMessage, injectIntl } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
// import { CloseIcon } from '../../assets/images/CloseIcon';
import { OpenOrders, TabPanel } from '../../components';
import { localeDate, preciseData, setTradeColor } from '../../helpers';
import { IntlProps } from '../../index';
import { Table,CellData } from '../../components';
import {
    Market,
    openOrdersCancelFetch,
    ordersCancelAllFetch,
    RootState,
    selectCancelOpenOrdersFetching,
    selectCurrentMarket,
    selectMarkets,
    selectOpenOrdersFetching,
    selectOpenOrdersList,
    selectOrdersHistory,
    selectUserLoggedIn,
    userOpenOrdersFetch,
    // selectMarkets
} from '../../modules';
import classnames from 'classnames';
import { OrderCommon } from '../../modules/types';
// import {  useSelector } from 'react-redux';
import { getEtherscanLink } from '../../modules/web3wallet/utils';

// import * as actions from '../../modules/user/openOrders/actions';
// import {    
//     rangerUserOrderUpdate,    
// } from '../../modules/public/ranger/actions';
// import {
//     convertOrderEvent,
//     insertOrUpdate,
// } from '../../modules/user/openOrders/helpers';
// import {  OrderEvent}  from '../../modules/types';

// import {
//     initialOpenOrdersState,
//     openOrdersReducer,
//     // OpenOrdersState,
// } from '../../modules/user/openOrders/reducer';

interface ReduxProps {
    currentMarket: Market | undefined;
    list: OrderCommon[];    
    historyList: OrderCommon[];    
    fetching: boolean;
    cancelFetching: boolean;
    userLoggedIn: boolean;
    marketList : Market[] | undefined;
}

interface DispatchProps {
    userOpenOrdersFetch: typeof userOpenOrdersFetch;
    openOrdersCancelFetch: typeof openOrdersCancelFetch;
    ordersCancelAll: typeof ordersCancelAllFetch;
}

type Props = ReduxProps & DispatchProps & IntlProps;



export class OpenOrdersContainer extends React.Component<Props> {

    public state = { tab: 'openOrders', index: 0, disable: false };

    public tabMapping = ['openOrders', 'orderHistory', 'tradeHistory'/*, 'funds'*/];
    // markets = useSelector(selectMarkets);
    // console.log("----")
    public componentDidMount() {
        const { currentMarket, userLoggedIn, marketList } = this.props;
        console.log(marketList);
        if (userLoggedIn && currentMarket) {
            this.props.userOpenOrdersFetch({ market: currentMarket });
        }        
        
    }

    public componentWillReceiveProps(next: Props) {
        const { userLoggedIn, currentMarket } = next;
        const { userLoggedIn: prevUserLoggedIn, currentMarket: prevCurrentMarket } = this.props;        

        if (!prevUserLoggedIn && userLoggedIn && currentMarket) {
            this.props.userOpenOrdersFetch({ market: currentMarket });
        } else if (userLoggedIn && currentMarket && prevCurrentMarket !== currentMarket) {
            this.props.userOpenOrdersFetch({ market: currentMarket });
        }
        // const {historyList} = this.props;
        // console.log(historyList);
    }

    public render() {
        // const { list, fetching } = this.props;
        // const classNames = classnames('pg-open-orders', {
        //     'pg-open-orders--empty': !list.length,
        //     'pg-open-orders--loading': fetching,
        // });

        return (
            <div className="custom-open-header-tab-container">
                <TabPanel
                    fixed={true}
                    panels={this.renderTabs()}
                    onTabChange={this.handleChangeTab}
                    currentTabIndex={this.state.index}
                    //Style={overflow:"scroll"}                    
                />
            </div>
        );
    }

    private renderCustomOrder = () => {
        const { fetching } = this.props;
        return (
            <div>
                {/* <div className="cr-table-header__content">
                    <div className="cr-title-component">
                        <FormattedMessage id="page.body.trade.header.openOrders" />
                        <span className="cr-table-header__cancel" onClick={this.handleCancelAll}>
                            <FormattedMessage id="page.body.openOrders.header.button.cancelAll" />
                            <CloseIcon className="cr-table-header__close" />
                        </span>
                    </div>
                </div> */}
                {fetching ? <div className="open-order-loading"><Spinner animation="border" variant="primary" /></div> : this.openOrders()}
            </div>
        )
    }

    private renderCustomOrderHistory = () => {
        
        const headers = [
            this.translate('custom.openOrders.type'),
            this.translate('custom.openOrders.date'),
            this.translate('custom.openOrders.pair'),
            this.translate('custom.openOrders.sell'),
            this.translate('custom.openOrders.buy'),
            this.translate('custom.openOrders.total'),
            this.translate('custom.openOrders.price'),
            this.translate('custom.openOrders.txHash')
        ]
        // const tableData = [[[this.translate('page.noDataToShow')]]]
         const tableData = this.renderOrderHistoryData()
        // const {historyList} = this.props;
        // const tableData = this.props.data.map(this.renderRow);

        return (
            <div>
                <div className="cr-open-orders">
                    <Table
                        header={headers}
                        data={tableData}
                        colSpan={8}
                    />
                </div>
            </div>            
        )
    }

    public renderHistoryCell = (rowIndex: number) => (cell: CellData, index: number, row: CellData[]) => {  
        const headersKeys = [
            this.translate('custom.openOrders.type'),
            this.translate('custom.openOrders.date'),
            this.translate('custom.openOrders.pair'),
            this.translate('custom.openOrders.sell'),
            this.translate('custom.openOrders.buy'),
            this.translate('custom.openOrders.total'),
            this.translate('custom.openOrders.price'),
            this.translate('custom.openOrders.txHash')
        ]           
        const orderIndex = headersKeys.findIndex(header => header === 'Order Type');
        const buySellIndex = headersKeys.findIndex(header => header === 'Cancel');
        const priceIndex = headersKeys.findIndex(header => header === "Price");
        const buyIndex = headersKeys.findIndex(header => header === "Buy");
        const sellIndex = headersKeys.findIndex(header => header === "Sell");
        const pairIndex = headersKeys.findIndex(header => header === "Pair");
        const amountIndex = headersKeys.findIndex(header => header === "Amount");

        const oldPriceIndex = 1;
        const oldPairIndex = 6;
        // console.log(row);
        // console.log(pairIndex);
        // console.log(actionI)        
        const oldVoulmeIndex = 2;
        const oldOrderTypeIndex = 5;
        const oldAmountIndex =  3;       
        switch (index) {          
            case orderIndex:
                return this.renderOrder(row[buySellIndex] as string); 
            case priceIndex:
                return row[oldPriceIndex] as string;
            case buyIndex:
                if(row[oldOrderTypeIndex] as string ==="buy")
                    return row[oldVoulmeIndex] as string;
                else
                    return "0";
            case sellIndex:
                if(row[oldOrderTypeIndex] as string ==="sell")
                    return row[oldVoulmeIndex] as string;
                else
                    return "0";
            case pairIndex:
                return row[oldPairIndex] as string;            
            case amountIndex:
                return row[oldAmountIndex] as string;                

            default:
                return cell;
        }
    };

    public renderHistoryRow = (row: CellData[], index: number) => {
    //  console.log("row", index,  row);
        return row.map(this.renderHistoryCell(index)); // format cells and remove first column of order side
    };

    public renderOrder(orderType: string) {
        // tslint:disable-next-line:no-magic-numbers
        const type = orderType ? orderType.toLowerCase().slice(0,3) : orderType;
        const classNames = classnames('cr-open-orders__order', {
            'cr-open-orders__order--buy': type === 'buy',
            'cr-open-orders__order--sell': type === 'sel',
        });

        return <span className={classNames}>{orderType}</span>;
    }

    private renderCustomTradeHistory = () => {
        const headers = [
            this.translate('custom.openOrders.type'),
            this.translate('custom.openOrders.date'),
            this.translate('custom.openOrders.pair'),
            this.translate('custom.openOrders.sell'),
            this.translate('custom.openOrders.buy'),
            this.translate('custom.openOrders.total'),
            this.translate('custom.openOrders.price'),
            this.translate('custom.openOrders.marker'),
            this.translate('custom.openOrders.txHash')
        ]        
        
        const tableData = this.renderTradeHistoryData();  //[[[this.translate('page.noDataToShow')]]]

        return (
            <div className="cr-open-orders">
                <Table
                    header={headers}
                    data={tableData}
                    colSpan={8}
                />
            </div>
        )
    }

    // private renderCustomFunds = () => {
    //     const headers = ['Token Name', 'Balance Amount']
    //     const tableData = [[[this.translate('page.noDataToShow')]]]
    //     return (
    //         <div className="cr-open-orders">
    //             <Table
    //                 header={headers}
    //                 data={tableData}
    //                 colSpan={2}
    //             />
    //         </div>
    //     )
    // }

    private renderTabs = () => {
        const { tab, index } = this.state;

        return [
            {
                content: tab === 'openOrders' && index === 0 ? this.renderCustomOrder() : null,
                label: this.props.intl.formatMessage({ id: 'custom.openOrders.openOrders' }),
            },
            {
                content: tab === 'orderHistory' ? this.renderCustomOrderHistory() : null,
                label: this.props.intl.formatMessage({ id: 'custom.openOrders.orderHistory' }),
            },
            {
                content: tab === 'tradeHistory' ? this.renderCustomTradeHistory() : null,
                label: this.props.intl.formatMessage({ id: 'custom.openOrders.tradeHistory' }),
            },
            // {
            //     content: tab === 'funds' ? this.renderCustomFunds() : null,
            //     label: this.props.intl.formatMessage({ id: 'custom.openOrders.funds' }),
            // },
        ];
    };

    private handleChangeTab = (index: number) => {
        if (this.state.tab === this.tabMapping[index]) {
            return;
        }

        this.setState({
            tab: this.tabMapping[index],
            index: index,
        });
    };

    private renderHeadersKeys = () => {
        return [
            'Date',
            'Pair',
            'Sell',
            'Buy',
            'Amount',
            'Price',
            'Cancel'
        ];
    };

    private renderHeaders = () => {
        return [
            this.translate('custom.openOrders.date'),
            this.translate('custom.openOrders.pair'),
            this.translate('custom.openOrders.sell'),
            this.translate('custom.openOrders.buy'),
            this.translate('custom.openOrders.amount'),
            this.translate('custom.openOrders.price'),
            this.translate('custom.openOrders.cancel')
        ];
    };

    private openOrders = () => {
        return (
            <OpenOrders
                headersKeys={this.renderHeadersKeys()}
                headers={this.renderHeaders()}
                data={this.renderData()}
                onCancel={this.handleCancel}
            />
        );
    };

    private renderData = () => {
        const { list, currentMarket, marketList } = this.props;

        if (list.length === 0) {
            // return [[[''], [''], this.translate('page.noDataToShow')]];
            return [[[this.translate('page.noDataToShow')]]];
        }
        // console.log("---list", list);
        return list.map((item: OrderCommon) => {
            const { id, price, remaining_volume, origin_volume, side, market, updated_at } = item;
            const executedVolume = Number(origin_volume) - Number(remaining_volume);
            const remainingAmount = Number(remaining_volume);
            const total = Number(origin_volume) * Number(price)//:Number(origin_volume) / Number(price);
            const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);
            const priceFixed = currentMarket ? currentMarket.price_precision : 0;
            const amountFixed = currentMarket ? currentMarket.amount_precision : 0;                        
            // console.log();
            return [
                localeDate(updated_at, 'fullDate'),
                <span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(price, priceFixed)}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(remainingAmount, amountFixed)}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(total, amountFixed)}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{filled}%</span>,
                side,
                marketList.find(x=>x.id === market).name
            ];
        });
    };

    private renderOrderHistoryData = () => {
        const { historyList, currentMarket, marketList } = this.props;

        if (!historyList ||  historyList.length <1 ) {            
            return [[[this.translate('page.noDataToShow')]]];
        }
        const historyListArray = historyList.sort((a,b) => Number(b.updated_at)-Number(a.updated_at));;//.filter(x=>x.state!=="wait");
        // console.log("---list", historyList);
        
        return historyListArray.map((item: OrderCommon) => {
            const { id, price,  origin_volume, side, market, updated_at,tx_hash,state,ord_type } = item;
            // const executedVolume = Number(origin_volume) - Number(remaining_volume);
            // const remainingAmount = Number(remaining_volume);
            const explorerLink = tx_hash ? getEtherscanLink(56, tx_hash, 'transaction') : undefined
            const total = Number(origin_volume) * Number(price);            
            // const total = side==="buy"? Number(origin_volume) / Number(price):Number(origin_volume) * Number(price);            
            // const total = origin_volume;            
            // const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);
            const priceFixed = currentMarket ? currentMarket.price_precision : 0;
            const amountFixed = currentMarket ? currentMarket.amount_precision : 0;                        
            const mapStateText = { "cancel" : "Cancelled", "wait" : "Open", "done" :"Executed" };
            // if(state==="wait") return undefined;
            const stateText = mapStateText[state];
            // console.log();
            return [
            <span style={{ color: setTradeColor(side).color }}>{ord_type} {side}</span>,
                localeDate(updated_at, 'fullDate'),
                marketList.find(x=>x.id === market).name,                                
                side==="sell"?<span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(origin_volume, amountFixed)}</span>:"0",                                
                side==="buy"?<span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(origin_volume, amountFixed)}</span>:"0",                                
                <span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(total, amountFixed)}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(price, priceFixed)}</span>,
                <a rel="noopener noreferrer" target="_blank" href={explorerLink} className="order-link">
                    {stateText}
                </a>
            ];
        });
    };

    private renderTradeHistoryData = () => {
        const { historyList, currentMarket, marketList } = this.props;

        if (!historyList ||  historyList.length <1 ) {            
            return [[[this.translate('page.noDataToShow')]]];
        }
        const historyListArray = historyList.filter(x=>x.state=="done").sort((a,b) => Number(b.updated_at)-Number(a.updated_at));
        // console.log("---list", historyList);
        
        return historyListArray.map((item: OrderCommon) => {
            const { id, price,  origin_volume, side, market, updated_at,tx_hash,state,ord_type } = item;
            // const executedVolume = Number(origin_volume) - Number(remaining_volume);
            // const remainingAmount = Number(remaining_volume);
            const explorerLink = tx_hash ? getEtherscanLink(56, tx_hash, 'transaction') : undefined
            const total = Number(origin_volume) * Number(price);            
            // const total = side==="buy"? Number(origin_volume) / Number(price):Number(origin_volume) * Number(price);            
            // const total = origin_volume;            
            // const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);
            const priceFixed = currentMarket ? currentMarket.price_precision : 0;
            const amountFixed = currentMarket ? currentMarket.amount_precision : 0;                        
            const mapStateText = { "cancel" : "Cancelled", "wait" : "Open", "done" :"Executed" };
            // if(state==="wait") return undefined;
            const stateText = mapStateText[state];
            // console.log();
            return [
            <span style={{ color: setTradeColor(side).color }}>{ord_type} {side}</span>,
                localeDate(updated_at, 'fullDate'),
                marketList.find(x=>x.id === market).name,                                
                side==="sell"?<span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(origin_volume, amountFixed)}</span>:"0",                                
                side==="buy"?<span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(origin_volume, amountFixed)}</span>:"0",                                
                <span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(total, amountFixed)}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(price, priceFixed)}</span>,
                '',
                <a rel="noopener noreferrer" target="_blank" href={explorerLink} className="order-link">
                    {stateText}
                </a>
            ];
        });
    };

    private translate = (e: string) => this.props.intl.formatMessage({ id: e });

    private handleCancel = (index: number) => {
        const { list } = this.props;
        const orderToDelete = list[index];
        console.log("----delete order", orderToDelete);
        
        // this.props.openOrdersCancelFetch({ order: orderToDelete, list });
    };

    // private handleCancelAll = () => {
    //     const { currentMarket } = this.props;
    //     currentMarket && this.props.ordersCancelAll({ market: currentMarket.id });
    // };
}

// const openOrdersData: OrderCommon[] = [
//     {
//         id: "131",
//         side: 'sell',
//         price: '104.4313',
//         created_at: '2019-01-31T21:14:04+01:00',
//         remaining_volume: '0',
//         origin_volume: '10',
//         executed_volume: '10',
//         state: 'wait',
//         market: 'ethusd',
//     },
// ];
// console.log(openOrdersData);

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    list: selectOpenOrdersList(state),
    historyList: selectOrdersHistory(state),
    // list: openOrdersData,
    fetching: selectOpenOrdersFetching(state),
    cancelFetching: selectCancelOpenOrdersFetching(state),
    userLoggedIn: selectUserLoggedIn(state),
    marketList : selectMarkets(state)
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    userOpenOrdersFetch: payload => dispatch(userOpenOrdersFetch(payload)),
    openOrdersCancelFetch: payload => dispatch(openOrdersCancelFetch(payload)),
    ordersCancelAll: payload => dispatch(ordersCancelAllFetch(payload)),
});

export type OpenOrdersProps = ReduxProps;

export const OpenOrdersComponent = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(OpenOrdersContainer),
) as React.FunctionComponent;
