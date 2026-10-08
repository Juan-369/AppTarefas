import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTema } from '../styles/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import { fontes } from '../styles/theme';
import { SENHA_MINIMA, validarCadastro } from '../services/authService';
import Header from '../components/Header';
import CampoFormulario from '../components/CampoFormulario';
import BotaoPrincipal from '../components/BotaoPrincipal';
import FundoNotoa from '../components/FundoNotoa';

type Props = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;
type Erros = { nome?: string; email?: string; senha?: string; confirmacao?: string };

export default function CadastroScreen({ navigation }: Props) {
  const { tema } = useTema();
  const { cadastrar } = useAuth();
  const { mostrar } = useFeedback();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erros, setErros] = useState<Erros>({});
  const [enviando, setEnviando] = useState(false);
  const refEmail = useRef<TextInput>(null);
  const refSenha = useRef<TextInput>(null);
  const refConfirmacao = useRef<TextInput>(null);

  async function enviar() {
    if (enviando) return;
    const e = validarCadastro({ nome, email, senha, confirmacao });
    setErros(e);
    if (Object.keys(e).length > 0) {
      mostrar('Confira os campos destacados', 'erro');
      return;
    }
    setEnviando(true);
    const erro = await cadastrar(nome, email, senha);
    if (erro) {
      setEnviando(false);

      setErros(erro.includes('e-mail') ? { email: erro } : {});
      mostrar(erro, 'erro');
      return;
    }
    mostrar('Conta criada! Bem-vindo(a) ao Notoa ✨');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.fundo }}>
      <FundoNotoa />
      <Header subtitulo="Nova conta" titulo="Vamos começar?" onVoltar={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={[styles.sub, { color: tema.textoSuave }]}>
            Leva menos de um minuto. Seus dados ficam guardados só neste aparelho.
          </Text>

          <CampoFormulario
            rotulo="Nome"
            icone="person-outline"
            placeholder="Como podemos te chamar?"
            value={nome}
            onChangeText={setNome}
            erro={erros.nome}
            autoCapitalize="words"
            textContentType="name"
            returnKeyType="next"
            onSubmitEditing={() => refEmail.current?.focus()}
          />
          <CampoFormulario
            ref={refEmail}
            rotulo="E-mail"
            icone="mail-outline"
            placeholder="nome@email.com"
            value={email}
            onChangeText={setEmail}
            erro={erros.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => refSenha.current?.focus()}
          />
          <CampoFormulario
            ref={refSenha}
            rotulo="Senha"
            icone="lock-closed-outline"
            placeholder={`Mínimo de ${SENHA_MINIMA} caracteres`}
            value={senha}
            onChangeText={setSenha}
            erro={erros.senha}
            senha
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
            returnKeyType="next"
            onSubmitEditing={() => refConfirmacao.current?.focus()}
          />
          <CampoFormulario
            ref={refConfirmacao}
            rotulo="Confirmar senha"
            icone="shield-checkmark-outline"
            placeholder="Repita a senha"
            value={confirmacao}
            onChangeText={setConfirmacao}
            erro={erros.confirmacao}
            senha
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
            returnKeyType="go"
            onSubmitEditing={enviar}
          />

          <View style={{ marginTop: 6, gap: 6 }}>
            <BotaoPrincipal titulo="Criar conta" icone="person-add-outline" onPress={enviar} carregando={enviando} />
            <View style={styles.rodape}>
              <Text style={[styles.rodapeTxt, { color: tema.textoSuave }]}>Já tem uma conta?</Text>
              <BotaoPrincipal titulo="Entrar" variante="link" onPress={() => navigation.goBack()} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  conteudo: { padding: 16, paddingBottom: 40 },
  sub: { fontFamily: fontes.regular, fontSize: 15.5, lineHeight: 22, marginBottom: 24 },
  rodape: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, flexWrap: 'wrap' },
  rodapeTxt: { fontFamily: fontes.medio, fontSize: 14.5 },
});
