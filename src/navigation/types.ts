export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  TiposLocal: undefined;
  NovoPonto: { tipo: string } // 👈 AQUI
  Esquecer: undefined;
  Redefinir: undefined;
  details: {
    ponto: any
  };
  AvaliarLocal: {
    ponto: any
  };
};