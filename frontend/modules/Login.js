import validator from "validator";

export default class Login{
  constructor(formClass){
    this.form = document.querySelector(formClass);
    }

  init(){
    this.events();
  }

  events() {
    if(!this.form) return; // Se não existir formulário ele retorna
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      this.validate(e);
    })
  }

  validate(e) {
    const el = e.target; // Vai pegar o elemento
    const emailInput = el.querySelector('input[name="email"]'); // vai selecionar o elemento que tenha o nome email
    const passwordInput = el.querySelector('input[name="password"]');
    let error = false;

    if(!validator.isEmail(emailInput.value)){ // Se o valor do email nao for validado ele vai gerar erro
      alert('Email inválido');
      error = true;
    }

    if(passwordInput.value.length < 3 || passwordInput.value.length > 50){ //Validação da senha
      alert('A senha precisa ter entre 3 a 50 caracteres');
      error = true;
    }

    if(!error) el.submit(); // Caso erro seja falso ele vai enviar o fomrulário
  }
}