
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoadingScreen from './components/ui/LoadingScreen';

function App() {
  return (
    <ThemeProvider>
      <LoadingScreen />
      <Layout>
        <HomePage />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
