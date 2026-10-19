import { Component } from "react";
export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error)
      return (
        <div className="container py-5">
          <h1>No pudimos abrir esta vista.</h1>
          <p role="alert">{this.state.error.message}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Volver a cargar
          </button>
        </div>
      );
    return this.props.children;
  }
}
