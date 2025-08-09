import { Container } from 'components/Container';
import { ScreenContent } from 'components/ScreenContent';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';

import './global.css';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <Container>
        <ScreenContent title="Home" path="App.tsx">
          <Text>Hello</Text>
        </ScreenContent>
      </Container>
    </>
  );
}
