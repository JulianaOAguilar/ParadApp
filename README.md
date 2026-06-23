# ParadApp

> ## um pequeno guia para rodar o projeto!! :3 🐈‍⬛



1. Acesse o repositório:

   [ParadApp (GitHub)](https://github.com/JulianaOAguilar/ParadApp?utm_source=chatgpt.com)

2. No Git Bash ou terminal, clone o repositório para sua máquina:

```bash
git clone https://github.com/JulianaOAguilar/ParadApp.git
```

3. Entre na pasta do projeto:

```bash
cd ParadApp
```

4. Antes de iniciar uma nova funcionalidade, crie uma branch específica para ela. Isso ajuda a evitar conflitos quando mais de uma pessoa estiver trabalhando no código ao mesmo tempo:

```bash
git checkout -b nome-da-sua-branch
```

5. Instale todas as dependências do projeto:

```bash
npm install
```

### Executando o projeto

#### Versão Web

Para rodar o projeto no navegador:

```bash
npm run web
```

#### Versão Mobile (Expo Go)

1. Instale o aplicativo **Expo Go** no seu celular.
2. No terminal, execute:

```bash
npm start ou npx expo start
```

3. Um QR Code será exibido no terminal.
4. Abra o Expo Go no celular e escaneie o QR Code para executar o aplicativo.

---

**Estrutura atual do projeto:**

```text
src
├── screens
├── components
├── navigation
└── services

```

* **screens**: telas do aplicativo (Home, Login, Perfil, etc.).
* **components**: elementos reutilizáveis da interface (botões, inputs, cards, etc.).
* **navigation**: configuração da navegação entre as telas.
* **services**: configuração do banco.

Se quiserem alterar algo, fiquem a vontade ✨ uwu


