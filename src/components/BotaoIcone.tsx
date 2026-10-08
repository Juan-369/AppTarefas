import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../styles/ThemeContext';
import { raios } from '../styles/theme';

interface Props {
  icone: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  rotulo: string;
  tamanho?: number;
}

export default function BotaoIcone({ icone, onPress, rotulo, tamanho = 44 }: Props) {
  const { tema } = useTema();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      style={[styles.botao, { width: tamanho, height: tamanho, borderColor: tema.borda, backgroundColor: tema.superficie }]}
    >
      <Ionicons name={icone} size={tamanho * 0.46} color={tema.texto} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: { borderRadius: raios.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
