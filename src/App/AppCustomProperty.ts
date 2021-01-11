declare global {
  interface String {
    inQuoteContent(): String | undefined;
  }

  function delay(timeInMs: number): Promise<void>;
}

String.prototype.inQuoteContent = function inQuoteContent() {
  const matches = this.match(/"(.*?)"/);
  return matches ? matches[1] : undefined;
};

global.delay = function (timeInMs: number): Promise<void> {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeInMs);
  });
};

export {};
