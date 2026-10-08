import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useTema } from '../styles/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import InicioScreen from '../screens/InicioScreen';
import ListaTarefasScreen from '../screens/ListaTarefasScreen';
import FormTarefaScreen from '../screens/FormTarefaScreen';
import DetalhesTarefaScreen from '../screens/DetalhesTarefaScreen';
import CategoriasScreen from '../screens/CategoriasScreen';
import FormCategoriaScreen from '../screens/FormCategoriaScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navegacao() {
  const { tema, escuro } = useTema();
  const { carregando, usuario } = useAuth();
  const base = escuro ? DarkTheme : DefaultTheme;


  if (carregando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28, backgroundColor: tema.fundo }}>
        <Logo tamanho={72} comNome />
        <ActivityIndicator color={tema.primaria} />
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{
        ...base,
        colors: { ...base.colors, background: tema.fundo, card: tema.fundo, text: tema.texto, border: tema.borda, primary: tema.primaria },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {usuario ? (

          <>
            <Stack.Screen name="Inicio" component={InicioScreen} />
            <Stack.Screen name="ListaTarefas" component={ListaTarefasScreen} />
            <Stack.Screen name="FormTarefa" component={FormTarefaScreen} />
            <Stack.Screen name="DetalhesTarefa" component={DetalhesTarefaScreen} />
            <Stack.Screen name="Categorias" component={CategoriasScreen} />
            <Stack.Screen name="FormCategoria" component={FormCategoriaScreen} />
            <Stack.Screen name="Perfil" component={PerfilScreen} />
          </>
        ) : (

          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ animationTypeForReplace: 'pop' }} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
