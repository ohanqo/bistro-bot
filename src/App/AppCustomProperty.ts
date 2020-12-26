declare global {
  interface String {
    inQuoteContent(): String | undefined;
  }
}

String.prototype.inQuoteContent = function inQuoteContent() {
  const matches = this.match(/"(.*?)"/);
  return matches ? matches[1] : undefined;
};

export {};
