export const convertValToDol = (value) => {
    return parseFloat(value.replace("$", "").replace(",", "").replace("(", "-").replace(")", "")) || 0;
  };
  
export const convertValToPerc = (value) => {
  return parseFloat(value.replace('%', '')) / 100 || 0;
};

export const inf_symbol = "ꝏ"; //"∞"; // Default infinity symbol

export const prettify_dollars = (input) => {
  if (input === Infinity) {
    return `$${inf_symbol}`;
  } else if (input === -Infinity) {
    return `$(${inf_symbol})`;
  } else if (!input || Math.abs(input) - 1e-5 < 0) {
    return "-";
  } else if (input < 1000 && input > -1000) {
    return input > 0 ? `$${(input * 1).toFixed(1)}` : `$(${(input * -1).toFixed(1)})`;
  } else {
    let tempStr = input > 0 ? (input * 1).toFixed(0) : (input * -1).toFixed(0);
    if (input < 1000 && input > -1000) {
      return tempStr;
    }
    let newStr = "";
    let count = 0;
    for (let i = tempStr.length; i > 0; i--) {
      if (count % 3 === 0 && newStr !== "") {
        newStr = "," + newStr;
        count = 0;
      }
      newStr = tempStr.substring(i - 1, i) + newStr;
      count++;
    }
    return input > 0 ? `$${newStr}` : `$(${newStr})`;
  }
};

export const prettify_dollars_acc = (input) => {
  if (input === Infinity) {
    return `$${inf_symbol}`;
  } else if (input === -Infinity) {
    return `$(${inf_symbol})`;
  } else if (!input || Math.abs(input) - 1e-5 < 0) {
    return "-";
  } else if (input < 1000 && input > -1000) {
    return input > 0 ? `$${(input * 1).toFixed(2)}` : `$(${(input * -1).toFixed(2)})`;
  } else {
    let tempStr = input > 0 ? (input * 1).toFixed(0) : (input * -1).toFixed(0);
    if (input < 1000 && input > -1000) {
      return tempStr;
    }
    let newStr = "";
    let count = 0;
    for (let i = tempStr.length; i > 0; i--) {
      if (count % 3 === 0 && newStr !== "") {
        newStr = "," + newStr;
        count = 0;
      }
      newStr = tempStr.substring(i - 1, i) + newStr;
      count++;
    }
    return input > 0 ? `$${newStr}` : `$(${newStr})`;
  }
};

export const prettify_percent = (input) => {
  if (input === Infinity) {
    return `${inf_symbol}%`;
  } else if (input === -Infinity) {
    return `(${inf_symbol})%`;
  }
  return !input || Math.abs(input) - 1e-5 < 0
    ? "-"
    : input > 0
    ? `${(input * 100).toFixed(1)}%`
    : `(${(input * 100 * -1).toFixed(1)})%`;
};

export const prettify_pp = (input) => {
  if (input === Infinity) {
    return `${inf_symbol} pp`;
  } else if (input === -Infinity) {
    return `(${inf_symbol}) pp`;
  }
  return Math.abs(input) - 1e-5 < 0
    ? "-"
    : input > 0
    ? `${(input * 100).toFixed(1)} pp`
    : `(${(input * 100 * -1).toFixed(1)}) pp`;
};

export const prettify_gen = (input) => {
  if (input === Infinity) {
    return inf_symbol;
  } else if (input === -Infinity) {
    return `(${inf_symbol})`;
  }
  return Math.abs(input) - 1e-5 < 0
    ? "-"
    : Math.abs(input) < 10 ? ( input > 0 ? `${(input * 1).toFixed(1)}` : `(${(input * -1).toFixed(1)})`)
    : input > 0
    ? `${(input * 1).toFixed(0)}`
    : `(${(input * -1).toFixed(0)})`;
};

export const prettify_multiple = (input) => {
  if (input === Infinity) {
    return `${inf_symbol}x`;
  } else if (input === -Infinity) {
    return `(${inf_symbol})x`;
  }
  return input > 0
    ? `${(input * 1).toFixed(1)}x`
    : `(${(input * -1).toFixed(1)})x`;
};
