import React, { useState } from 'react';

function Sidebar(){
    const [navigationStyle, setNavigationStyle] = useState({ width: 0});
    const [mainStyle, setMainStyle] = useState({ marginLeft: 0 });

    const closeNav = () => {
        setNavigationStyle({ width: 0 });
        setMainStyle({ marginLeft: 0 });
    }

    const openNav = () => {
        setNavigationStyle({ width: 250 });
        setMainStyle({ marginLeft: 250 });
    }


    return(
        <>
            <div id="sideNavigation" className="sidenav" style={navigationStyle}>
                <a href="javascript:void(0)" className="closebtn" onClick={() => closeNav()}>&times;</a>
                <a href="#">About</a>
                <a href="#">Features</a>
                <a href="#">Contact Us</a>
                </div>
                
                <nav className="topnav">
                <a href="javascript:void(0)" onClick={() => openNav()}>
                    <svg width="30" height="30" id="icoOpen">
                        <path d="M0,5 30,5" stroke="#000" stroke-width="5"/>
                        <path d="M0,14 30,14" stroke="#000" stroke-width="5"/>
                        <path d="M0,23 30,23" stroke="#000" stroke-width="5"/>
                    </svg>
                </a>
                </nav>
                
                <div id="main" style={mainStyle}>
            
            </div>
        </>
    );
}

export default Sidebar;