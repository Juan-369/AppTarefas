import React from 'react';
import { View, ActivityIndicator, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import { ThemeProvider, useTema } from './src/styles/ThemeContext';
import { FeedbackProvider } from './src/context/FeedbackContext';
import { AuthProvider } from './src/context/AuthContext';
import { DadosProvider } from './src/context/DadosContext';
import Navegacao from './src/navigation';

function Conteudo() {
  const { escuro } = useTema();
  return (
    <>
      <StatusBar style={escuro ? 'light' : 'dark'} />
      <Navegacao />
    </>
  );
}

export default function App() {
  const sistemaEscuro = useColorScheme() === 'dark';
  const [fontesCarregadas] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  if (!fontesCarregadas) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: sistemaEscuro ? '#0B1020' : '#F6F8FC' }}>
        <ActivityIndicator size="large" color={sistemaEscuro ? '#7187FF' : '#4F6BFF'} />
      </View>
    );
  }


  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <FeedbackProvider>
          <AuthProvider>
            <DadosProvider>
              <Conteudo />
            </DadosProvider>
          </AuthProvider>
        </FeedbackProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
