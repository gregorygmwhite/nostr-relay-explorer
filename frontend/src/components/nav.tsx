import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import pages from '../config/pages';

const NavBarComponent: React.FC = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href={pages.home}>Explorer</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link href={pages.relays.inspector}>Inspector</Nav.Link>
                        <Nav.Link href={pages.relays.list}>Relays</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBarComponent;
