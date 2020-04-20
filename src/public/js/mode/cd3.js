CodeMirror.defineSimpleMode("cd3", {
  start: [
    { regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string" },
    {
      regex: /(?:var|return|if|for|while|else|do|this)\b/,
      token: "keyword",
    },
    { regex: /true|false|null|P|H|Heap|Stack/, token: "atom" },
    {
      regex: /0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i,
      token: "number",
    },
    { regex: /\/\/.*/, token: "comment" },
    { regex: /\/(?:[^\\]|\\.)*?\//, token: "variable-3" },
    // A next property will cause the mode to move to a different state
    { regex: /\/\*/, token: "comment", next: "comment" },
    { regex: /[-+\/*=<>!]+/, token: "operator" },
    // indent and dedent properties guide autoindentation
    { regex: /[\{\[\(]/, indent: true },
    { regex: /[\}\]\)]/, dedent: true },
    { regex: /[a-z$][\w$]*/, token: "variable" },
  ],
  // The multi-line comment state.
  comment: [
    { regex: /.*?\*\//, token: "comment", next: "start" },
    { regex: /.*/, token: "comment" },
  ],
  meta: {
    dontIndentStates: ["comment"],
    lineComment: "#",
  },
});
