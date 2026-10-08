import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTema } from '../styles/ThemeContext';
import { useDados } from '../context/DadosContext';
import { useFeedback } from '../context/FeedbackContext';
import { Prioridade } from '../types';
import { coresPrioridade, fontes, tipografia } from '../styles/theme';
import { mascaraData } from '../services/utils';
import { validarTarefa } from '../services/tarefaService';
import Header from '../components/Header';
import CampoFormulario from '../components/CampoFormulario';
import BotaoPrincipal from '../components/BotaoPrincipal';
import ChipCategoria from '../components/ChipCategoria';

type Props = NativeStackScreenProps<RootStackParamList, 'FormTarefa'>;

export default function FormTarefaScreen({ navigation, route }: Props) {
  const { tema } = useTema();
  const { tarefas, categorias, adicionarTarefa, editarTarefa } = useDados();
  const { mostrar } = useFeedback();
  const tarefaId = route.params?.tarefaId;
  const existente = tarefas.find((t) => t.id === tarefaId);

  const [titulo, setTitulo] = useState(existente?.titulo ?? '');
  const [descricao, setDescricao] = useState(existente?.descricao ?? '');
  const [prioridade, setPrioridade] = useState<Prioridade>(existente?.prioridade ?? 'Média');
  const [dataLimite, setDataLimite] = useState(existente?.dataLimite ?? '');
  const [categoriaId, setCategoriaId] = useState<number | null>(existente?.categoriaId ?? null);
  const [erros, setErros] = useState<{ titulo?: string; dataLimite?: string; categoriaId?: string }>({});

  async function salvar() {
    const dados = { titulo, descricao, prioridade, dataLimite, categoriaId };
    const e = validarTarefa(dados);
    setErros(e);
    if (Object.keys(e).length > 0) {
      mostrar('Confira os campos destacados', 'erro');
      return;
    }
    if (existente) {
      await editarTarefa(existente.id, dados);
      mostrar('Tarefa atualizada!');
    } else {
      await adicionarTarefa(dados);
      mostrar('Tarefa criada com sucesso! ✨');
    }
    navigation.goBack();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.fundo }}>
      <Header
        subtitulo={existente ? 'Editar tarefa' : 'Nova tarefa'}
        titulo={existente ? 'Ajustar detalhes' : 'O que vamos fazer?'}
        onVoltar={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <CampoFormulario rotulo="Título" placeholder="Ex.: Estudar para a prova" value={titulo} onChangeText={setTitulo} erro={erros.titulo} />
        <CampoFormulario
          rotulo="Descrição (opcional)"
          placeholder="Conte um pouco mais sobre a tarefa"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          style={{ minHeight: 96, textAlignVertical: 'top' }}
        />
        <CampoFormulario
          rotulo="Para quando? (opcional)"
          icone="calendar-outline"
          placeholder="DD/MM/AAAA"
          value={dataLimite}
          onChangeText={(t) => setDataLimite(mascaraData(t))}
          keyboardType="number-pad"
          maxLength={10}
          erro={erros.dataLimite}
        />

        <Text style={[tipografia.rotulo, styles.rotulo, { color: tema.textoSuave }]}>Prioridade</Text>
        <View style={styles.linha}>
          {(['Baixa', 'Média', 'Alta'] as Prioridade[]).map((p) => (
            <ChipCategoria key={p} texto={p} cor={coresPrioridade[p]} selecionado={prioridade === p} onPress={() => setPrioridade(p)} />
          ))}
        </View>

        <Text style={[tipografia.rotulo, styles.rotulo, { color: erros.categoriaId ? tema.erro : tema.textoSuave }]}>Categoria</Text>
        <View style={styles.linha}>
          {categorias.map((c) => (
            <ChipCategoria key={c.id} texto={c.nome} cor={c.cor} selecionado={categoriaId === c.id} onPress={() => setCategoriaId(c.id)} />
          ))}
        </View>
        {erros.categoriaId ? <Text style={[styles.erro, { color: tema.erro }]}>{erros.categoriaId}</Text> : null}

        <View style={{ marginTop: 28, gap: 12 }}>
          <BotaoPrincipal titulo={existente ? 'Salvar alterações' : 'Criar tarefa'} icone="checkmark" onPress={salvar} />
          <BotaoPrincipal titulo="Cancelar" variante="secundario" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  form: { padding: 16, paddingBottom: 48 },
  rotulo: { marginBottom: 10, marginLeft: 2 },
  linha: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  erro: { fontFamily: fontes.medio, fontSize: 13, marginLeft: 2 },
});
