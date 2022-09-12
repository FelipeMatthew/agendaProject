const { async } = require('regenerator-runtime');
const Contato = require('../models/contatoModels');

exports.index = (req, res) => {
    res.render('contato', { contato: {} });
}

exports.register = async (req, res) => {
    try{
        const contato = new Contato(req.body);
        await contato.register();

        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save( () => res.redirect('/contato/index'));
            return;
        }

        req.flash('success', 'Contato registrado com sucesso');
        req.session.save( () => res.redirect(`/contato/index/${contato.contato._id}`)); //Vai para o id do contato exclusivo
        return;

    }catch(e){
        console.log(e);
        res.render('404');
    }
}

exports.editIndex = async (req, res) => {
    try{
        if(!req.params.id) return res.render('404'); // Se não tiver id de parametro vai retornar pagina de erro      
        
        const contato  = await Contato.buscaId(req.params.id)
        
        if(!contato) return res.render('404');

        res.render('contato', { contato });

    }catch(e){
        res.render('404')
    }
}

exports.edit = async(req, res) =>{
    try{
        if(!req.params.id) return res.render('404');
        const contato = new Contato(req.body);
        await contato.edit(req.params.id); // Para saber qual contato vai atualizar

        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save( () => res.redirect('/contato/index'));
            return;
        }

        req.flash('success', 'Contato editado com sucesso');
        req.session.save( () => res.redirect(`/contato/index/${contato.contato._id}`)); //Vai para o id do contato exclusivo
        return;
       

    }catch(e) {
       console.log(e);
       res.render('404');
    }
}

exports.delete = async function(req, res){
    try{
        if(!req.params.id) return res.render('404'); // Se não tiver id de parametro vai retornar pagina de erro      

        const contato  = await Contato.delete(req.params.id)     
        if(!contato) return res.render('404');

        req.flash('success', 'Contato apagado com sucesso');
        req.session.save( () => res.redirect('back')); 
        return;

    }catch(e){
        res.render('404')
    }
}