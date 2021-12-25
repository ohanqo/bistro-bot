import { decorate, injectable } from "inversify";

export function command(_keyword: string, _description: string) {
  return <T extends { new (...args: any[]): {} }>(constr: T) => {
    decorate(injectable(), constr);

    return class extends constr {
      keyword = _keyword;
      description = _description;
    };
  };
}
