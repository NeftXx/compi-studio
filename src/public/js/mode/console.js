CodeMirror.defineSimpleMode("console", {
  // The start state contains the rules that are intially used
  start: [
    { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" },
    { regex: /true|false|null/, token: "atom" },
    {
      regex: /[-+]?(?:\.\d+|\d+\.?\d*)/i,
      token: "number",
    },
    { regex: /[\{\[\(]/, indent: true },
    { regex: /[\}\]\)]/, dedent: true },
  ],
});
