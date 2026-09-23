const SUFFIXES = [
  { value: 10n ** 90n, suffix: "Nvg" },
  { value: 10n ** 87n, suffix: "Ovg" },
  { value: 10n ** 84n, suffix: "Spv" },
  { value: 10n ** 81n, suffix: "Sxv" },
  { value: 10n ** 78n, suffix: "Qnv" },
  { value: 10n ** 75n, suffix: "Qvg" },
  { value: 10n ** 72n, suffix: "Tvg" },
  { value: 10n ** 69n, suffix: "Dvg" },
  { value: 10n ** 66n, suffix: "Uvg" },
  { value: 10n ** 63n, suffix: "Vg" },
  { value: 10n ** 60n, suffix: "Nd" },
  { value: 10n ** 57n, suffix: "Od" },
  { value: 10n ** 54n, suffix: "Spd" },
  { value: 10n ** 51n, suffix: "Sxd" },
  { value: 10n ** 48n, suffix: "Qnd" },
  { value: 10n ** 45n, suffix: "Qd" },
  { value: 10n ** 42n, suffix: "Td" },
  { value: 10n ** 39n, suffix: "Dd" },
  { value: 10n ** 36n, suffix: "Ud" },
  { value: 10n ** 33n, suffix: "Dc" },
  { value: 10n ** 30n, suffix: "No" },
  { value: 10n ** 27n, suffix: "Oc" },
  { value: 10n ** 24n, suffix: "Sp" },
  { value: 10n ** 21n, suffix: "Sx" },
  { value: 10n ** 18n, suffix: "Qa" },
  { value: 10n ** 15n, suffix: "Q" },
  { value: 10n ** 12n, suffix: "T" },
  { value: 10n ** 9n, suffix: "B" },
  { value: 10n ** 6n, suffix: "M" },
  { value: 10n ** 3n, suffix: "K" }
];

function formatNumber(input) {
  let value;

  try {
    value = BigInt(input);
  } catch {
    return "0";
  }

  if (value < 0n) {
    return `-${formatNumber(-value)}`;
  }

  for (const suffix of SUFFIXES) {
    if (value >= suffix.value) {
      const whole = value / suffix.value;
      const remainder = value % suffix.value;

      if (remainder === 0n) {
        return `${whole}${suffix.suffix}`;
      }

      const decimal = Number(
        (remainder * 10n) / suffix.value
      );

      if (decimal === 0) {
        return `${whole}${suffix.suffix}`;
      }

      return `${whole}.${decimal}${suffix.suffix}`;
    }
  }

  return value.toString();
}

module.exports = formatNumber;