/** True in local dev builds only — never enable reset-demo in production. */
export function isDevEnvironment(): boolean {
  return typeof __DEV__ !== "undefined" && __DEV__ === true;
}
