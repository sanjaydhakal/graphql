import { printSchema } from 'graphql';
import mongoose from 'mongoose';
import { Sequelize, DataTypes } from 'sequelize';
import _ from 'lodash';
import casual from 'casual';

// Connect to MongoDB
async function connectMongo() {
    try {
        await mongoose.connect('mongodb://localhost/widgets', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
}

connectMongo();

// Define MongoDB schema and model
const widgetSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    soldout: String,
    inventory: String,
    stores: Array,
});

const Widgets = mongoose.model('widgets', widgetSchema);

// Initialize Sequelize
const sequelize = new Sequelize('sqlite::memory:');

// Define Sequelize model
const Categories = sequelize.define('categories', {
    category: DataTypes.STRING,
    description: DataTypes.STRING,
});

// Sync and seed categories
async function syncAndSeedCategories() {
    try {
        await sequelize.sync({ force: true });
        console.log('SQL Connection established and Categories model synced');

        // Seed categories
        await Promise.all(
            _.times(5, () => {
                return Categories.create({
                    category: casual.word,
                    description: casual.sentence,
                });
            })
        );

        console.log('Categories seeded');
    } catch (error) {
        console.log('Error with SQLite DB:', error);
    }
}

syncAndSeedCategories();

export { Widgets, Categories };
