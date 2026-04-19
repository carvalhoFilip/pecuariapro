import { authLocalization } from "@neondatabase/auth/react/ui";
import type { AuthLocalization } from "@neondatabase/auth/react/ui";

/**
 * Textos do Neon Auth UI em português (validação de senha, erros frequentes no login/registo).
 * Mantém todas as chaves do pacote e sobrescreve só o necessário.
 */
export const pecuariaAuthLocalization: AuthLocalization = {
  ...authLocalization,
  PASSWORD_TOO_SHORT: "A senha é demasiado curta.",
  PASSWORD_TOO_LONG: "A senha é demasiado longa.",
  INVALID_PASSWORD: "Senha inválida.",
  INVALID_EMAIL_OR_PASSWORD: "E-mail ou senha incorretos.",
  PASSWORD_REQUIRED: "A senha é obrigatória.",
  PASSWORDS_DO_NOT_MATCH: "As senhas não coincidem.",
  NEW_PASSWORD_REQUIRED: "A nova senha é obrigatória.",
  CONFIRM_PASSWORD_REQUIRED: "Confirme a senha.",
  CHANGE_PASSWORD_INSTRUCTIONS: "Utilize pelo menos 8 caracteres.",
  EMAIL_REQUIRED: "O e-mail é obrigatório.",
  INVALID_EMAIL: "E-mail inválido.",
  USER_ALREADY_EXISTS: "Já existe uma conta com este e-mail.",
  FAILED_TO_CREATE_USER: "Não foi possível criar a conta. Tente novamente.",
  REQUEST_FAILED: "Pedido falhou. Tente novamente.",
};
