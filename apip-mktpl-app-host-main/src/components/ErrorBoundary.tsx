import React, { Component, ErrorInfo, ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="text-center">
          <h1>Something went wrong.</h1>
          <br />
          <h2 className="text-2xl">
            (This is the Host App Boundary component.)
          </h2>
          <br />
          <Link
            to="/"
            className="bg-black hover:bg-blue-700 text-white text-sm font-bold py-3 px-14"
          >
            Back to Home
          </Link>
        </div>
      );
    }

    return <React.Suspense>{this.props.children}</React.Suspense>;
  }
}

export default ErrorBoundary;
