import { Stack } from 'expo-router';

export default function HomeStack() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="productDetail"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
