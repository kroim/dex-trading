import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
// import { showLanding } from '../../api';
import { LogoIcon } from '../../assets/images/LogoIcon';
import { CloseIcon } from '../../assets/images/CloseIcon';
import { IntlProps } from '../../index';
// import { Button } from 'react-bootstrap';
// import Web3Status from '../../modules/web3wallet/components/Web3Status';
import Web3Header from '../../modules/web3wallet/components/Header/customWeb3Header';

import {
    Market,
    RootState,
    selectConfigsLoading,
    selectCurrentColorTheme,
    selectCurrentMarket,
    selectMarketSelectorState,
    selectMobileWalletUi,
    selectSidebarState,
    setMobileWalletUi,
    toggleMarketSelector,
    toggleSidebar,
} from '../../modules';
import { HeaderToolbar } from '../HeaderToolbar';

// Remove light, dark mode by kroim
// import { NavBar } from '../NavBar';

interface ReduxProps {
    currentMarket: Market | undefined;
    colorTheme: string;
    mobileWallet: string;
    sidebarOpened: boolean;
    marketSelectorOpened: boolean;
    configsLoading: boolean;
}

interface DispatchProps {
    setMobileWalletUi: typeof setMobileWalletUi;
    toggleSidebar: typeof toggleSidebar;
    toggleMarketSelector: typeof toggleMarketSelector;
}

interface LocationProps extends RouterProps {
    location: {
        pathname: string;
    };
}

const noHeaderRoutes = [
    '/confirm',
    '/404',
    '/500',
];

interface State {
    showConnectModalFlag: boolean;
}

type Props = ReduxProps & DispatchProps & IntlProps & LocationProps;

class Head extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            showConnectModalFlag: false,
        };
    }

    public render() {
        
        const { mobileWallet, location, configsLoading } = this.props;
        const tradingCls = location.pathname.includes('/trading') ? 'pg-container-trading' : '';
        const shouldRenderHeader = !noHeaderRoutes.some(r => location.pathname.includes(r)) && location.pathname !== '/';

        if (!shouldRenderHeader || configsLoading) {
            return <React.Fragment />;
        }
        const renderConnectModalBody = (
            <div className="cr-email-form__form-content">
                <div className="custom-connect-metamask">
                    
                </div>
                <div className="custom-connect-binance">
                    
                </div>
            </div>
        );
        const connectModal = this.state.showConnectModalFlag ? (
            <div className="cr-modal">
              <form className="cr-email-form" onSubmit={()=>console.log("connect wallet")}>
                <div className="pg-change-password-screen">
                  {this.renderConnectModalHeader()}
                  {renderConnectModalBody}
                </div>
              </form>
            </div>
        ) : null;

        return (
            <header className={`pg-header`}>
                <div className={`pg-container pg-header__content ${tradingCls}`}>
                    {/* Remove Sidebar by kroim */}
                    {/* <div
                        className={`pg-sidebar__toggler ${mobileWallet && 'pg-sidebar__toggler-mobile'}`}
                        onClick={this.openSidebar}
                    >
                        <span className="pg-sidebar__toggler-item"/>
                        <span className="pg-sidebar__toggler-item"/>
                        <span className="pg-sidebar__toggler-item"/>
                    </div> */}
                    {/* <div onClick={e => this.redirectToLanding()} className="pg-header__logo"> */}
                    <div className="pg-header__logo">
                        <div className="pg-logo">
                            <LogoIcon className="pg-logo__img" />
                        </div>
                    </div>
                    {this.renderMarketToggler()}
                    <div className="pg-header__location">
                        {mobileWallet ? <span>{mobileWallet}</span> : <span>{location.pathname.split('/')[1]}</span>}
                    </div>
                    {this.renderMobileWalletNav()}
                    <div className="pg-header__navbar">
                        {this.renderMarketToolbar()}
                        {/* <NavBar onLinkChange={this.closeMenu}/> */}
                    </div>
                    <div className="custom-header">
                        <Web3Header/>
                    </div>
                </div>
                {connectModal}
            </header>
        );
    }

    public renderMobileWalletNav = () => {
        const { colorTheme, mobileWallet } = this.props;
        const isLight = colorTheme === 'light' ? 'Light' : '';

        return mobileWallet && (
            <div onClick={this.backWallets} className="pg-header__toggler">
                <img alt="" src={require(`./back${isLight}.svg`)} />
            </div>
        );
    };

    public translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };

    private renderMarketToolbar = () => {
        if (!this.props.location.pathname.includes('/trading/')) {
            return null;
        }

        return <HeaderToolbar />;
    };

    private renderMarketToggler = () => {
        const { currentMarket, marketSelectorOpened, colorTheme } = this.props;
        console.log("currentMarket: ", currentMarket);
        console.log("marketSelectorOpened: ", marketSelectorOpened);
        console.log("colorTheme: ", colorTheme);
        const isLight = colorTheme === 'light';
        if (!this.props.location.pathname.includes('/trading/')) {
            return null;
        }

        return (
            <div className="pg-header__market-selector-toggle" onClick={this.props.toggleMarketSelector}>
                <p className="pg-header__market-selector-toggle-value">
                    {currentMarket && currentMarket.name}
                </p>
                {marketSelectorOpened ? (
                    <img src={require(`./arrows/arrowBottom${isLight ? 'Light' : ''}.svg`)} alt="arrow" />
                ) : (
                        <img src={require(`./arrows/arrowRight${isLight ? 'Light' : ''}.svg`)} alt="arrow" />
                    )}
            </div>
        );
    };

    private showConnectModal = () => {
        console.log("Open Connect Modal");
        this.setState({
            showConnectModalFlag: true,
        });
    };
    private closeConnectModal = () => {
        this.setState({
            showConnectModalFlag: false,
        });
    };
    private renderConnectModalHeader = () => (
        <div className="cr-email-form__options-group">
            <div className="cr-email-form__option">
                <div className="cr-email-form__option-inner">
                    <FormattedMessage id="page.body.profile.header.account.content.password.change"/>
                    <div className="cr-email-form__cros-icon" onClick={this.closeConnectModal}>
                        <CloseIcon className="close-icon" />
                    </div>
                </div>
            </div>
        </div>
    );
    
    // Remove Sidebar by kroim
    // private redirectToLanding = () => {
    //     this.props.toggleSidebar(false);
    //     this.props.history.push(`${showLanding() ? '/' : '/trading'}`);
    // };
    // private openSidebar = () => this.props.toggleSidebar(!this.props.sidebarOpened);

    private backWallets = () => this.props.setMobileWalletUi('');

    // private closeMenu = (e: any) => this.props.setMobileWalletUi('');
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    colorTheme: selectCurrentColorTheme(state),
    mobileWallet: selectMobileWalletUi(state),
    sidebarOpened: selectSidebarState(state),
    marketSelectorOpened: selectMarketSelectorState(state),
    configsLoading: selectConfigsLoading(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
        toggleSidebar: payload => dispatch(toggleSidebar(payload)),
        toggleMarketSelector: () => dispatch(toggleMarketSelector()),
    });

export const Header = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(Head) as React.ComponentClass;
