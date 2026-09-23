const SUFFIXES = {
  k: 3,
  m: 6,
  b: 9,
  t: 12,
  q: 15,

  qa: 18,
  sx: 21,
  sp: 24,
  oc: 27,
  no: 30,
  dc: 33,

  ud: 36,
  dd: 39,
  td: 42,
  qd: 45,
  qnd: 48,
  sxd: 51,
  spd: 54,
  od: 57,
  nd: 60,

  vg: 63,
  uvg: 66,
  dvg: 69,
  tvg: 72,
  qvg: 75,
  qnv: 78,
  sxv: 81,
  spv: 84,
  ovg: 87,
  nvg: 90
};

function parseAmount(input) {
  if (input === undefined || input === null) {
    return null;
  }

  let value = String(input)
    .trim()
    .toLowerCase()
    .replace(/,/g, "");

  const match = value.match(/^(\d+(?:\.\d+)?)([a-z]+)?$/);

  if (!match) {
    return null;
  }

  const number = match[1];
  const suffix = match[2] || "";

  if (!suffix) {
    try {
      return BigInt(number);
    } catch {
      return null;
    }
  }

  const power = SUFFIXES[suffix];

  if (power === undefined) {
    return null;
  }

  const [whole, decimal = ""] = number.split(".");

  if (decimal.length > power) {
    return null;
  }

  const paddedDecimal = decimal.padEnd(power, "0");

  try {
    return BigInt(whole + paddedDecimal) * 10n ** BigInt(power - decimal.length);
  } catch {
    return null;
  }
}

module.exports = parseAmount;