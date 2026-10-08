import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTema } from '../styles/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useDados } from '../context/DadosContext';
import { useFeedback } from '../context/FeedbackContext';
import { cartao, fontes, tipografia } from '../styles/theme';
import { validarNome } from '../services/authService';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import CampoFormulario from '../components/CampoFormulario';
import BotaoPrincipal from '../components/BotaoPrincipal';

type Props = NativeStackScreenProps<RootStackParamList, 'Perfil'>;

export default function PerfilScreen({ navigation }: Props) {
  const { tema, escuro, alternarTema } = useTema();
  const { usuario, atualizarNome, sair } = useAuth();
  const { tarefas, categorias } = useDados();
  const { mostrar, confirmar } = useFeedback();
  const [nome, setNome] = useState(usuario?.nome ?? '');
  const [erro, setErro] = useState<string | undefined>();

  if (!usuario) return null;

  const concluidas = tarefas.filter((t) => t.concluida).length;

  async function salvarNome() {
    const e = validarNome(nome);
    setErro(e.nome);
    if (e.nome) {
      mostrar('Confira o nome informado', 'erro');
      return;
    }
    if (nome.trim() === usuario?.nome) {
      mostrar('Nenhuma alteração para salvar', 'info');
      return;
    }
    const falha = await atualizarNome(nome);
    if (falha) {
      mostrar(falha, 'erro');
      return;
    }
    mostrar('Nome atualizado!');
  }

  async function sairDaConta() {
    const ok = await confirmar({
      titulo: 'Sair da conta?',
      mensagem: 'Suas tarefas continuam guardadas neste aparelho. É só entrar de novo para vê-las.',
      textoConfirmar: 'Sair',
      perigo: true,
    });
    if (!ok) return;
    await sair();
    mostrar('Você saiu da conta', 'info');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.fundo }}>
      <Header subtitulo="Conta" titulo="Seu perfil" onVoltar={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.identidade}>
          <Avatar nome={usuario.nome} tamanho={84} />
          <Text style={[styles.nome, { color: tema.texto }]} numberOfLines={1}>{usuario.nome}</Text>
          <Text style={[styles.email, { color: tema.textoSuave }]} numberOfLines={1}>{usuario.email}</Text>
        </View>

        <View style={styles.stats}>
          <Stat valor={tarefas.length} rotulo="Tarefas" />
          <Stat valor={concluidas} rotulo="Concluídas" />
          <Stat valor={categorias.length} rotulo="Categorias" />
        </View>

        <Text style={[styles.secao, { color: tema.texto }]}>Dados da conta</Text>
        <CampoFormulario
          rotulo="Seu nome"
          icone="person-outline"
          value={nome}
          onChangeText={setNome}
          erro={erro}
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={salvarNome}
        />
        <BotaoPrincipal titulo="Salvar nome" variante="secundario" icone="checkmark" onPress={salvarNome} />

        <Text style={[styles.secao, { color: tema.texto }]}>Aparência</Text>
        <View style={[styles.linhaTema, cartao(tema)]}>
          <Ionicons name={escuro ? 'moon' : 'sunny'} size={22} color={tema.primaria} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.temaTitulo, { color: tema.texto }]}>Tema escuro</Text>
            <Text style={[styles.temaSub, { color: tema.textoSuave }]}>{escuro ? 'Luz âmbar na penumbra' : 'Papel claro, tinta escura'}</Text>
          </View>
          <Switch
            value={escuro}
            onValueChange={alternarTema}
            trackColor={{ false: tema.borda, true: tema.primaria }}
            thumbColor="#FFFFFF"
            accessibilityLabel="Alternar tema escuro"
          />
        </View>

        <View style={{ marginTop: 32 }}>
          <BotaoPrincipal titulo="Sair da conta" variante="perigo" icone="log-out-outline" onPress={sairDaConta} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ valor, rotulo }: { valor: number; rotulo: string }) {
  const { tema } = useTema();
  return (
    <View style={[styles.stat, cartao(tema)]}>
      <Text style={[styles.statValor, { color: tema.texto }]}>{valor}</Text>
      <Text style={[tipografia.rotulo, { color: tema.textoSuave }]}>{rotulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  identidade: { alignItems: 'center', gap: 6, marginTop: 4, marginBottom: 24 },
  nome: { ...tipografia.display, fontSize: 26, marginTop: 10, letterSpacing: -0.4 },
  email: { fontFamily: fontes.medio, fontSize: 14.5 },
  stats: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, alignItems: 'center', paddingVertical: 16, gap: 4 },
  statValor: { ...tipografia.display, fontSize: 28 },
  secao: { ...tipografia.display, fontSize: 20, marginTop: 30, marginBottom: 14 },
  linhaTema: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  temaTitulo: { fontFamily: fontes.bold, fontSize: 16 },
  temaSub: { fontFamily: fontes.regular, fontSize: 13.5, marginTop: 1 },
});
