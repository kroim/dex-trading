import classnames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
// import { HomeIcon } from '../../assets/images/footer/HomeIcon';
// import { OrderIcon } from '../../assets/images/footer/OrderIcon';
// import { ProfileIcon } from '../../assets/images/footer/ProfileIcon';
import { TradeIcon } from '../../assets/images/footer/TradeIcon';
// import { WalletIcon } from '../../assets/images/footer/WalletIcon';

const handleGetActiveItemClass = (currentRoute: string, targetRoute: string, absolute?: boolean) => {
    return classnames('pg-mobile-footer__item', {
        'pg-mobile-footer__item--active': absolute ? currentRoute === targetRoute : currentRoute.includes(targetRoute),
    });
};

const FooterComponent: React.FC = () => {
    const { pathname } = useLocation();
    const intl = useIntl();

    return (
        <div className="pg-mobile-footer">
            {/* <Link to="/" className={handleGetActiveItemClass(pathname, '/', true)}>
                <HomeIcon className="pg-mobile-footer__item__icon" />
                <span className="pg-mobile-footer__item__title">{intl.formatMessage({id: 'page.mobile.footer.home'})}</span>
            </Link>
            <Link to="/orders" className={handleGetActiveItemClass(pathname, '/orders')}>
                <OrderIcon className="pg-mobile-footer__item__icon" />
                <span className="pg-mobile-footer__item__title">{intl.formatMessage({id: 'page.mobile.footer.orders'})}</span>
            </Link> */}
            <div className="custom-header-connect-wallet-mobile">
                <Button
                    block={false}
                    className="mr-1 mt-1"
                    disabled={false}
                    // size="sm"
                    onClick={() => { console.log("Connect to a wallet ...") }}
                    variant={'outline-secondary'}
                >
                    Connect to a wallet
                </Button>
            </div>
            <div className="custom-header-settings-mobile">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M14 17a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-1a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path><path d="M5.005 16A1.003 1.003 0 0 1 4 14.992v-1.984A.998.998 0 0 1 5 12h1.252a7.87 7.87 0 0 1 .853-2.06l-.919-.925c-.356-.397-.348-1 .03-1.379l1.42-1.42a1 1 0 0 1 1.416.007l.889.882A7.96 7.96 0 0 1 12 6.253V5c0-.514.46-1 1-1h2c.557 0 1 .44 1 1v1.253a7.96 7.96 0 0 1 2.06.852l.888-.882a1 1 0 0 1 1.416-.006l1.42 1.42a.999.999 0 0 1 .029 1.377s-.4.406-.918.926a7.87 7.87 0 0 1 .853 2.06H23c.557 0 1 .447 1 1.008v1.984A.998.998 0 0 1 23 16h-1.252a7.87 7.87 0 0 1-.853 2.06l.882.888a1 1 0 0 1 .006 1.416l-1.42 1.42a1 1 0 0 1-1.415-.007l-.889-.882a7.96 7.96 0 0 1-2.059.852v1.248c0 .56-.45 1.005-1.008 1.005h-1.984A1.004 1.004 0 0 1 12 22.995v-1.248a7.96 7.96 0 0 1-2.06-.852l-.888.882a1 1 0 0 1-1.416.006l-1.42-1.42a1 1 0 0 1 .007-1.415l.882-.888A7.87 7.87 0 0 1 6.252 16H5.005zm3.378-6.193l-.227.34A6.884 6.884 0 0 0 7.14 12.6l-.082.4H5.005C5.002 13 5 13.664 5 14.992c0 .005.686.008 2.058.008l.082.4c.18.883.52 1.71 1.016 2.453l.227.34-1.45 1.46c-.004.003.466.477 1.41 1.422l1.464-1.458.34.227a6.959 6.959 0 0 0 2.454 1.016l.399.083v2.052c0 .003.664.005 1.992.005.005 0 .008-.686.008-2.057l.399-.083a6.959 6.959 0 0 0 2.454-1.016l.34-.227 1.46 1.45c.003.004.477-.466 1.422-1.41l-1.458-1.464.227-.34A6.884 6.884 0 0 0 20.86 15.4l.082-.4h2.053c.003 0 .005-.664.005-1.992 0-.005-.686-.008-2.058-.008l-.082-.4a6.884 6.884 0 0 0-1.016-2.453l-.227-.34 1.376-1.384.081-.082-1.416-1.416-1.465 1.458-.34-.227a6.959 6.959 0 0 0-2.454-1.016L15 7.057V5c0-.003-.664-.003-1.992 0-.005 0-.008.686-.008 2.057l-.399.083a6.959 6.959 0 0 0-2.454 1.016l-.34.227-1.46-1.45c-.003-.004-.477.466-1.421 1.408l1.457 1.466z"></path></g></svg>
            </div>
            <Link to="/trading" className={handleGetActiveItemClass(pathname, '/trading')}>
                <TradeIcon className="pg-mobile-footer__item__icon" />
                <span className="pg-mobile-footer__item__title">{intl.formatMessage({ id: 'page.mobile.footer.trading' })}</span>
            </Link>
            {/* <Link to="/wallets" className={handleGetActiveItemClass(pathname, '/wallets')}>
                <WalletIcon className="pg-mobile-footer__item__icon" />
                <span className="pg-mobile-footer__item__title">{intl.formatMessage({id: 'page.mobile.footer.wallets'})}</span>
            </Link>
            <Link to="/profile" className={handleGetActiveItemClass(pathname, '/profile')}>
                <ProfileIcon className="pg-mobile-footer__item__icon" />
                <span className="pg-mobile-footer__item__title">{intl.formatMessage({id: 'page.mobile.footer.profile'})}</span>
            </Link> */}
        </div>
    );
};

export const Footer = React.memo(FooterComponent);
