import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../styles/ThemeContext';

export default function FundoNotoa() {
  const { tema } = useTema();
  const linha = tema.primaria + (tema.fundo === '#0B1020' ? '18' : '14');
  const ponto = tema.heroDestaque + (tema.fundo === '#0B1020' ? '30' : '22');

  return (
    <View pointerEvents="none" style={styles.caixa}>
      <View style={[styles.grade, { borderColor: linha }]} />
      <View style={[styles.cartao, styles.cartaoUm, { borderColor: linha, backgroundColor: tema.superficie }]}>
        <View style={[styles.check, { borderColor: tema.heroDestaque }]}><Ionicons name="checkmark" size={10} color={tema.heroDestaque} /></View>
        <View style={[styles.traco, { backgroundColor: linha }]} />
        <View style={[styles.tracoCurto, { backgroundColor: linha }]} />
      </View>
      <View style={[styles.cartao, styles.cartaoDois, { borderColor: linha, backgroundColor: tema.superficie }]}>
        <View style={[styles.check, { borderColor: tema.primaria }]}><Ionicons name="checkmark" size={10} color={tema.primaria} /></View>
        <View style={[styles.traco, { backgroundColor: linha }]} />
      </View>
      <View style={[styles.ponto, { backgroundColor: ponto }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, overflow: 'hidden' },
  grade: { position: 'absolute', width: 330, height: 330, right: -130, top: -110, borderWidth: 1, borderRadius: 34, transform: [{ rotate: '-8deg' }] },
  cartao: { position: 'absolute', width: 118, height: 76, borderWidth: 1, borderRadius: 14, padding: 15, opacity: 0.75 },
  cartaoUm: { right: 28, top: 68, transform: [{ rotate: '-6deg' }] },
  cartaoDois: { right: 78, top: 132, transform: [{ rotate: '7deg' }], opacity: 0.48 },
  check: { width: 18, height: 18, borderWidth: 1.5, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  traco: { height: 5, width: '70%', borderRadius: 3, marginBottom: 6 },
  tracoCurto: { height: 5, width: '42%', borderRadius: 3 },
  ponto: { position: 'absolute', right: 32, top: 46, width: 10, height: 10, borderRadius: 5 },
});
