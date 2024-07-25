import fetch from 'node-fetch';
import fs from 'fs';

const commonHeaders = {
    "Host": "practiceapi.geeksforgeeks.org",
    "Connection": "keep-alive",
    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "DNT": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Content-Type": "application/json",
    "Accept": "*/*",
    "Origin": "https://practice.geeksforgeeks.org",
    "Sec-Fetch-Site": "same-site",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty",
    "Referer": "https://practice.geeksforgeeks.org/",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-GB,en;q=0.9",
    'cookie': '    ', 
};

const createHeaders = (additionalHeaders = {}) => {
    return {
        ...commonHeaders,
        ...additionalHeaders
    };
};

const postAnswer = async (questionId, correctAnswerIds, headers) => {
    const raw = JSON.stringify({
        "response": correctAnswerIds,
        "question_type": "objective"
    });

    const requestOptions = {
        method: 'POST',
        headers: createHeaders(headers),
        body: raw,
        redirect: 'follow'
    };

    const url = `https://practiceapi.geeksforgeeks.org/api/latest/contest/capgemini-mock-5-klu/quiz/q/${questionId}/submit/`;//Do not change this

    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    } catch (error) {
        console.error('Error posting answer:', error.message);
        throw error;
    }
};

const postAnswers = async () => {
    const correctAnswerId = 1120;

    const questionIdsJson = fs.readFileSync('./json/quiz_details.json', 'utf8');
    const questionIdsObject = JSON.parse(questionIdsJson);
    const questionIds = questionIdsObject.questionIds;

    const myHeaders = createHeaders({
    });

    const promises = questionIds.map(questionId => {
        console.log("Question ID:", questionId);
        return postAnswer(questionId, correctAnswerId, myHeaders);
    });

    try {
        const results = await Promise.all(promises);

        const responses = results.map((result, index) => {
            const responseObj = JSON.parse(result);
            console.log('Response:', responseObj);
            const answerIds = responseObj.response.is_multiple_correct
                ? responseObj.response.correct_answer_ids
                : [responseObj.response.correct_answer_ids[0]];
            return {
                qid: questionIds[index],
                ansid: answerIds
            };
        });

        fs.writeFileSync('./json/ansarray.json', JSON.stringify(responses, null, 2), 'utf8');
        console.log('Responses saved to ansarray.json');
    } catch (error) {
        console.error('Error in posting answers:', error);
    }
};

postAnswers();
