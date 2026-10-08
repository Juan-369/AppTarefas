import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTema } from '../styles/ThemeContext';
import { fontes } from '../styles/theme';

interface Props<T extends string> {
  opcoes: readonly T[];
  valor: T;
  onChange: (valor: T) => void;
}


export default function Abas<T extends string>({ opcoes, valor, onChange }: Props<T>) {
  const { tema } = useTema();
  return (
    <View style={[styles.linha, { borderBottomColor: tema.borda }]}>
      {opcoes.map((o) => {
        const ativa = o === valor;
        return (
          <TouchableOpacity
            key={o}
            activeOpacity={0.7}
            onPress={() => onChange(o)}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativa }}
            style={[styles.aba, { borderBottomColor: ativa ? tema.primaria : 'transparent' }]}
          >
            <Text style={[styles.texto, { color: ativa ? tema.texto : tema.textoSuave }]}>{o}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', borderBottomWidth: 1, marginHorizontal: 16 },
  aba: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 3, marginBottom: -1 },
  texto: { fontFamily: fontes.extra, fontSize: 14.5 },
});
