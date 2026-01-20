# Configurações Necessárias no Firebase Console

## ✅ Já Configurado
- Firebase Project criado: `desafio-depositos-app`
- Web App registrado
- Firebase SDK instalado no frontend
- Variáveis de ambiente (.env) configuradas

---

## 🔧 Configurações Pendentes (Manuais)

### 1. **Firebase Authentication - Email/Password Provider**

**Status**: ⚠️ **PENDENTE**

**Passos**:
1. Acesse: https://console.firebase.google.com/project/desafio-depositos-app/authentication/providers
2. Clique na aba "Sign-in method"
3. Clique em "Email/Password"
4. **Habilite** o provider "Email/Password"
5. **NÃO** habilite o "Email link (passwordless sign-in)"
6. Clique em "Save"

**Por que é necessário**: Sem isso, os usuários não conseguirão criar contas nem fazer login.

---

### 3. **Cloud Firestore - Verificação**

**Status**: ✅ **Configurado automaticamente**

**Verificar**:
1. Acesse: https://console.firebase.google.com/project/desafio-depositos-app/firestore
2. Se o Firestore já estiver criado, você deve ver a database `(default)`
3. Se NÃO estiver criado:
   - Clique em "Create database"
   - Selecione **"Start in production mode"**
   - Escolha a localização: **`nam5`** (North America)
   - Clique em "Enable"

**As security rules foram deployadas automaticamente.**

---

## 🚀 Após Configurar

Execute os seguintes comandos para garantir que tudo está sincronizado:

```bash
# Deploy das Security Rules (Firestore apenas)
firebase deploy --only firestore:rules --project desafio-depositos-app

# Deploy do Frontend
firebase deploy --only hosting --project desafio-depositos-app
```

---

## ✅ Checklist Final

- [x] Email/Password provider habilitado (confirmado pelo usuário)
- [x] Firestore database criado
- [x] Security rules deployadas
- [ ] Frontend deployado

> **Nota**: Firebase Storage foi ADIADO para Phase 2. O MVP funcionará sem upload de recibos.

---

## 🔗 Links Rápidos

- **Firebase Console**: https://console.firebase.google.com/project/desafio-depositos-app
- **Authentication**: https://console.firebase.google.com/project/desafio-depositos-app/authentication
- **Firestore**: https://console.firebase.google.com/project/desafio-depositos-app/firestore
- **Hosting**: https://console.firebase.google.com/project/desafio-depositos-app/hosting
