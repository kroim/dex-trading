import classnames from 'classnames';
import * as React from 'react';
import { CellData, Table } from '../';
import { CloseIcon } from '../../assets/images/CloseIcon';
// import { useWeb3React } from '@web3-react/core';
export interface OpenOrdersProps {
    /**
     * List of open orders, takes order side ('buy' | 'sell') as last element of a row
     */
    data: CellData[][];
    /**
     * Callback that is called when cancel button of order row is clicked
     */
    onCancel: (index: number) => void;
    /**
     * List of headers for open orders table
     */
    headers?: React.ReactNode[];
    /**
     * List of headers keys for open orders table
     */
    headersKeys?: React.ReactNode[];
    /**
     * toggleByOrderType function
     */
    function?: () => void;
}


export class OpenOrders extends React.Component<OpenOrdersProps> {
    private defaultHeaders = ['Date', 'Action', 'Price', 'Amount', ''];
    private defaultHeadersKeys = ['Date', 'Action', 'Price', 'Amount', ''];
    

    componentDidMount() {
        // console.log(this.props.data);   
        // const { active } = useWeb3React();
         const { ethereum } = window as any
    if (ethereum && ethereum.on  ) {
      // console.log(ethereum)     
 
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("-----Handling 'accountsChanged' event with payload", accounts)       
      }
      ethereum.on('accountsChanged', handleAccountsChanged)
    } 
    }
    public render() {
        const { headers = this.defaultHeaders } = this.props;
        const { headersKeys = this.defaultHeadersKeys } = this.props;
        
        const tableData = this.props.data.map(this.renderRow);
        // console.log(tableData);
        const orderIndex = headersKeys.findIndex(header => header === 'Order Type');

        if (headersKeys[orderIndex] === 'Order Type'){
           headers[orderIndex] = <span onClick={this.props.function}>Order Type</span>;
        }
        
        return (
            <div className="cr-open-orders">
                <Table
                    header={headers}
                    data={tableData as CellData[][]}
                    colSpan={7}
                />
            </div>
        );
    }

    public renderCell = (rowIndex: number) => (cell: CellData, index: number, row: CellData[]) => {
        const { headersKeys = this.defaultHeadersKeys } = this.props;
        const actionIndex = headersKeys.findIndex(header => header === 'Action');
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
            case actionIndex:
                return this.renderAction(row[actionIndex] as string, row[buySellIndex] as string);
            case orderIndex:
                return this.renderOrder(row[buySellIndex] as string);
            case buySellIndex:
                return this.renderCancelButton(rowIndex);
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

    public renderRow = (row: CellData[], index: number) => {
    //  console.log("row", index,  row);
        return row.map(this.renderCell(index)); // format cells and remove first column of order side
    };

    public renderAction(actionName: string, actionType: string) {
        const action = actionType ? actionType.toLowerCase() : actionType;
        const classNames = classnames('cr-open-orders__price', {
            'cr-open-orders__price--buy': action === 'buy',
            'cr-open-orders__price--sell': action === 'sell',
        });

        return <span className={classNames}>{actionName}</span>;
    }

    public renderOrder(orderType: string) {
        // tslint:disable-next-line:no-magic-numbers
        const type = orderType ? orderType.toLowerCase().slice(0,3) : orderType;
        const classNames = classnames('cr-open-orders__order', {
            'cr-open-orders__order--buy': type === 'buy',
            'cr-open-orders__order--sell': type === 'sel',
        });

        return <span className={classNames}>{orderType}</span>;
    }

    public renderCancelButton = (index: number) => {
        return <CloseIcon onClick={this.handleCancel(index)} />;
    };

    private handleCancel = (index: number) => () => {
        this.props.onCancel(index);
    };
}
