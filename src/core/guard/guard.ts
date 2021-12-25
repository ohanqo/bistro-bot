export default interface Guard {
  performValidation(): Promise<boolean>
  sendValidationFailureMessage(): Promise<void>
}
