function funkcja_zwrotna() {
  const form = document.forms[0];
  console.log(form.pole_tekstowe.value, typeof form.pole_tekstowe.value);
  console.log(form.pole_liczbowe.value, typeof form.pole_liczbowe.value);
}

function promptFun() {
  for (let i = 0; i < 4; i++) {
    let val = window.prompt("Wartość:");
    console.log(val);
    console.log(typeof val);
  }
}
