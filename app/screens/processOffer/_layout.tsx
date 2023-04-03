import {
  FredokaOne_400Regular,
  useFonts,
} from '@expo-google-fonts/fredoka-one';
import {
  NotoSans_400Regular,
  NotoSans_600SemiBold,
  NotoSans_800ExtraBold,
} from '@expo-google-fonts/noto-sans';
import { SplashScreen, Stack } from 'expo-router';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    FredokaOne_400Regular,
    NotoSans_400Regular,
    NotoSans_800ExtraBold,
    NotoSans_600SemiBold,
  });

  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="mainOffer"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="editItem"
        options={{
          presentation: 'modal',
          title: 'Edit Item',
          animation: 'slide_from_right',
          headerTitle: 'Edit Item',
        }}
      />
      <Stack.Screen
        name="addItem"
        options={{
          presentation: 'modal',
          title: 'Add Item',
          animation: 'slide_from_right',
          headerTitle: 'Add Item',
        }}
      />
      <Stack.Screen
        name="selectTemplateItem"
        options={{
          presentation: 'modal',
          title: 'Select Template',
          animation: 'slide_from_right',
          headerTitle: 'Select Template',
        }}
      />
    </Stack>
  );
}
