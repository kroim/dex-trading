import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactGA from 'react-ga';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { Router } from 'react-router';
import { gaTrackerKey } from './api';
import { ErrorWrapper } from './containers';
import { useSetMobileDevice } from './hooks';
import * as mobileTranslations from './mobile/translations';
import { selectCurrentLanguage, selectMobileDeviceState } from './modules';
import { languageMap } from './translations';

import Popups from './modules/web3wallet/components/Popups';
import ThemeProvider from './modules/web3wallet/theme';
import Web3ReactManager from './modules/web3wallet/components/Web3ReactManager';
import LocalStorageContextProvider, { Updater as LocalStorageContextUpdater } from './modules/web3wallet/limitOrder/contexts/LocalStorage'
import ApplicationContextProvider, { Updater as ApplicationContextUpdater } from './modules/web3wallet/limitOrder/contexts/Application'
import TransactionContextProvider, { Updater as TransactionContextUpdater } from './modules/web3wallet/limitOrder/contexts/Transactions'
import TokensContextProvider from './modules/web3wallet/limitOrder/contexts/Tokens';
import BalancesContextProvider from './modules/web3wallet/limitOrder/contexts/Balances'
import AllowancesContextProvider from './modules/web3wallet/limitOrder/contexts/Allowances'
import AllBalancesContextProvider from './modules/web3wallet/limitOrder/contexts/AllBalances'
import GasPricesContextProvider from './modules/web3wallet/limitOrder/contexts/GasPrice'
import MulticallUpdater from './modules/web3wallet/state/multicall/updater'

const gaKey = gaTrackerKey();
const browserHistory = createBrowserHistory();

if (gaKey) {
    ReactGA.initialize(gaKey);
    browserHistory.listen(location => {
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
    });
}

/* Mobile components */
const MobileFooter = React.lazy(() => import('./mobile/components/Footer').then(({ Footer }) => ({ default: Footer })));
const MobileHeader = React.lazy(() => import('./mobile/components/Header').then(({ Header }) => ({ default: Header })));

/* Desktop components */
const AlertsContainer = React.lazy(() => import('./containers/Alerts').then(({ Alerts }) => ({ default: Alerts })));
const CustomizationContainer = React.lazy(() => import('./containers/Customization').then(({ Customization }) => ({ default: Customization })));
// const FooterContainer = React.lazy(() => import('./containers/Footer').then(({ Footer }) => ({ default: Footer })));
const HeaderContainer = React.lazy(() => import('./containers/Header').then(({ Header }) => ({ default: Header })));
const SidebarContainer = React.lazy(() => import('./containers/Sidebar').then(({ Sidebar }) => ({ default: Sidebar })));
const LayoutContainer = React.lazy(() => import('./routes').then(({ Layout }) => ({ default: Layout })));

const getTranslations = (lang: string, isMobileDevice: boolean) => {
    if (isMobileDevice) {
        return {
            ...languageMap[lang],
            ...mobileTranslations[lang],
        };
    }

    return languageMap[lang];
};

const RenderDeviceContainers = () => {
    const isMobileDevice = useSelector(selectMobileDeviceState);

    if (isMobileDevice) {
        return (
            <div className="pg-mobile-app">
                <MobileHeader />
                <LayoutContainer />
                <MobileFooter />
            </div>
        );
    }

    return (
        <React.Fragment>
            <HeaderContainer />
            <SidebarContainer />
            <CustomizationContainer />
            <AlertsContainer />
            <LayoutContainer />
            {/* <FooterContainer /> */}
        </React.Fragment>
    );
};

function ContextProviders({ children }) {
    return (
        <LocalStorageContextProvider>
            <ApplicationContextProvider>
                <TransactionContextProvider>
                    <TokensContextProvider>
                        <BalancesContextProvider>
                            <AllBalancesContextProvider>
                                <AllowancesContextProvider>
                                    <GasPricesContextProvider>
                                        {children}
                                    </GasPricesContextProvider>
                                </AllowancesContextProvider>
                            </AllBalancesContextProvider>
                        </BalancesContextProvider>
                    </TokensContextProvider>
                </TransactionContextProvider>
            </ApplicationContextProvider>
        </LocalStorageContextProvider>
    )
}
function Updaters() {
    return (
        <>
            <LocalStorageContextUpdater />
            <ApplicationContextUpdater />
            <TransactionContextUpdater />
            <MulticallUpdater />
        </>
    )
}
export const App = () => {
    useSetMobileDevice();
    const lang = useSelector(selectCurrentLanguage);
    const isMobileDevice = useSelector(selectMobileDeviceState);

    return (
        <IntlProvider locale={lang} messages={getTranslations(lang, isMobileDevice)} key={lang}>
            <Web3ReactManager>
                <Router history={browserHistory}>
                    <ErrorWrapper>
                        <React.Suspense fallback={null}>
                            <ThemeProvider>
                                <ContextProviders>
                                    <Updaters />
                                    <Popups />
                                    <RenderDeviceContainers />
                                </ContextProviders>
                            </ThemeProvider>
                        </React.Suspense>
                    </ErrorWrapper>
                </Router>
            </Web3ReactManager>
        </IntlProvider>
    );
};
