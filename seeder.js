const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

//Models
const Blog = require('./models/Blog');
const Category = require('./models/Category');
const User = require('./models/User');

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
const users = JSON.parse(fs.readFileSync('./_data/users.json', 'utf-8'));

const importData = async () => {
  try {
    await Category.create(categories);
    await Blog.create(blogs);
    await User.create(users);
    console.log('Data Imported Succesfully'.green.inverse);
  } catch (error) {
    console.log('Error Importing Data'.red);
    console.log(error);
  }
  process.exit();
};

const destroyData = async () => {
  try {
    await Category.deleteMany();
    await Blog.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed Succesfully'.green.inverse);
  } catch (error) {
    console.log('Error Destroying Data'.red.inverse);
    console.log(error);
  }
  process.exit();
};

const showData = async () => {
  try {
    const categories = await Category.find();
    const blogs = await Blog.find();
    const users = await User.find();
    console.log(categories);
    console.log('\n \n \n');
    console.log(blogs);
    console.log('\n \n \n');
    console.log(users);
  } catch (error) {
    console.log('Error Showing Data'.red.inverse);
    console.log(error);
  }
  process.exit();
};

const showUsers = async () => {
  try {
    const users = await User.find();
    console.log(users);
  } catch (error) {
    console.log(`Error Showing Users`.red.inverse);
    console.log(error);
  }
  process.exit();
};

const showCategories = async () => {
  try {
    const categories = await Category.find();
    console.log(categories);
  } catch (error) {
    console.log(`Error Showing Categories`.red.inverse);
    console.log(error);
  }
  process.exit();
};

const showBlogs = async () => {
  try {
    const blogs = await Blog.find();
    console.log(blogs);
  } catch (error) {
    console.log(`Error Showing Blogs`.red.inverse);
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
} else if (process.argv[2] === '-sb') {
  showBlogs();
} else if (process.argv[2] === '-sc') {
  showCategories();
} else if (process.argv[2] === '-su') {
  showUsers();
}
