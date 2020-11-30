import * as React from 'react';
import { TabPanel } from '../../components';
import { FilterPrice } from '../../filters';
// import { getAmount, getTotalPrice } from '../../helpers';
// import { Decimal, OrderForm } from '../index';
import /*SwapOrder,*/ { SwapOrderWithSwapInput } from '../../modules/web3wallet/components/SwapOrder'

/**
 * from Swap page of swapliquidity */ 

// import { useActiveWeb3React } from '../../modules/web3wallet/hooks'


export type FormType = 'buy' | 'sell';

export type DropdownElem = number | string | React.ReactNode;

export interface OrderProps {
    type: FormType;
    orderType: string | React.ReactNode;
    price: number | string;
    amount: number | string;
    available: number;
}

export type OnSubmitCallback = (order: OrderProps) => void;

export interface OrderComponentProps {
    /**
     * Amount of money in base currency wallet
     */
    availableBase: number;
    /**
     * Amount of money in quote currency wallet
     */
    availableQuote: number;
    /**
     * Callback which is called when a form is submitted
     */
    onSubmit: OnSubmitCallback;
    /**
     * If orderType is 'Market' this value will be used as price for buy tab
     */
    priceMarketBuy: number;
    /**
     * If orderType is 'Market' this value will be used as price for sell tab
     */
    priceMarketSell: number;
    /**
     * If orderType is 'Limit' this value will be used as price
     */
    priceLimit?: number;
    /**
     * Name of currency for price field
     */
    from: string;
    /**
     * Name of currency for amount field
     */
    to: string;
    /**
     * Whether order is disabled to execute
     */
    /**
     * Name of currency for price field
     */
    fromContract: string;
    /**
     * Name of currency for amount field
     */
    toContract: string;
    /**
     * Whether order is disabled to execute
     */
    disabled?: boolean;
    handleSendType?: (index: number, label: string) => void;
    /**
     * Index of tab to switch on
     */
    /**
     * Precision of amount, total, available, fee value
     */
    currentMarketAskPrecision: number;
    /**
     * Precision of price value
     */
    currentMarketBidPrecision: number;
    orderTypes?: DropdownElem[];
    orderTypesIndex?: DropdownElem[];
    /**
     *
     */
    width?: number;
    /**
     * proposals for buy
     */
    bids: string[][];
    /**
     * proposals for sell
     */
    asks: string[][];
    /**
     * start handling change price
     */
    listenInputPrice?: () => void;
    /**
     * default tab index
     */
    defaultTabIndex?: number;
    currentMarketFilters: FilterPrice[];
    translate: (id: string, value?: any) => string;
}

interface State {
    index: number;
    amountSell: string;
    amountBuy: string;
}

const defaultOrderTypes: DropdownElem[] = [
    'Limit',
    'Market',
];

const splitBorder = 449;
const defaultWidth = 635;

export class Order extends React.Component<OrderComponentProps, State> {
    public state = {
        index: 0,
        amountSell: '',
        amountBuy: '',
    };

    public componentDidMount() {
        const { defaultTabIndex } = this.props;

        if (defaultTabIndex !== undefined) {
            this.handleChangeTab(defaultTabIndex);
        }
       
    }

    public render() {
        const {
            width = defaultWidth,
        } = this.props;

        if (width < splitBorder) {
            return (
                <div className="cr-order">
                    <TabPanel
                        fixed={true}
                        panels={this.getPanels()}
                        onTabChange={this.handleChangeTab}
                        currentTabIndex={this.state.index}
                    />
                </div>
            );
        }

        return (
            <div className="cr-order cr-order--extended">
                <div className="cr-order--extended__buy">
                    <TabPanel
                        fixed={true}
                        panels={[this.getPanel('buy')]}
                        onTabChange={this.handleChangeTab}
                        currentTabIndex={this.state.index}
                    />
                </div>
                <div className="cr-order--extended__sell">
                    <TabPanel
                        fixed={true}
                        panels={[this.getPanel('sell')]}
                        onTabChange={this.handleChangeTab}
                        currentTabIndex={this.state.index}
                    />
                </div>
            </div>
        );
    }

    private swapInputAndOutputFuncRef = React.createRef<any>();

    public getPanel = (type: FormType) => {
        const {
            fromContract,
            toContract,
            from,
            to,
            orderTypes,
            orderTypesIndex,
            translate,
        } = this.props;
        const preLabel = this.isTypeSell(type) ? (
            translate('page.body.trade.header.newOrder.content.tabs.sell')
        ) : (
            translate('page.body.trade.header.newOrder.content.tabs.buy')
        );
        const label = this.isTypeSell(type) ? 'Sell' : 'Buy';
        
        return {
            content: (
                <SwapOrderWithSwapInput
                    fromToken={fromContract}
                    toToken={toContract} 
                    fromKey={from}
                    toKey={to}
                    type={type}
                    orderTypes={orderTypes || defaultOrderTypes}
                    orderTypesIndex={orderTypesIndex || defaultOrderTypes}
                    ref={this.swapInputAndOutputFuncRef}
                     />
            ),
            label: preLabel || label,
        };
    };

    private getPanels = () => {
        return [this.getPanel('buy'), this.getPanel('sell')];
    };

    private handleChangeTab = (index: number, label?: string) => {

        console.log("--", label);
        this.swapInputAndOutputFuncRef.current.swapInputAndOutput(label)
        if (this.props.handleSendType && label) {
          this.props.handleSendType(index, label);
        }

        this.setState({
            index: index,
        });
    };
    private isTypeSell = (type: string) => type === 'sell';
}

