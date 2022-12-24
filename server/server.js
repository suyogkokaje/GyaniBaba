import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();//access to .env file

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);//instance of OpenAI

const app = express();//initialize express app

//middleware
app.use(cors());
app.use(express.json());

//routes
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Namaste from Gyani Baba',
    })
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,//setting temperatur to 0 as we want to get the exact answer and not any randm answer
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        res.status(200).send({
            bot: response.data.choices[0].text,
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({err});
    }
});

//listen
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});

//if you get an error as follows
//Error: listen EADDRINUSE: address already in use :::5000
//then run the following command in terminal
//sudo lsof -i :5000
//kill -9 <PID>