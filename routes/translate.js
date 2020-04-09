const translate = require('@k3rn31p4nic/google-translate-api');
var express = require('express');
const fs = require('fs');
const Axios = require('axios');

var app = express();

// https://github.com/k3rn31p4nic/google-translate-api
app.get('/', (req, res, next) => {
    const { Translate } = require('@google-cloud/translate').v2;
    // Creates a client
    const translate = new Translate();
    let text = req.body.text;
    // GOOGLE TRANSLATE NPM
    /* translate(text, { from: 'en', to: 'es' }).then(res => {
        console.log(res.text);
    }).catch(err => {
        console.error(err);
    }); */

    // GOOGLE TRANSLATE OFFICIAL API
    translateText(res);

});

// SPEECH TO TEXT
app.get('/audio/to/text', (req, res, next) => {
    mainClient();
    main(res).catch(console.error);
});

// TRANSLATE TEXT EN TO ES
app.get('/text/to/text', (req, res, next) => {
    const projectId = 'def-sixbell';
    const location = 'global';
    const text = 'Ola meu amigo';
    let language = detectLanguage(text);
    translateText(projectId, location, text, res, language);
});

async function mainClient() {
    try {
        const { GoogleAuth } = require('google-auth-library');
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/cloud-platform'
        });
        const client1 = await auth.getClient();
        console.log('Client :' + JSON.stringify(client1, null, 4));
        const projectId = await auth.getProjectId();
        console.log('projectId :' + projectId);

        const url = `https://dns.googleapis.com/dns/v1/projects/${projectId}`;
        const res = await client1.request({ url });
        console.log(res);

    } catch (err) {
        console.log('Error init ' + err.toString());
    }
}

async function main(res) {
    // Imports the Google Cloud client library
    const speech = require('@google-cloud/speech');
    // Creates a client
    const client = new speech.SpeechClient();
    // config
    const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 44100,
        languageCode: 'es-CL',
    };
    // Download the file audio
    let filename = await downloadAudio('http://169.62.201.219:8088/getFile/5e664019063536c32aeb5d41');
    // Convert audio to wav format
    await convert(__dirname + '/../' + filename + '.mp4', __dirname + '/../' + filename + '.wav');
    // Get the path of the file
    let filePath = fs.readFileSync(__dirname + '/../' + filename + '.wav');
    // Encode base64
    let fileBase64 = filePath.toString('base64');
    // request to google cloud speech to text
    const request = {
        audio: {
            'content': fileBase64
        },
        config: config,
    };
    // Delete file audio
    fs.unlinkSync(__dirname + '/../' + filename + '.mp4');
    fs.unlinkSync(__dirname + '/../' + filename + '.wav');
    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    // return response
    return res.status(200).json({
        ok: true,
        mensaje: 'Ok',
        traduccion: transcription
    });
}

async function translateText(projectId, location, text, res, language) {
    const { TranslationServiceClient } = require('@google-cloud/translate');
    // Instantiates a client
    const translationClient = new TranslationServiceClient();
    // Construct request
    const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [text],
        mimeType: 'text/plain', // mime types: text/plain, text/html
        sourceLanguageCode: 'pt',
        targetLanguageCode: 'es-CL',
    };
    try {
        // Run request
        const [response] = await translationClient.translateText(request);
        // return response
        return res.status(200).json({
            ok: true,
            mensaje: text,
            traduccion: response.translations[0].translatedText
        });
    } catch (error) {
        console.error('error: ' + error);
    }
}

function downloadAudio(url) {
    var urlParts = url.split("/");
    var fn = Date.now() + "-" + urlParts[urlParts.length - 1];
    const writer = fs.createWriteStream(fn + '.mp4');
    // Only when the file is downloaded
    return new Promise((resolve, reject) => {
        Axios({
            url,
            method: 'GET',
            responseType: 'stream'
        }).then(response => {
            response.data.pipe(writer);
            writer.on('finish', _ => resolve(fn));
            writer.on('error', er => reject(er));
        }).catch(err => {
            reject(err)
        });
    });
}

function convert(input, output, callback) {
    return new Promise(async(resolve, reject) => {
        if (!input && !output) {
            err => reject(err)
        }
        var ffmpeg = require('fluent-ffmpeg');
        // Conversion MP4 TO WAV
        ffmpeg(input)
            .output(output)
            .on('end', _ => resolve('ok!'))
            .on('error', err => reject(err))
            .run();
    });
}

async function detectLanguage(text) {
    // Imports the Google Cloud client library
    const { Translate } = require('@google-cloud/translate').v2;
    // Creates a client
    const translate = new Translate();
    let [detections] = await translate.detect(text);
    detections = Array.isArray(detections) ? detections : [detections];
    console.log('detections[0].language : ' + detections[0].language);
    return detections[0].language;
}


module.exports = app;