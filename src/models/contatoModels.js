const mongoose = require('mongoose');

const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  criadoEm: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body) {
  this.body = body;
  this.errors = [];
  this.contato = null;
}

Contato.prototype.register = async function() {
  this.valida();
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body);
};

Contato.prototype.valida = function() {
  this.cleanUp();

  // Validação
  // O e-mail precisa ser válido
  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
  if(!this.body.nome) this.errors.push('Nome é um campo obrigatório.');
  if(!this.body.email && !this.body.telefone) {
    this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone.');
  }
};

Contato.prototype.cleanUp = function() {
  for(const key in this.body) {
    if(typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone,
  };
};

Contato.prototype.edit = async function(id){
  if(typeof id !== 'string') return;
  this.valida();
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true }); // Encontra o contato por id e edita os contatos, se vai lançar os dados atualizados

}




// Métodos estáticos, nao tem acesso ao this, nem prototype
Contato.buscaId = async function(id){
  if(typeof id !== 'string') return;
  const contato = await ContatoModel.findById(id); // Vai procurar pelo id
  return contato;
}

Contato.buscaContatos = async function() {
  const contatos = await ContatoModel.find() // Vai buscar os contatos que criou, usando o read
    .sort({ criadoEm: -1 }) // ordenado em ordem crescente ou decrescente - 1- Crescente/ -1- Decescente
  return contatos;
}

Contato.delete = async function(id) {
  if(typeof id !== 'string') return;
  const contatos = await ContatoModel.findOneAndDelete({ _id : id }); // vai achar ele e deletar
  return contatos;
}


module.exports = Contato;