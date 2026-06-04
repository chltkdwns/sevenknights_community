export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,100}$/;

export type PasswordStrength = "weak" | "medium" | "strong" | null;

export function validatePassword(password: string): string | null {
  if (!password) {
    return "비밀번호를 입력해 주세요.";
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`;
  }
  if (!/^[A-Za-z\d]+$/.test(password)) {
    return "비밀번호는 영문과 숫자만 사용할 수 있습니다.";
  }
  if (!/(?=.*[A-Za-z])/.test(password)) {
    return "비밀번호에 영문을 포함해 주세요.";
  }
  if (!/(?=.*\d)/.test(password)) {
    return "비밀번호에 숫자를 포함해 주세요.";
  }
  return null;
}

export function getPasswordStrength(password: string): PasswordStrength {
  const error = validatePassword(password);
  // 유효하지 않은 비밀번호는 강도를 표시하지 않거나 "약함"으로 처리
  if (!password) return null;
  if (error) return "weak";

  // 강도는 사용자 안내용이며 버튼 활성화 조건과는 무관하다.
  // 유효 비밀번호(8자 이상 영문+숫자) 기준 길이로만 구분
  if (password.length >= 12) return "strong";
  if (password.length >= 10) return "medium";
  return "weak";
}

export const PASSWORD_STRENGTH_LABEL: Record<
  Exclude<PasswordStrength, null>,
  string
> = {
  weak: "약함",
  medium: "보통",
  strong: "강함",
};

export function passwordsMatch(password: string, confirm: string): boolean {
  return password.length > 0 && password === confirm;
}
