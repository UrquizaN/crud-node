const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const ObjectId = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://urquiza:uzn123456789@crudnode-9ajxw.gcp.mongodb.net/test?retryWrites=true&w=majority";

MongoClient.connect(uri, { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log(err);
    db = client.db('crudnode');
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.get('/', (request, response) => {
    response.render('index.ejs');
});

/*app.get('/', (request, response) => {
    var cursor = db.collection('data').find();
})*/

app.get('/show', (request, response) => {
    db.collection('data').find().toArray((error, results) => {
        if(error) return console.log(error);
            response.render('show.ejs', {data: results});
        });
});

app.post('/show', (request, response) => {
    db.collection('data').save(request.body, (error, result) => {
        if(error) return console.log(error);
        console.log('Salvo no banco de dados');
        response.redirect('/show');
    });
});

app.route('/edit/:id').get((request, response) => {
    var id = request.params.id;

    db.collection('data').find(ObjectId(id)).toArray((error, result) => {
        if (error) return response.send(error);
        response.render('edit.ejs', { data: result });
    });
})
.post((request, response) => {
    var id = request.params.id;
    var name = request.body.name;
    var surname = request.body.surname;
    var cpf = request.body.cpf;
    var nascimento = request.body.nascimento;
    var celular = request.body.celular;
    var email = request.body.email;
    var endereco = request.body.endereco;
    var bairro = request.body.bairro;
    var cidade = request.body.cidade;
    var cep = request.body.cep;
    var sexo = request.body.sexo;

    db.collection('data').updateOne({ _id: ObjectId(id) }, {
        $set: {
            name: name,
            surname: surname,
            cpf: cpf,
            nascimento: nascimento,
            celular: celular,
            email: email,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            cep: cep,
            sexo: sexo
        }
    }, (error, result) => {
        if (error) return response.send(error);
        response.redirect('/show');
        console.log('Atualizado no banco de dados');
    });
});

app.route('/delete/:id').get((request, response) => {
    var id = request.params.id;

    db.collection('data').deleteOne({_id: ObjectId(id)}, (error, result) => {
        if (error) return response.send(error);
        console.log('Deletado do banco de dados');
        response.redirect('/show');
    })
})
