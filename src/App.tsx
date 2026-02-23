

import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoadingScreen from './components/ui/LoadingScreen';

function App() {
  return (
    <>
      <LoadingScreen />
      <Layout>
        <HomePage />
      </Layout>
    </>
  );
}

export default App;
