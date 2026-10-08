import React, { forwardRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../styles/ThemeContext';
import { fontes, raios, tipografia } from '../styles/theme';

interface Props extends TextInputProps {
  rotulo: string;
  erro?: string;
  icone?: keyof typeof Ionicons.glyphMap;
  senha?: boolean;
}

const CampoFormulario = forwardRef<TextInput, Props>(function CampoFormulario(
  { rotulo, erro, icone, senha = false, style, onFocus, onBlur, multiline, ...resto },
  ref
) {
  const { tema } = useTema();
  const [foco, setFoco] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const borda = erro ? tema.erro : foco ? tema.primaria : tema.borda;

  return (
    <View style={styles.grupo}>
      <Text style={[tipografia.rotulo, styles.rotulo, { color: erro ? tema.erro : tema.textoSuave }]}>{rotulo}</Text>
      <View
        style={[
          styles.caixa,
          { backgroundColor: tema.superficie, borderColor: borda },
          multiline && styles.caixaMulti,
        ]}
      >
        {icone && <Ionicons name={icone} size={20} color={foco ? tema.primaria : tema.textoSuave} style={styles.icone} />}
        <TextInput
          ref={ref}
          accessibilityLabel={rotulo}
          placeholderTextColor={tema.textoSuave}
          selectionColor={tema.primaria}
          {...resto}
          multiline={multiline}
          secureTextEntry={senha && !visivel}
          onFocus={(e) => { setFoco(true); onFocus?.(e); }}
          onBlur={(e) => { setFoco(false); onBlur?.(e); }}
          style={[styles.input, { color: tema.texto }, style]}
        />
        {senha && (
          <TouchableOpacity
            onPress={() => setVisivel((v) => !v)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={visivel ? 'Esconder senha' : 'Mostrar senha'}
          >
            <Ionicons name={visivel ? 'eye-off-outline' : 'eye-outline'} size={21} color={tema.textoSuave} />
          </TouchableOpacity>
        )}
      </View>
      {erro ? (
        <View style={styles.linhaErro}>
          <Ionicons name="alert-circle" size={15} color={tema.erro} />
          <Text style={[styles.erro, { color: tema.erro }]}>{erro}</Text>
        </View>
      ) : null}
    </View>
  );
});

export default CampoFormulario;

const styles = StyleSheet.create({
  grupo: { marginBottom: 18 },
  rotulo: { marginBottom: 8, marginLeft: 2 },
  caixa: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: raios.md, paddingHorizontal: 14 },
  caixaMulti: { alignItems: 'flex-start' },
  icone: { marginRight: 10 },
  input: { flex: 1, fontFamily: fontes.medio, fontSize: 16, paddingVertical: 14 },
  linhaErro: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 7, marginLeft: 2 },
  erro: { fontFamily: fontes.medio, fontSize: 13, flexShrink: 1 },
});
