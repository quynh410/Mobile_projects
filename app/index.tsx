import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to register screen as the first screen
  return <Redirect href="/(auth)" />;
}

