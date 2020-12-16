export default interface Validator {
  validate(): Promise<Boolean>;
}
