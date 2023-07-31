import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
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
                            href={pages.getInspector()}
                            className={location.pathname === pages.getInspector() ? 'active' : ''}>Inspector</Nav.Link>
                        <Nav.Link
                            href={pages.getRelaysList()}
                            className={location.pathname === pages.getRelaysList() || location.pathname == pages.getHome() ? 'active' : ''}>Relays</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBarComponent;
