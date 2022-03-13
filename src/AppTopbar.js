import React  from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Button } from 'primereact/button';

export const AppTopbar = (props) => {

    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <img src={'assets/layout/images/order_logo.png'} alt="logo" style={{ width: '5rem', height:'4rem' }}/>
                <span>ORDER APPLICATION</span>
            </Link>

            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars"/>
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

                <ul className={classNames("layout-topbar-menu lg:flex origin-top", {'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                    <Button className="p-button-rounded p-button-danger" icon={"pi pi-power-off"} onClick={props.logout}/>
                </ul>
        </div>
    );
}
