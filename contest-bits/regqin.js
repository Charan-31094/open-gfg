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
    'cookie': '      ', 
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

  try {
    const response = await fetch("https://practiceapi.geeksforgeeks.org/api/latest/contest/e-litmus-mock-2-klu/register/", requestOptions);
    if (!response.ok) {
      console.log("Response:", response);
    }
    const result = await response.json();
    console.log("Received JSON:", result);
    return result;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

const getQuizDetails = async () => {
  const myHeaders = createHeaders();

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  try {
    const response = await fetch("https://practiceapi.geeksforgeeks.org/api/latest/contest/e-litmus-mock-2-klu/start/", requestOptions);  //Present Contest URL
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);


    }
    const detailsData = await response.json();
    console.log("Received details JSON:", detailsData);
    return detailsData;
  } catch (error) {
    console.error('Error in getting details:', error);
    throw error;
  }
};

const saveQuestionIds = async (detailsData) => {
  const questionIds = [];
  const quizSection = detailsData.results.sections.quiz_section;
  for (const questionId in quizSection.user_quiz_data) {
    questionIds.push(parseInt(questionId));
  }
  const questionCount = questionIds.length;
  const outputJson = {
    questionIds: questionIds,
    totalQuestions: questionCount
  };
  const outputFile = './json/quiz_details.json';
  fs.writeFileSync(outputFile, JSON.stringify(outputJson, null, 2));

const { exec } = require('child_process');

exec('node qidin-qansidout.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
  exec('node afterans.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  
    
  });

});
  console.log(`Quiz question IDs have been saved to ${outputFile}`);
  console.log(`Total number of quiz questions: ${questionCount}`);
};

const processQuiz = async () => {
  try {
    const registrationResult = await registerForQuiz();
    console.log("Registration result:", registrationResult);
    try{
    if (registrationResult.results.status.status !== "SUCCESS") {
      console.error("Registration failed:", registrationResult);
    }}
    catch(error){
      console.log("Error in registration:", error);
    }
    const detailsData = await getQuizDetails();
    await saveQuestionIds(detailsData);
  } catch (error) {
    console.error('Error during process:', error);
  }
};

processQuiz();