import React from "react";

function Redirect({ error, stack }) {
    console.log(error);
    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh", justifyContent: "space-evenly", color: "white" }}>
            <div style={{ fontSize: "4vw", fontWeight: "700", color: "white", textShadow: "4px 4px rgba(0, 0, 0, 0.5)" }}>There was an error:</div>
            <div style={{ border: "3px solid var(--accent1)", padding: "10px", color: "white" }}>
                {stack || error.stack
                    ? (`Error: ${error.message}${stack}` || error.stack).split("\n").map((x, i) => (
                          <div key={i} style={i > 0 ? { marginLeft: "2rem" } : null}>
                              {x}
                          </div>
                      ))
                    : `Error: ${error.message}`}
            </div>
            <h1 style={{ opacity: 0.5, fontSize: "calc(var(--global) * 20)", lineHeight: "calc(var(--global) * 20)", textAlign: "left", position: "absolute", bottom: 0, left: 0, width: "min-content" }}>Cards Against Activities</h1>
        </div>
    );
}

// There's no hook for componentDidCatch
export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            componentStack: null,
        };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        this.setState({
            error: error,
            componentStack: info.componentStack,
        });
    }

    render() {
        if (this.state.error) return <Redirect error={this.state.error} stack={this.state.componentStack} />;
        // if (this.state.hasError) return window.location.href = this.props.fallback;
        return this.props.children;
    }
}
