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
import { Table } from '../../components';
import {
    Market,
    openOrdersCancelFetch,
    ordersCancelAllFetch,
    RootState,
    selectCancelOpenOrdersFetching,
    selectCurrentMarket,
    selectOpenOrdersFetching,
    selectOpenOrdersList,
    selectUserLoggedIn,
    userOpenOrdersFetch,
} from '../../modules';
import { OrderCommon } from '../../modules/types';

interface ReduxProps {
    currentMarket: Market | undefined;
    list: OrderCommon[];
    fetching: boolean;
    cancelFetching: boolean;
    userLoggedIn: boolean;
}

interface DispatchProps {
    userOpenOrdersFetch: typeof userOpenOrdersFetch;
    openOrdersCancelFetch: typeof openOrdersCancelFetch;
    ordersCancelAll: typeof ordersCancelAllFetch;
}

type Props = ReduxProps & DispatchProps & IntlProps;

export class OpenOrdersContainer extends React.Component<Props> {

    public state = { tab: 'openOrders', index: 0, disable: false };

    public tabMapping = ['openOrders', 'orderHistory', 'tradeHistory', 'funds'];

    public componentDidMount() {
        const { currentMarket, userLoggedIn } = this.props;
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
        const tableData = [[[this.translate('page.noDataToShow')]]]
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

    private renderCustomTradeHistory = () => {
        const headers = [
            this.translate('custom.openOrders.date'),
            this.translate('custom.openOrders.pair'),
            this.translate('custom.openOrders.sell'),
            this.translate('custom.openOrders.buy'),
            this.translate('custom.openOrders.total'),
            this.translate('custom.openOrders.price'),
            this.translate('custom.openOrders.marker'),
            this.translate('custom.openOrders.txHash')
        ]
        const tableData = [[[this.translate('page.noDataToShow')]]]
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

    private renderCustomFunds = () => {
        const headers = ['Token Name', 'Balance Amount']
        const tableData = [[[this.translate('page.noDataToShow')]]]
        return (
            <div className="cr-open-orders">
                <Table
                    header={headers}
                    data={tableData}
                    colSpan={2}
                />
            </div>
        )
    }

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
            {
                content: tab === 'funds' ? this.renderCustomFunds() : null,
                label: this.props.intl.formatMessage({ id: 'custom.openOrders.funds' }),
            },
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
            'Total',
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
            this.translate('custom.openOrders.total'),
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
        const { list, currentMarket } = this.props;

        if (list.length === 0) {
            // return [[[''], [''], this.translate('page.noDataToShow')]];
            return [[[this.translate('page.noDataToShow')]]];
        }

        return list.map((item: OrderCommon) => {
            const { id, price, created_at, remaining_volume, origin_volume, side } = item;
            const executedVolume = Number(origin_volume) - Number(remaining_volume);
            const remainingAmount = Number(remaining_volume);
            const total = Number(origin_volume) * Number(price);
            const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);
            const priceFixed = currentMarket ? currentMarket.price_precision : 0;
            const amountFixed = currentMarket ? currentMarket.amount_precision : 0;

            return [
                localeDate(created_at, 'fullDate'),
                <span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(price, priceFixed)}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(remainingAmount, amountFixed)}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(total, amountFixed)}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{filled}%</span>,
                side,
            ];
        });
    };

    private translate = (e: string) => this.props.intl.formatMessage({ id: e });

    private handleCancel = (index: number) => {
        const { list } = this.props;
        const orderToDelete = list[index];
        this.props.openOrdersCancelFetch({ order: orderToDelete, list });
    };

    // private handleCancelAll = () => {
    //     const { currentMarket } = this.props;
    //     currentMarket && this.props.ordersCancelAll({ market: currentMarket.id });
    // };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    list: selectOpenOrdersList(state),
    fetching: selectOpenOrdersFetching(state),
    cancelFetching: selectCancelOpenOrdersFetching(state),
    userLoggedIn: selectUserLoggedIn(state),
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
