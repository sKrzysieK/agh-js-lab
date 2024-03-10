function sum(x, y) {
  return x + y;
}

function sum_strings(a) {
  return a.reduce((acc, curr) => {
    let num = parseInt(curr);
    if (!isNaN(num)) {
      return acc + num;
    }
    let match = curr.match(/^\d+/);
    if (match) {
      return acc + parseInt(match[0]);
    }
    return acc;
  }, 0);
}

function digits(s) {
  let odd = 0;
  let even = 0;
  for (let i = 0; i < s.length; i++) {
    let num = parseInt(s[i]);
    if (!isNaN(num)) {
      if (num % 2 === 0) {
        even += num;
      } else {
        odd += num;
      }
    }
  }
  return [odd, even];
}

function letters(s) {
  let lower = 0;
  let upper = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i].match(/[a-z]/)) {
      lower++;
    } else if (s[i].match(/[A-Z]/)) {
      upper++;
    }
  }
  return [lower, upper];
}
