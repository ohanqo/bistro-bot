import { ClientEvents } from "discord.js"
import { decorate, injectable } from "inversify"

export function event<K extends keyof ClientEvents>(_event: K) {
  return <T extends { new (...args: any[]): {} }>(constr: T) => {
    decorate(injectable(), constr)

    // save a reference to the original constructor
    var original = constr

    // a utility function to generate instances of a class
    function construct(constructor: any, args: any[]) {
      var c: any = function () {
        return new constructor(...args)
      }
      c.prototype = constructor.prototype
      return new c()
    }

    // the new constructor behaviour
    var newConstructor: any = function (...args: any[]) {
      return construct(original, args)
    }

    // copy prototype so intanceof operator still works
    newConstructor.prototype = original.prototype

    // Copy metadata
    var metadataKeys = Reflect.getMetadataKeys(constr)
    metadataKeys.forEach((metadataKey) => {
      var metadataValue = Reflect.getMetadata(metadataKey, constr)
      Reflect.defineMetadata(metadataKey, metadataValue, newConstructor)
    })

    newConstructor.prototype.event = _event

    return class extends newConstructor {}
  }
}
