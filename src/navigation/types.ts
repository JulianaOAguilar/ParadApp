export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Cadastro: undefined;
  TiposLocal: undefined;
  Details: { ponto: any };
  AvaliacaoDetalhes: {avaliacao: any};
  NovoPonto: { tipo: string };// 👈 AQUI
  Esquecer: undefined;
  Redefinir: undefined;
  AvaliarLocal: { ponto: any }; 
  Denuncia:
  | { ponto: any; avaliacao?: undefined }
  | { avaliacao: any; ponto?: undefined };
  Pesquisar: undefined;
};