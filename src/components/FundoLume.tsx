import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTema } from '../styles/ThemeContext';
import { brilho } from '../styles/theme';

// Anéis de luz decorativos que sangram pelo canto superior direito (telas de entrada)
export default function FundoLume() {
  const { tema } = useTema();
  const anel = (d: number, alfa: string) => ({
    position: 'absolute' as const,
    width: d,
    height: d,
    borderRadius: d / 2,
    right: -d / 2 + 30,
    top: -d / 2 + 30,
    borderWidth: 1.5,
    borderColor: tema.primaria + alfa,
  });
  return (
    <View pointerEvents="none" style={styles.caixa}>
      <View style={anel(420, '22')} />
      <View style={anel(300, '33')} />
      <View style={anel(180, '55')} />
      <View style={[styles.nucleo, { backgroundColor: tema.primaria }, brilho(tema.primaria, 0.9)]} />
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
  nucleo: { position: 'absolute', right: 24, top: 24, width: 12, height: 12, borderRadius: 6 },
});
