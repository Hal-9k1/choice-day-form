export function getOrdinal(num) {
  let suffix;
  if (num % 100 > 10 && num % 100 < 14) {
    suffix = 'th';
  } else if (num % 10 === 1) {
    suffix = 'st'
  } else if (num % 10 === 2) {
    suffix = 'nd';
  } else if (num % 10 === 3) {
    suffix = 'rd';
  } else {
    suffix = 'th';
  }
  return num + suffix;
}

export function shouldUseWhiteText(hue) {
  const s = 1;
  const l = 0.5;
  const a = 0.5;
  const f = n => {
    const k = (n + hue / 30) % 12;
    return 0.5 - 0.5 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  // https://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx
  return Math.sqrt(
    f(0) * f(0) * 0.241 +
    f(8) * f(8) * 0.691 +
    f(4) * f(4) * 0.068
  ) < 0.45;
}
