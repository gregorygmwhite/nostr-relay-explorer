import {
    ReactElement,
} from "react";
import { Spinner } from "react-bootstrap";

const LoadingIndicator = (): ReactElement => {
    return (
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    )
}

export default LoadingIndicator;
