import React from 'react';

export interface ChonkyErrorBoundaryProps {
  children: any;
}

export interface ChonkyErrorBoundaryState {
  hasError: boolean;
}

export class ChonkyErrorBoundary extends React.Component<ChonkyErrorBoundaryProps, ChonkyErrorBoundaryState> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): ChonkyErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <h1>Sorry.. there was an error</h1>;
    }

    return this.props.children;
  }
}
