const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const ejs = require('ejs')

const app = express()

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.set('view engine', 'ejs')
app.use(express.static('public'))

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
})
const articleSchema = {
  title: String,
  content: String,
}
const Article = mongoose.model('Article', articleSchema)

app
  .route('/articles')
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (!err) {
        res.send(foundArticles)
      } else {
        res.send(err)
      }
    })
  })
  .post((req, res) => {
    const newArticles = new Article({
      title: req.body.title,
      content: req.body.content,
    })
    newArticles.save((err) => {
      if (!err) {
        res.send('Succesfully added the new article')
      } else {
        res.send(err)
      }
    })
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send('Deleted succesfully!')
      } else {
        res.send(err)
      }
    })
  });


app.route('/articles/:articleTitle')
  .get((req, res) => {
    Article.findOne({ title : req.params.articleTitle}, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle)
      } else {
        res.send("No match was found")
      }
    })
  })
  .put((req, res) => {
    Article.updateMany(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      (err) => {
        if (!err){
          res.send("Updated succesfully")
        } else {
          res.send(err)
        }
      }
      )
  })
  .patch((req, res) => {
    Article.updateOne(
      {title: req.params.articleTitle},

      {$set: req.body}, 
      (err) => {
        if (!err) {
          res.send('Updated succesfully')
        } else {
          res.send(err)
        }
      }
    )
  })
  .delete((req, res) => {
    Article.deleteOne(
      {title: req.params.articleTitle},
      (err) => {
        if (!err){
          res.send("Article deleted accordingly")
        } else {
          res.send(err)
        }
      }
    );
  });




app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
