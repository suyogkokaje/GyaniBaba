import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

//function to load the messages
function loader(element) {
    element.textContent = '';//initially empty

    loadInterval = setInterval(() => {
        element.textContent += '.';//append dot to the element

        if (element.textContent === '....') {
            //if element has 4 dots, then make it empty
            element.textContent = '';
        }
    }, 300);
}

//function to simulate the typing effect
function typeText(element, text) {
    let i = 0;//starting with the 0th index (1st character)
    let interval = setInterval(() => {
        if (i < text.length) {
            //if the typing is not completed,
            //then append the next character
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);//clear the interval as we have reached the end of the text
        }
    }, 20);
}

//function to create the unique id for each message
function generateId() {
    //to make the id unique, we will use the current timestamp and a random number in the hexadecimal format
    const timeStamp = Date.now();
    const randomNum = Math.random();
    const hex = randomNum.toString(16);

    return `id-${timeStamp}-${hex}`;
}

//function to create the message tile
function messageTile(isAI, val, uniqueId) {
    //params:
    //isAI: boolean to check if the message is from the AI or the user
    //val: the text of the message
    //uniqueId: the unique id of the message
    return (
        `
        <div class="wrapper ${isAI && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                        src=${isAI ? bot : user}
                    />
                </div>
                <div class="message" id=${uniqueId}>${val}</div>
            </div>
        </div>

        `
    )
}

const handleFormSubmit = async (e) => {
    //params:
    //e: the event object

    e.preventDefault();//prevent the default behaviour of the browser
    const data = new FormData(form);//get the form data

    //user's message tile
    chatContainer.innerHTML += messageTile(false, data.get('prompt'));
    //passed false because its not AI's message
    form.reset();//reset the form

    //AI's message tile
    const uniqueId = generateId();//generate the unique id
    chatContainer.innerHTML += messageTile(true, " ", uniqueId);
    //passed true because its AI's message

    chatContainer.scrollTop = chatContainer.scrollHeight;
    //scroll to the bottom of the chat container

    const messageDiv = document.getElementById(uniqueId);
    //get the message div by the unique id
    loader(messageDiv);//load the message

    //fetch the data from the server - the AI's response

    const response = await fetch('https://gyanibaba69.onrender.com/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt'),
        }),
    });

    clearInterval(loadInterval);//clear the interval as the response has been received
    messageDiv.innerHTML = " ";//empty the message div

    if(response.ok){
        const data = await response.json();
        const parsedData = data.bot.trim();
        typeText(messageDiv, parsedData);
    }else{
        const err  = await response.text();
        messageDiv.innerHTML = "Something went wrong";
        alert(err);
    }
}

form.addEventListener('submit', handleFormSubmit);
//listen for the form submit event
//and call the handleFormSubmit function when the event is triggered i.e. when the form is submitted

form.addEventListener('keyup', (e) => {
    //listen for the keyup event
    //and call the handleFormSubmit function when the enter key is pressed
    if (e.key === 'Enter') {//13 is the keycode for the enter key
        handleFormSubmit(e);
    }
});

