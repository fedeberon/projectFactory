import React, {useState} from "react";
import { useRouter } from "next/router";
import Authentication from './Authentication';
import{ Dropdown, DropdownItem, DropdownMenu, DropdownToggle, nav} from 'reactstrap';
    export default function Menu () {
        const[dropdown, setDropdown] =useState(false);
        const[dropdownUno, setDropdownUno] =useState(false);
        const[dropdownDos, setDropdownDos] =useState(false);
    
        const openCloseDropdown=()=>{
            setDropdown (!dropdown);
        }
        const openCloseDropdownUno=()=>{
            setDropdownUno (!dropdown);
        }
        const openCloseDropdownDos=()=>{
            setDropdownDos (!dropdown);
        }
    return (
        <nav class="navbar navbar-light bg-light navbar-expand-md border border-dark">
            <button class="navbar-toggler navbar-toggler-rigth" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse d-flex justify-content-between" id="navbarTogglerDemo01">
                <div class="navbar-nav mr-auto textDark">
                    <a class="nav-item nav-link" href="#">Home</a>
                    <Dropdown isOpen={dropdown} toggle={openCloseDropdown}>
                        <DropdownToggle nav caret tag="span">
                            Professional
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>Acion 1</DropdownItem>
                            <DropdownItem>Acion 2</DropdownItem>
                            <DropdownItem>Acion 3</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown isOpen={dropdownUno} toggle={openCloseDropdownUno}>
                        <DropdownToggle nav caret tag="span">
                            Proyect
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>Acion 1</DropdownItem>
                            <DropdownItem>Acion 2</DropdownItem>
                            <DropdownItem>Acion 3</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown isOpen={dropdownDos} toggle={openCloseDropdownDos}>
                        <DropdownToggle nav caret tag="span">
                            Magazine
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>Acion 1</DropdownItem>
                            <DropdownItem>Acion 2</DropdownItem>
                            <DropdownItem>Acion 3</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                                        <a class="nav-item nav-link" href="#">About</a>
                    <a class="nav-item nav-link" href="#">Contact</a>
                </div>
                <div class="d-flex mx-3">
                    <Authentication class/>
                </div>
                
            </div>
        </nav>        
    );
}
