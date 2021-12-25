export function guards(...guards: Function[]) {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    return class extends constructor {
      guards = [...guards];
    };
  };
}
