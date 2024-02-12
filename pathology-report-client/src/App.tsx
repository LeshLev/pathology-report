import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PathologyInterpreter } from './components/PathologyInterpreter';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <PathologyInterpreter />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
