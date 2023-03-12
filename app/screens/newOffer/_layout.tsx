import {
  FredokaOne_400Regular,
  useFonts,
} from '@expo-google-fonts/fredoka-one';
import {
  NotoSans_400Regular,
  NotoSans_600SemiBold,
  NotoSans_800ExtraBold,
} from '@expo-google-fonts/noto-sans';
import { Slot, SplashScreen, Stack } from 'expo-router';

export const colors = {
  patternColorA: '#4761C2',
  patternColorB: '#DDE6FF',
  patternColorC: '#C2D3F2',
  patternColorD: '#273774',
  patternColorF: '#f2f4fd',
};

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
        name="newOffer"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="selectCustomer"
        options={{
          presentation: 'modal',
          title: 'Select Customer',
          animation: 'slide_from_right',
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}
