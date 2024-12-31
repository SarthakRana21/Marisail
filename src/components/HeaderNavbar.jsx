import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import BrandIcon from "./BrandIcon";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const HeaderNavbar = ({ navbarRef }) => {
  return (
    <header ref={navbarRef}>
      <Navbar expand="lg" className="bg-body-tertiary text-uppercase">
        <Container className="text-uppercase">
          <Navbar.Brand
            as={NavLink}
            to="/"
            className="d-flex align-items-center me-auto ms-auto  mt-1"
          >
            <BrandIcon></BrandIcon>
            <h1 className="fs-4">Marisail</h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end "
          >
            <Nav className="me-0 text-uppercase">
              <NavDropdown title="boats">
                <NavDropdown.Item
                  className="text-capitalize"
                  as={NavLink}
                  to="/buy"
                >
                  buy
                </NavDropdown.Item>
                <NavDropdown.Item
                  className="text-capitalize"
                  as={NavLink}
                  to="/sell"
                >
                  sell
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="berths">
                <NavDropdown.Item
                  as={NavLink}
                  to="/berth"
                  className="text-capitalize"
                >
                  find a berth
                </NavDropdown.Item>

                <NavDropdown.Item
                  as={NavLink}
                  to="/advert-berth"
                  className="text-capitalize"
                >
                  advertise a berth
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="engines">
                <NavDropdown.Item
                  as={NavLink}
                  to="/engines"
                  className="text-capitalize"
                >
                  find an engine
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to="/advert-engines"
                  className="text-capitalize"
                >
                  advertise an engine
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="transportation">
                <NavDropdown.Item
                  as={NavLink}
                  to="/engines"
                  className="text-capitalize"
                >
                  find transportation
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to="/berth"
                  className="text-capitalize"
                >
                  request transportation
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="trailers">
                <NavDropdown.Item
                  as={NavLink}
                  to="/trailers"
                  className="text-capitalize"
                >
                  find a trailer
                </NavDropdown.Item>

                <NavDropdown.Item
                  as={NavLink}
                  to="/advert-trailers"
                  className="text-capitalize"
                >
                  advertise an trailers
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link as={NavLink} to="/chandlery">
                chandlery
              </Nav.Link>
              <NavDropdown title="services">
                <NavDropdown.Item
                  as={NavLink}
                  to="/services"
                  className="text-capitalize"
                >
                  My Engines
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to="/trailers"
                  className="text-capitalize"
                >
                  My Trailers
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="auction">
                <NavDropdown.Item
                  as={NavLink}
                  to="/auction"
                  className="text-capitalize"
                >
                  Search Auction
                </NavDropdown.Item>
                <NavDropdown.Item
                  as={NavLink}
                  to="/advert-auction"
                  className="text-capitalize"
                >
                  Advertise auction
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};
HeaderNavbar.propTypes = {
  navbarRef: PropTypes.object,
};
export default HeaderNavbar;
