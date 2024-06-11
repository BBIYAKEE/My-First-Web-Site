var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
   dialect: 'sqlite',
   storage: 'database.sqlite'
 });

const comments = sequelize.define( 'comments',
  {
    // Model attributes are defined here
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    // Other model options go here
  },
);

(async() => {
await comments.sync();
})();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', async function (req, res) {
   const comment = await comments.findAll();
   res.render('index', { comments: comment});
});

// app.get('/create', function (req, res) {
//    res.send('hi')
// });
app.post('/create', async function (req, res) {
   console.log(req.body)

   const { content } = req.body
// Create a new comements
   const jane = await comments.create({ content: content });
   
   res.redirect('/')
});

app.post('/update/:id', async function (req, res) {
   
   const { content } = req.body
   const { id } = req.params

   await comments.update(
      { content: content },
      {
      where: {
         id : id,
      },
      },
   );
   res.redirect('/')
});

app.post('/delete/:id', async function (req, res) {
   
   const { id } = req.params

   await comments.destroy({
      where: {
        id: id,
      },
    });
   res.redirect('/')
});



app.listen(3000);
console.log('Server is listening on port 3000');