export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  TiposLocal: undefined;
  Details: { ponto: any };
  NovoPonto: { tipo: string } // 👈 AQUI
  Esquecer: undefined;
  Redefinir: undefined;
  AvaliarLocal: { ponto: any }; 

};