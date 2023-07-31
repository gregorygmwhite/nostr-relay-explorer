import {
    ReactElement,
} from "react";

const StatusIndicator = (
    { status }: { status: "active" | "inactive" | "unknown" }
): ReactElement => {

    let color = "gray";
    if (status === "active") {
        color = "green";
    } else if (status === "inactive") {
        color = "red";
    }

    return (
        <div
            style={{
                width: "1rem",
                height: "1rem",
                border: `0.2rem solid ${color}`,
                borderRadius: "50%",
                backgroundColor: color,
            }}
        >
            &nbsp;
        </div>
    )
}

export default StatusIndicator;
