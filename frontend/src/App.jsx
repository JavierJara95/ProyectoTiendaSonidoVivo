import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./routes/AppRouter";
import ErrorBoundary from "./components/common/ErrorBoundary";
export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ErrorBoundary>
  );
}
