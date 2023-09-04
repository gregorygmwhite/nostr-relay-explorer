import React from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import pages from '../../config/pages';
import { useLocation } from 'react-router-dom';
import "./nav.css"

const NavBarComponent: React.FC = () => {
    const location = useLocation();

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href={pages.getHome()}>Relay Guide</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link
                            href={pages.getRelaySearch()}
                            className={location.pathname === pages.getRelaySearch() ? 'active' : ''}>Search</Nav.Link>
                        <NavDropdown title="Tools" id="basic-nav-dropdown">
                            <NavDropdown.Item
                                href={pages.getInspector()}
                                className={location.pathname === pages.getInspector() ? 'active' : ''}>Inspector</NavDropdown.Item>
                            <NavDropdown.Item
                                href={pages.getRelayLists()}
                                className={location.pathname === pages.getRelayLists() ? 'active' : ''}>Lists</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link
                            href={pages.getMyRelays()}
                            className={location.pathname === pages.getMyRelays() ? 'active' : ''}>My Relays</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBarComponent;
