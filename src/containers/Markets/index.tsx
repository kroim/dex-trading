import classnames from 'classnames';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import {
    injectIntl,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { incrementalOrderBook } from '../../api';
// import { Decimal } from '../../components/Decimal';
import { Markets } from '../../components/Markets';
import { IntlProps } from '../../index';
import { RootState, selectUserInfo, setCurrentPrice, User } from '../../modules';
import {
    Market,
    marketsTickersFetch,
    selectCurrentMarket,
    selectMarkets,
    selectMarketsLoading,
    selectMarketTickers,
    setCurrentMarket,
    Ticker,
} from '../../modules/public/markets';
import { depthFetch } from '../../modules/public/orderBook';
import { testAction } from '../../modules/web3wallet/state/swap/actions';
// import { RecentTrades } from '../RecentTrades';

interface ReduxProps {
    userData: User;
    markets: Market[];
    marketsLoading?: boolean;
    marketTickers: {
        [key: string]: Ticker,
    };
    currentMarket: Market | undefined;
}

interface DispatchProps {
    setCurrentMarket: typeof setCurrentMarket;
    depthFetch: typeof depthFetch;
    tickers: typeof marketsTickersFetch;
    setCurrentPrice: typeof setCurrentPrice;
    
}

type Props = ReduxProps & DispatchProps & IntlProps;

class MarketsContainer extends React.Component<Props> {    
    private headers = [
        // this.props.intl.formatMessage({id: 'page.body.trade.header.markets.content.pair'}),
        // this.props.intl.formatMessage({id: 'page.body.trade.header.markets.content.price'}),
        // this.props.intl.formatMessage({id: 'page.body.trade.header.markets.content.change'}),
        'Pair', 'Balance Amount'
    ];
    constructor(p){
        super(p)        
       // this. = React.createRef()
    }
    public componentDidMount() {
        if (this.props.markets.length === 0) {
            this.props.tickers();
        }        
    }

    public render() {
        const { marketsLoading } = this.props;
        const className = classnames('pg-markets', {
            'pg-markets--loading': marketsLoading,
        });

        return (
            <div className={className}>
                {marketsLoading ? <div><Spinner animation="border" variant="primary" /></div> : this.markets()}
            </div>
        );
    }

    

    private markets = () => {
        const { currentMarket } = this.props;
        const key = currentMarket && currentMarket.name;

        return (
            <div>
            <Markets
                filters={false}
                data={this.testAssetsData()}
                rowKeyIndex={0}
                onSelect={this.handleOnSelect}
                selectedKey={key}
                headers={this.headers}
                title={this.props.intl.formatMessage({id: 'custom.openOrders.assets'})}
                filterPlaceholder={this.props.intl.formatMessage({ id: 'page.body.trade.header.markets.content.search'})}
            >                
            </Markets>            
            </div>
            
        );
    };

    // private mapMarkets() {
    //     const { markets, marketTickers } = this.props;
    //     const defaultTicker = {
    //         last: 0,
    //         price_change_percent: '+0.00%',
    //     };

    //     return markets.map((market: Market) =>
    //         ([
    //             market.name,
    //             Decimal.format(Number((marketTickers[market.id] || defaultTicker).last), market.amount_precision),
    //             (marketTickers[market.id] || defaultTicker).price_change_percent,
    //         ]),
    //     );
    // }
    private testAssetsData = () => {
        // return [[[this.props.intl.formatMessage({id: 'page.noDataToShow'})]]];
        return [['ETH', '0.5'], ['DEX', '100']];
    }

    private handleOnSelect = (index: string) => {
        const { markets, currentMarket } = this.props;
        const marketToSet = markets.find(el => el.name === index);
        this.props.setCurrentPrice(0);
        console.log("-----handleOnSelect")
        if (marketToSet && (!currentMarket || currentMarket.id !== marketToSet.id)) {
            this.props.setCurrentMarket(marketToSet);
            if (!incrementalOrderBook()) {
              this.props.depthFetch(marketToSet);
            }
        }
        // this.testFunc.current.getAlert()
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    userData: selectUserInfo(state),
    markets: selectMarkets(state),
    marketsLoading: selectMarketsLoading(state),
    marketTickers: selectMarketTickers(state),
    currentMarket: selectCurrentMarket(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        setCurrentMarket: (market: Market) => dispatch(setCurrentMarket(market)),
        depthFetch: (market: Market) => dispatch(depthFetch(market)),
        tickers: () => dispatch(marketsTickersFetch()),
        setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
        testAction: payload => dispatch(testAction(payload))
    });

export const MarketsComponent = injectIntl(connect(mapStateToProps, mapDispatchToProps)(MarketsContainer)) as any;
