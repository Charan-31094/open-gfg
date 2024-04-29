const fetch = require('node-fetch');
const fs = require('fs');
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
    'cookie': '   ', 
};

const createHeaders = (additionalHeaders = {}) => {
  const myHeaders = new fetch.Headers();
  Object.entries({ ...commonHeaders, ...additionalHeaders }).forEach(([key, value]) => {
    myHeaders.append(key, value);
  });
  return myHeaders;
};

const registerForQuiz = async () => {
  const myHeaders = createHeaders({
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-User": "?1",
  });

  const raw = JSON.stringify({
    "registerType": "updateStartTime",
    "page_url": "https://practice.geeksforgeeks.org/contest/e-litmus-mock-2-klu"
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  console.log("hi")

  try {
    const response = await fetch("https://practiceapi.geeksforgeeks.org/api/latest/contest/e-litmus-mock-2-klu/register/", requestOptions); //Present Contest URL
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log("Received JSON:", result); 
    return result;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

const postAnswer = async (questionId, correctAnswerIds) => {
  const myHeaders = createHeaders({
    "Content-Length": "111",
   
  });

  const raw = JSON.stringify({
    "response": correctAnswerIds,
    "question_type": "objective"
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const url = `https://practiceapi.geeksforgeeks.org/api/latest/contest/e-litmus-mock-2-klu/quiz/q/${questionId}/submit/`;//Present Contest URL

  const response = await fetch(url, requestOptions);
  return response.text();
};
const postAnswers = async () => {
  const registrationResult = await registerForQuiz();
  console.log("Registration result:", registrationResult);
 try{
   
  
  if (registrationResult.results.status.status !== "SUCCESS") {
    console.error("Registration failed:", registrationResult);
    // return;
  }

}
catch(err){
  console.log(err);
}

  

  const data = fs.readFileSync('./json/ansarray.json', 'utf8');
  const answers = JSON.parse(data);

  const promises = answers.map((answer) => {
    const questionId = answer.qid;
    const correctAnswerIds = answer.ansid.join(','); 
    return postAnswer(questionId, correctAnswerIds);
  });

  try {
    const results = await Promise.all(promises);
    results.forEach((result, index) => {
      console.log(`Result for question ${answers[index].qid}: ${result}`);
    });
  } catch (error) {
    console.error('Error in posting answers:', error);
  }
};

postAnswers();