const mongoose = require('mongoose'); // gerencia base de dados
const validator = require('validator'); // Validar se algo é valido- ex: email
const bcryptjs = require('bcryptjs'); // Faz a criptografia da senha para que ela nao seja vista no mongodb

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema); // Sempre para registrar em uma base de dados vai retornar umaa PROMISE por isso usa async

// Validação do login com os dados
class Login{
    constructor(body){
        this.body = body;
        this.errors = []; // Se tiver algum erro nao vai cadastrar, vai controlar se pode criar ou nao
        this.user = null;
    }

    async login(){
        this.valida();
        if(this.errors.length > 0) return; 

        this.user = await LoginModel.findOne({ email: this.body.email });

        if(!this.user){
            this.errors.push('User não existe')   
        }
        if(!bcryptjs.compareSync(this.body.password, this.user.password)){
            this.errors.push('Senha inválida');
            this.user = null;
            return;
        }
    }

    async register(){
        this.valida();
        if(this.errors.length > 0) return; // Vai checar se está vazio(Sem errors) e se tiver é sinal que nao houve erro algum 
        
        this.userExists();

        if(this.errors.length > 0) return; // Aqui ele vai checkar na base de dados

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt); 

        this.user = await LoginModel.create(this.body); // Caso passe pela validação da linha 46 ele vai dar valor ao user
            // Mongoose vai criar na base de dados 
    }

    async userExists(){ // Vai checar se existe email igual 
        this.user = await LoginModel.findOne({ email: this.body.email }); // vai ver se existe esse obj no bd, se sim ele retorna, se nao null
        if(this.user) this.errors.push('O usuário ja existe');
        
    }

    valida() {
        this.cleanUp();
        // Validação
        // Email precisa ser valido
        if(!validator.isEmail(this.body.email)) this.errors.push('Email inválido'); // Caso email nao seja valido vai lançar um erro lá para array de errors
        // Senha precisa ter entre 3 e 50
        if(this.body.password.length < 3 || this.body.password.length >= 50 ){
            this.errors.push('A senha precisa ter entre 3 e 50 caracteres');
        }
    }

    cleanUp(){
        for(let key in this.body){ //Se nao for string vai converter em string vazia
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }  
        }
        this.body = { // Validando os dados do ejs e garantindo que so vai retornar o necessário
            email: this.body.email,
            password: this.body.password
        }
    }

    
}

module.exports = Login;