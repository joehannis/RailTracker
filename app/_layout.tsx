import { Stack } from 'expo-router/stack';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

export default function Layout() {
  return (
    <AutocompleteDropdownContextProvider>
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
      </Stack>
    </AutocompleteDropdownContextProvider>
  );
}
