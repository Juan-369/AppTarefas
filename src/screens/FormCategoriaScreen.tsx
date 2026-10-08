import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTema } from '../styles/ThemeContext';
import { useDados } from '../context/DadosContext';
import { useFeedback } from '../context/FeedbackContext';
import { paletaCategorias, raios, tipografia } from '../styles/theme';
import { validarCategoria } from '../services/categoriaService';
import { corTextoSobre } from '../services/utils';
import Header from '../components/Header';
import CampoFormulario from '../components/CampoFormulario';
import BotaoPrincipal from '../components/BotaoPrincipal';
import ChipCategoria from '../components/ChipCategoria';

type Props = NativeStackScreenProps<RootStackParamList, 'FormCategoria'>;

export default function FormCategoriaScreen({ navigation }: Props) {
  const { tema } = useTema();
  const { categorias, adicionarCategoria } = useDados();
  const { mostrar } = useFeedback();
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState(paletaCategorias[0]);
  const [erro, setErro] = useState<string | undefined>();

  async function salvar() {
    const e = validarCategoria(nome, categorias);
    setErro(e.nome);
    if (e.nome) {
      mostrar('Confira o nome da categoria', 'erro');
      return;
    }
    await adicionarCategoria(nome, cor);
    mostrar('Categoria criada com sucesso! 🎨');
    navigation.goBack();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.fundo }}>
      <Header subtitulo="Nova categoria" titulo="Dê um nome e uma cor" onVoltar={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <CampoFormulario rotulo="Nome" placeholder="Ex.: Faculdade" value={nome} onChangeText={setNome} erro={erro} />

        <Text style={[tipografia.rotulo, styles.rotulo, { color: tema.textoSuave }]}>Escolha uma cor</Text>
        <View style={styles.cores}>
          {paletaCategorias.map((c) => {
            const ativa = cor === c;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setCor(c)}
                accessibilityRole="button"
                accessibilityLabel={`Cor ${c}`}
                accessibilityState={{ selected: ativa }}
                style={[styles.cor, { backgroundColor: c }, ativa && { borderColor: tema.texto }]}
              >
                {ativa && <Ionicons name="checkmark" size={22} color={corTextoSobre(c)} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[tipografia.rotulo, styles.rotulo, { color: tema.textoSuave }]}>Como vai ficar</Text>
        <View style={{ alignItems: 'flex-start', marginBottom: 28 }}>
          <ChipCategoria texto={nome.trim() || 'Categoria'} cor={cor} />
        </View>

        <View style={{ gap: 12 }}>
          <BotaoPrincipal titulo="Salvar categoria" icone="checkmark" onPress={salvar} />
          <BotaoPrincipal titulo="Cancelar" variante="secundario" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rotulo: { marginBottom: 12, marginLeft: 2 },
  cores: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 26 },
  cor: { width: 50, height: 50, borderRadius: raios.md, borderWidth: 3, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
});
