const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

const Blog = require('./models/Blog');
const Category = require('./models/Category');

dotenv.config({ path: './config/config.env' });

mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const categories = JSON.parse(
  fs.readFileSync('./_data/categories.json', 'utf-8')
);
const blogs = JSON.parse(fs.readFileSync('./_data/blogs.json', 'utf-8'));

const importData = async () => {
  try {
    await Category.create(categories);
    await Blog.create(blogs);
    console.log('Data Imported Succesfully'.green.inverse);
  } catch (error) {
    console.log('Error Importing Data'.red);
  }
  process.exit();
};

const destroyData = async () => {
  try {
    await Category.deleteMany();
    await Blog.deleteMany();
    console.log('Data Desroyed Succesfully'.green.inverse);
  } catch (error) {
    console.log('Error Destroying Data'.red.inverse);
  }
  process.exit();
};

const showData = async () => {
  try {
    const categories = await Category.find();
    const blogs = await Blog.find();
    console.log(categories);
    console.log('\n \n \n');
    console.log(blogs);
  } catch (error) {
    console.log('Error Showing Data'.red.inverse);
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  destroyData();
} else if (process.argv[2] === '-s') {
  showData();
}
