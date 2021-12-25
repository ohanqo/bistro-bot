export function options(...options: { new (...args: any[]): {} }[]) {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    const instantiatedOptions = options.map((o) => new o())
    return class extends constructor {
      options = instantiatedOptions
    }
  }
}
