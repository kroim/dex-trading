import * as React from 'react';
import { Button } from 'react-bootstrap';
import {
    injectIntl,
} from 'react-intl';
import { Modal } from '../../components';
import { IntlProps } from '../../index';
import { Modal as MobileModal } from '../../mobile/components/Modal';
import { useState } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';

interface ModalWalletProps {
    amount: string;
    currency: string;
    onSubmit: () => void;
    onDismiss: () => void;
    rid: string;
    isMobileDevice?: boolean;
    show: boolean;
}

type Props = ModalWalletProps & IntlProps;

const WALLET_VIEWS = {
    OPTIONS: 'options',
    OPTIONS_SECONDARY: 'options_secondary',
    ACCOUNT: 'account',
    PENDING: 'pending'
}

class ModalWallet extends React.Component<Props> {
    public translate = (e: string) => {
        return this.props.intl.formatMessage({id: e});
    };
    public render() {
        const { show, isMobileDevice } = this.props;

        return isMobileDevice ?
            <MobileModal title={this.renderHeader()} onClose={this.props.onDismiss} isOpen={this.props.show}>
                <div>
                    {this.renderBody()}
                </div>
                <div>
                    {this.renderFooter()}
                </div>
            </MobileModal> : (
            <Modal
                show={show}
                header={this.renderHeader()}
                content={this.renderBody()}
                footer={this.renderFooter()}
            />
        );
    }

    private renderHeader = () => {
        return (
            <div className="pg-exchange-modal-submit-header">
                {'Connect to a wallet'}
            </div>
        );
    };

    const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT);
    const { active, account, connector, activate, error } = useWeb3React();

    private renderBody = () => {
        const { amount, currency, rid } = this.props;
        const formattedCurrency = currency.toUpperCase();
        if(walletView === WALLET_VIEWS.ACCOUNT)
            return (<div className="pg-exchange-modal-submit-body modal-body__withdraw-confirm">
                <p>
                    {this.translate('page.body.wallets.tabs.withdraw.modal.message1')}
                    {amount} {formattedCurrency}
                    {this.translate('page.body.wallets.tabs.withdraw.modal.message2')} {rid}
                </p>
            </div>);

        return (
            <div className="pg-exchange-modal-submit-body modal-body__withdraw-confirm">
                <p>
                    {this.translate('page.body.wallets.tabs.withdraw.modal.message1')}
                    {amount} {formattedCurrency}
                    {this.translate('page.body.wallets.tabs.withdraw.modal.message2')} {rid}
                </p>
            </div>
        );
    };

    private renderFooter = () => {
        return (
            <div className="pg-exchange-modal-submit-footer modal-footer__withdraw-confirm">
                <Button
                    block={true}
                    className="btn-block mr-1 mt-1 btn-lg"
                    onClick={this.props.onDismiss}
                    size="lg"
                    variant="primary"
                >
                    {this.translate('page.body.wallets.tabs.withdraw.modal.button.cancel')}
                </Button>
                <Button
                    block={true}
                    className="btn-block mr-1 mt-1 btn-lg"
                    onClick={this.props.onSubmit}
                    size="lg"
                    variant="primary"
                >
                    {this.translate('page.body.wallets.tabs.withdraw.modal.button.withdraw')}
                </Button>
            </div>
        );
    };
}

// tslint:disable-next-line
export const ModalWithdrawConfirmation = injectIntl(ModalWithdraw) as any;
