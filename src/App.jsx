import { ProyectoProvider } from './context/ProyectoContext';
import Layout from './components/Layout/Layout';
import PantallaActiva from './components/screens/PantallaActiva';

const App = () => {
  return (
    <ProyectoProvider>
      <Layout>
        <PantallaActiva />
      </Layout>
    </ProyectoProvider>
  );
};

export default App;