import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTema } from '../styles/ThemeContext';
import { brilho, tipografia } from '../styles/theme';
import { inicial } from '../services/utils';

interface Props {
  nome: string;
  tamanho?: number;
  onPress?: () => void;
}

export default function Avatar({ nome, tamanho = 44, onPress }: Props) {
  const { tema } = useTema();
  const estilo = [
    styles.caixa,
    brilho(tema.primaria, 0.3),
    { width: tamanho, height: tamanho, borderRadius: tamanho / 2, backgroundColor: tema.primaria },
  ];
  const letra = <Text style={[styles.letra, { color: tema.textoSobrePrimaria, fontSize: tamanho * 0.46 }]}>{inicial(nome)}</Text>;

  if (!onPress) return <View style={estilo}>{letra}</View>;
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={estilo} accessibilityRole="button" accessibilityLabel="Abrir perfil">
      {letra}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  caixa: { alignItems: 'center', justifyContent: 'center' },
  letra: { ...tipografia.display },
});
